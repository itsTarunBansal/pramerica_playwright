import { useDispatch } from 'react-redux';
import { setSnackBar } from '../features/snackbar/snackBarSlice';
import { AppDispatch } from '../redux/store';
export const dispatchSnackBar = (message: string) => {
    const dispatch= useDispatch<AppDispatch>()
  dispatch(setSnackBar({ status: true, message, type: 'success' }));
};
