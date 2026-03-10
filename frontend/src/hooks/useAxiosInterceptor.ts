// hooks/useAxiosInterceptor.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AXIOS from '../config/Axios';
import { showSnackbar } from '../utils/snackbarUtils';
import { AxiosResponse } from 'axios';

export const useAxiosInterceptor = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const responseInterceptor = AXIOS.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response && response.data && response.data.message && (response.data?.message || response.data?.message?.message || response.data?.message?.msg))
          showSnackbar(dispatch, response?.data?.message?.message || response?.data?.message?.msg || response?.data?.message, 'success');
        else
          showSnackbar(dispatch, "Data Fetch Successsfully", 'success');

        return response;
      },
      (error: any) => {
        const title = String(error?.response?.data?.message?.message || error?.response?.data?.message?.error || error?.response?.data?.message || error?.response?.data?.error)
        const requestUrl = error.config?.url;
        const isUnauthorized = error.response?.status === 401;
        console.error('suryash', requestUrl, isUnauthorized, 'error response', requestUrl !== 'api/auth/ad-login/');
          if (isUnauthorized && !requestUrl.includes('api/auth/ad-login')) {
          console.error('Unauthorized - Redirecting to login...');
          localStorage.removeItem('accessToken');
          showSnackbar(dispatch, title, 'error');
           window.location.href = '/'; // Adjust based on your app's routing
        } else if (error.response?.data?.message) {
          showSnackbar(dispatch, title, 'error');
        } else {
          showSnackbar(dispatch, 'An error occurred', 'error');
        }

        return Promise.reject(error);
      },
    );

    return () => {
      AXIOS.interceptors.response.eject(responseInterceptor);
    };
  }, [dispatch]);
};