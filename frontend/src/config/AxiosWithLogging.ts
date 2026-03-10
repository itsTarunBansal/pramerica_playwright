import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import SecureStorage from '../utils/SecureStorage';
import { loggerService } from '../services/logger.service';
import { maskSensitiveData } from '../utils/data-masking.util';

interface RequestMetadata {
  requestId: string;
  startTime: number;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: RequestMetadata;
}

const AXIOS: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_PATH || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request Interceptor - Add request ID and track start time
AXIOS.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // Generate unique request ID
    const requestId = uuidv4();
    
    // Store metadata
    config.metadata = {
      requestId,
      startTime: Date.now(),
    };
    
    // Add request ID to headers
    config.headers['X-Request-ID'] = requestId;
    
    // Add auth token
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

// Response Interceptor - Log success and calculate duration
AXIOS.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as CustomAxiosRequestConfig;
    const duration = config.metadata ? Date.now() - config.metadata.startTime : 0;
    
    // Check if slow API (>5 seconds)
    if (duration > 5000 && config.metadata) {
      loggerService.logSlowAPI({
        requestId: config.metadata.requestId,
        url: config.url,
        method: config.method,
        duration,
        statusCode: response.status,
      });
    }

    return response;
  },
  (error: AxiosError) => {
    const config = error.config as CustomAxiosRequestConfig;
    const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0;
    
    // Categorize error
    let errorType = 'API_ERROR';
    if (!error.response) {
      errorType = 'NETWORK_ERROR';
    } else if (error.code === 'ECONNABORTED') {
      errorType = 'TIMEOUT';
    } else if (error.response.status >= 400 && error.response.status < 500) {
      errorType = 'CLIENT_ERROR';
    } else if (error.response.status >= 500) {
      errorType = 'SERVER_ERROR';
    }
    
    // Extract detailed error information
    const responseData = error.response?.data as any;
    const errorDetails = {
      name: error.name,
      code: error.code || responseData?.code || responseData?.errorCode,
      message: responseData?.message || error.message,
      details: responseData?.details || responseData?.error,
      path: responseData?.path || config?.url,
      timestamp: responseData?.timestamp || new Date().toISOString(),
      validationErrors: responseData?.validationErrors || responseData?.errors,
    };
    
    // Log error with full details
    loggerService.logError({
      requestId: config?.metadata?.requestId,
      errorType,
      url: config?.url,
      method: config?.method,
      statusCode: error.response?.status,
      errorMessage: errorDetails.message,
      stackTrace: error.stack,
      errorDetails,
      requestBody: maskSensitiveData(config?.data),
      responseBody: maskSensitiveData(responseData),
      duration,
    });
    
    // Handle 401 redirect
    const requestUrl = error.config?.url;
    const isUnauthorized = error.response?.status === 401;
    if (isUnauthorized && requestUrl !== 'api/auth/ad-login/') {
      console.error('Unauthorized - Redirecting to login...');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  },
);

export default AXIOS;
