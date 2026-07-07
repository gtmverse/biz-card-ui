import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:4000/api';

const authScheme = import.meta.env.VITE_AUTH_TOKEN_SCHEME || 'Token';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Request interceptor to add JWT token if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bizcard_token');
  if (token) {
    config.headers.Authorization = `${authScheme} ${token}`;
  }
  return config;
});

export default api;
