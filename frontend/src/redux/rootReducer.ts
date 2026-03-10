import { combineReducers } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import fieldConfigsReducer from "../store/slices/fieldConfigsSlice";
import projectsReducer from "../store/slices/projectsSlice";
import testCasesReducer from "../store/slices/testCasesSlice";
import apiLogsReducer from "../store/slices/apiLogsSlice";
const rootReducer = combineReducers({
  //auth: authReducer, // Auth slice reducer
  fieldConfigs: fieldConfigsReducer,
  projects: projectsReducer,
  testCases: testCasesReducer,
  apiLogs: apiLogsReducer,
  // Add more slice reducers as needed
});

export default rootReducer;
