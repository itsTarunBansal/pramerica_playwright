import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../services/axiosClient";

interface ApiLogsState {
  logs: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ApiLogsState = { logs: [], loading: false, error: null };

export const fetchApiLogs = createAsyncThunk("apiLogs/fetch", async (projectId: string) => {
  const { data } = await axiosClient.get(`/api-logs/${projectId}`);
  return data as any[];
});

export const deleteProjectLogs = createAsyncThunk(
  "apiLogs/deleteProject",
  async (projectId: string) => {
    await axiosClient.delete(`/api-logs/${projectId}`);
    return projectId;
  }
);

export const deleteLogRun = createAsyncThunk(
  "apiLogs/deleteRun",
  async ({ projectId, runId }: { projectId: string; runId: string }) => {
    await axiosClient.delete(`/api-logs/${projectId}/run/${encodeURIComponent(runId)}`);
    return runId;
  }
);

const apiLogsSlice = createSlice({
  name: "apiLogs",
  initialState,
  reducers: {
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state: ApiLogsState) => { state.loading = true; state.error = null; };
    const rejected = (state: ApiLogsState, action: any) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
    };

    builder
      .addCase(fetchApiLogs.pending, pending)
      .addCase(fetchApiLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchApiLogs.rejected, rejected)

      .addCase(deleteProjectLogs.pending, pending)
      .addCase(deleteProjectLogs.fulfilled, (state) => {
        state.loading = false;
        state.logs = [];
      })
      .addCase(deleteProjectLogs.rejected, rejected)

      .addCase(deleteLogRun.pending, pending)
      .addCase(deleteLogRun.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = state.logs.filter((log: any) => log.runId !== action.payload);
      })
      .addCase(deleteLogRun.rejected, rejected);
  },
});

export const { clearError } = apiLogsSlice.actions;
export default apiLogsSlice.reducer;
