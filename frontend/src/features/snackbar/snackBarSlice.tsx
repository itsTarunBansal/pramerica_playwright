// redux/slices/snackBarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackBarState {
  status: boolean;
  message: string;
  type: string;
  totalTime?: Number;
}

const initialState: SnackBarState = {
  status: false,
  message: '',
  type: 'info', // Default type
  totalTime: 1500,
};

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    setSnackBar: (state, action: PayloadAction<SnackBarState>) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.totalTime = action.payload.totalTime || 1500; 
    },
  },
});

export const { setSnackBar } = snackBarSlice.actions;
export default snackBarSlice.reducer;
