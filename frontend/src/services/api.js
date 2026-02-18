import axios from 'axios';

// Use REACT_APP_API_URL for production backend URL (set at build time).
// Falls back to '/api' which is useful for local development where CRA proxy is used.
const API_URL = process.env.REACT_APP_API_URL || '/api';

// Helpful debug log so deployed frontends show which API base they will call.
if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.info('API base URL set to:', API_URL);
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
