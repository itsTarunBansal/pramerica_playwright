import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer'; // Import combined reducers
import { useDispatch, useSelector } from "react-redux";
const store = configureStore({
  reducer: rootReducer, // Use rootReducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for specific scenarios
    }),
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in non-production environments
});

export type AppDispatch = typeof store.dispatch; // Type for dispatch
export type RootState = ReturnType<typeof rootReducer>; // Type for the root state
export type AppThunk = (
  dispatch: AppDispatch,
  getState: () => RootState,
) => Promise<void>; // Async thunk type

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector<RootState, T>(selector);
export default store;
