import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../services/axiosClient";

const DEMO_TENANT_ID = "00000000-0000-0000-0000-000000000001";

export interface FieldConfig {
  id: string;
  fieldName: string;
  label: string;
  section: string;
  actionType: string;
  selector: string;
  inputType: string;
  selectOptions: string[];
  defaultValue: string;
  order: number;
  isRequired: boolean;
  isSkipped: boolean;
  captureAs: string;
  conditions: { ref: string; equals: string }[];
}

interface FieldConfigState {
  items: FieldConfig[];
  loading: boolean;
  error: string | null;
}

const initialState: FieldConfigState = { items: [], loading: false, error: null };

export const fetchFieldConfigs = createAsyncThunk(
  "fieldConfigs/fetchAll",
  async (tenantId: string = DEMO_TENANT_ID) => {
    const { data } = await axiosClient.get(`/field-configs?tenantId=${tenantId}`);
    return data as FieldConfig[];
  }
);

export const addFieldConfig = createAsyncThunk(
  "fieldConfigs/add",
  async (payload: Partial<FieldConfig> & { tenantId?: string }) => {
    if (!payload.tenantId) payload.tenantId = DEMO_TENANT_ID;
    const { data } = await axiosClient.post("/field-configs", payload);
    return data as FieldConfig;
  }
);

export const editFieldConfig = createAsyncThunk(
  "fieldConfigs/edit",
  async ({ id, ...rest }: Partial<FieldConfig> & { id: string }) => {
    const { data } = await axiosClient.put(`/field-configs/${id}`, rest);
    return data as FieldConfig;
  }
);

export const removeFieldConfig = createAsyncThunk(
  "fieldConfigs/remove",
  async (id: string) => {
    await axiosClient.delete(`/field-configs/${id}`);
    return id;
  }
);

export const reorderFieldConfigsThunk = createAsyncThunk(
  "fieldConfigs/reorder",
  async (fieldIds: string[]) => {
    await axiosClient.post("/field-configs/reorder", { fieldIds });
    return fieldIds;
  }
);

const fieldConfigsSlice = createSlice({
  name: "fieldConfigs",
  initialState,
  reducers: {
    setFieldsOptimistic(state, action) {
      state.items = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: FieldConfigState) => { state.loading = true; state.error = null; };
    const rejected = (state: FieldConfigState, action: any) => {
      state.loading = false;
      state.error = action.error.message ?? "Something went wrong";
    };

    builder
      .addCase(fetchFieldConfigs.pending, pending)
      .addCase(fetchFieldConfigs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFieldConfigs.rejected, rejected)

      .addCase(addFieldConfig.pending, pending)
      .addCase(addFieldConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(addFieldConfig.rejected, rejected)

      .addCase(editFieldConfig.pending, pending)
      .addCase(editFieldConfig.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.items.findIndex((f) => f.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(editFieldConfig.rejected, rejected)

      .addCase(removeFieldConfig.pending, pending)
      .addCase(removeFieldConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((f) => f.id !== action.payload);
      })
      .addCase(removeFieldConfig.rejected, rejected)

      .addCase(reorderFieldConfigsThunk.fulfilled, (state, action) => {
        const order = action.payload;
        state.items = [...state.items].sort(
          (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
        );
      });
  },
});

export const { setFieldsOptimistic, clearError } = fieldConfigsSlice.actions;
export default fieldConfigsSlice.reducer;
