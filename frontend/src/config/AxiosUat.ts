import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import SecureStorage from '../utils/SecureStorage';
import { logout } from '../features/auth/authSlice';


const AXIOSUAT: AxiosInstance = axios.create({
  baseURL:'https://apidev.pramericalife.in/',
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, 
});

AXIOSUAT.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = SecureStorage.getItem('token') || '';
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AXIOSUAT.interceptors.response.use(
  (response: AxiosResponse) => {

    return response;
  },
  (error) => {
    const requestUrl = error.config?.url;
    const isUnauthorized = error.response?.status === 401;
       if (isUnauthorized && !requestUrl.includes('api/auth/ad-login')) {
      console.error('Unauthorized - Redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
       window.location.href = '/'; // Adjust based on your app's routing
    }
    return Promise.reject(error);
  },
);

export default AXIOSUAT;
