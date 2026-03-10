import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import SecureStorage from '../utils/SecureStorage';

// Get base URL based on environment
const getAOBBaseURL = () => {
  const env = process.env.REACT_APP_ENV || 'development';
  
  switch (env) {
    case 'production':
      return 'https://api.pramericalife.in/aob/api';
    case 'development':
      return 'https://apidev.pramericalife.in/aob/api';
    case 'uat':
      return 'http://localhost:3050/api'; // Local backend
    default:
      return 'https://apidev.pramericalife.in/aob/api';
  }
};

// AOB API Axios instance (for all APIs except document upload)
const AOB_AXIOS: AxiosInstance = axios.create({
  baseURL: getAOBBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Document Upload Axios instance (separate base URL)
const getDocumentUploadURL = () => {
  const env = process.env.REACT_APP_ENV || 'development';
  
  switch (env) {
    case 'production':
      return 'https://api.pramericalife.in/aob-upload/api';
    case 'development':
      return 'https://apidev.pramericalife.in/aob-upload/api';
    case 'uat':
      return 'http://localhost:3050/api'; // Local backend
    default:
      return 'https://apidev.pramericalife.in/aob-upload/api';
  }
};

const AOB_DOCUMENT_AXIOS: AxiosInstance = axios.create({
  baseURL: getDocumentUploadURL(),
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // Longer timeout for file uploads
});

// Request interceptor for AOB_AXIOS
AOB_AXIOS.interceptors.request.use(
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

// Response interceptor for AOB_AXIOS
AOB_AXIOS.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url;
    const isUnauthorized = error.response?.status === 401;
    if (isUnauthorized && !requestUrl?.includes('api/auth/ad-login')) {
      console.error('Unauthorized - Redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

// Request interceptor for AOB_DOCUMENT_AXIOS
AOB_DOCUMENT_AXIOS.interceptors.request.use(
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

// Response interceptor for AOB_DOCUMENT_AXIOS
AOB_DOCUMENT_AXIOS.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const requestUrl = error.config?.url;
    const isUnauthorized = error.response?.status === 401;
    if (isUnauthorized && !requestUrl?.includes('api/auth/ad-login')) {
      console.error('Unauthorized - Redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  },
);

export default AOB_AXIOS;
export { AOB_DOCUMENT_AXIOS };
  