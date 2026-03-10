import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../services/axiosClient";

export interface TestCaseItem {
  id: string;
  name: string;
  appUrl: string;
}

export interface RunResult {
  testCaseId: number;
  agentCode: string;
  proposerPAN: string;
  firstName: string;
  lastName: string;
  applicationNumber: string;
  status: string;
  error: string | null;
}

interface TestCasesState {
  items: TestCaseItem[];
  runResults: RunResult[];
  lastRunId: string | null;
  loading: boolean;
  running: boolean;
  saving: boolean;
  error: string | null;
  runError: string | null;
  saveError: string | null;
}

const initialState: TestCasesState = {
  items: [],
  runResults: [],
  lastRunId: null,
  loading: false,
  running: false,
  saving: false,
  error: null,
  runError: null,
  saveError: null,
};

export const fetchTestCases = createAsyncThunk("testCases/fetchAll", async () => {
  const { data } = await axiosClient.get("/test-cases");
  return data as TestCaseItem[];
});

export const saveTestCase = createAsyncThunk(
  "testCases/save",
  async (payload: {
    name: string;
    appUrl: string;
    insuranceInput: object;
    steps: object[];
    tenantId?: string;
  }) => {
    const { data } = await axiosClient.post("/test-cases/", payload);
    return data as TestCaseItem;
  }
);

export const runTests = createAsyncThunk(
  "testCases/run",
  async ({ testCases, projectId }: { testCases: object[]; projectId?: string }) => {
    const { data } = await axiosClient.post("/run-tests", { testCases, projectId });
    return data as { results: RunResult[]; runId?: string };
  }
);

const testCasesSlice = createSlice({
  name: "testCases",
  initialState,
  reducers: {
    clearErrors(state) {
      state.error = null;
      state.runError = null;
      state.saveError = null;
    },
    clearRunResults(state) {
      state.runResults = [];
      state.lastRunId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestCases.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTestCases.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTestCases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load test cases";
      })

      .addCase(saveTestCase.pending, (state) => { state.saving = true; state.saveError = null; })
      .addCase(saveTestCase.fulfilled, (state, action) => {
        state.saving = false;
        state.items.push(action.payload);
      })
      .addCase(saveTestCase.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.error.message ?? "Failed to save test case";
      })

      .addCase(runTests.pending, (state) => { state.running = true; state.runError = null; })
      .addCase(runTests.fulfilled, (state, action) => {
        state.running = false;
        state.runResults = action.payload.results;
        state.lastRunId = action.payload.runId ?? null;
      })
      .addCase(runTests.rejected, (state, action) => {
        state.running = false;
        state.runError = action.error.message ?? "Failed to run tests";
      });
  },
});

export const { clearErrors, clearRunResults } = testCasesSlice.actions;
export default testCasesSlice.reducer;
