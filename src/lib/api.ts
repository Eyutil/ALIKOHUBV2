import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Do NOT auto-remove the token here — let the auth context and
    // individual components decide how to handle 401s.
    // Removing it here was causing legitimate tokens to be wiped when
    // a sub-request (e.g. events list) briefly returned 401.
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized for:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default api;