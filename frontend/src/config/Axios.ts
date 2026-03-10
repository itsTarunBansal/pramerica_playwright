import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import SecureStorage from '../utils/SecureStorage';
import { logout } from '../features/auth/authSlice';


const AXIOS: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PATH || '',
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, 
});

AXIOS.interceptors.request.use(
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

AXIOS.interceptors.response.use(
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
    else{

    }
    return Promise.reject(error);
  },
);

export default AXIOS;
