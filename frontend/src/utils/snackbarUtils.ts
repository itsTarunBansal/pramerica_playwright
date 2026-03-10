// utils/snackbarUtils.ts
import { AppDispatch } from '../redux/store';
import { setSnackBar } from '../features/snackbar/snackBarSlice';

export const showSnackbar = (dispatch: AppDispatch, message: string, type: 'success' | 'error') => {
  dispatch(setSnackBar({
    status: true,
    message,
    type,
  }));
};