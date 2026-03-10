import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../services/axiosClient";

export interface Project {
  id: string;
  name: string;
  url: string;
}

interface ProjectsState {
  items: Project[];
  current: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = { items: [], current: null, loading: false, error: null };

export const fetchProjects = createAsyncThunk("projects/fetchAll", async () => {
  const { data } = await axiosClient.get("/projects");
  return data as Project[];
});

export const fetchProject = createAsyncThunk("projects/fetchOne", async (id: string) => {
  const { data } = await axiosClient.get(`/projects/${id}`);
  return data as Project;
});

export const createProject = createAsyncThunk(
  "projects/create",
  async (payload: { name: string; url: string }) => {
    const { data } = await axiosClient.post("/projects", payload);
    return data as Project;
  }
);

export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, ...rest }: { id: string; name?: string; url?: string }) => {
    const { data } = await axiosClient.put(`/projects/${id}`, rest);
    return data as Project;
  }
);

export const deleteProject = createAsyncThunk("projects/delete", async (id: string) => {
  await axiosClient.delete(`/projects/${id}`);
  return id;
});

export const startRecording = createAsyncThunk(
  "projects/startRecording",
  async ({ projectId, clearExisting = false }: { projectId: string; clearExisting?: boolean }) => {
    const { data } = await axiosClient.post(`/projects/${projectId}/record/start`, { clearExisting });
    return data;
  }
);

export const stopRecording = createAsyncThunk(
  "projects/stopRecording",
  async (projectId: string) => {
    const { data } = await axiosClient.post(`/projects/${projectId}/record/stop`);
    return data;
  }
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
    clearCurrent(state) { state.current = null; },
  },
  extraReducers: (builder) => {
    const pending = (state: ProjectsState) => { state.loading = true; state.error = null; };
    const rejected = (state: ProjectsState, action: any) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
    };

    builder
      .addCase(fetchProjects.pending, pending)
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, rejected)

      .addCase(fetchProject.pending, pending)
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProject.rejected, rejected)

      .addCase(createProject.pending, pending)
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createProject.rejected, rejected)

      .addCase(updateProject.pending, pending)
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })
      .addCase(updateProject.rejected, rejected)

      .addCase(deleteProject.pending, pending)
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, rejected);
  },
});

export const { clearError, clearCurrent } = projectsSlice.actions;
export default projectsSlice.reducer;
