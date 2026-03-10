import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const axiosClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach auth token if present
axiosClient.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem("session");
    if (session) {
      try {
        const { token } = JSON.parse(session);
        if (token) config.headers.Authorization = `Bearer ${token}`;
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — normalize errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
