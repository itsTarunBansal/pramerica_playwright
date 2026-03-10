import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import fieldConfigsReducer from "./slices/fieldConfigsSlice";
import projectsReducer from "./slices/projectsSlice";
import testCasesReducer from "./slices/testCasesSlice";
import apiLogsReducer from "./slices/apiLogsSlice";

export const store = configureStore({
  reducer: {
    fieldConfigs: fieldConfigsReducer,
    projects: projectsReducer,
    testCases: testCasesReducer,
    apiLogs: apiLogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);
