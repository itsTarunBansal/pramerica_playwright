import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import SecureStorage from '../utils/SecureStorage';

const AXIOSFORM: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PATH || '',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  // timeout: 10000, 
});

AXIOSFORM.interceptors.request.use(
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
export default AXIOSFORM;