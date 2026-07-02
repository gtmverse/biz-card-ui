import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

// Request interceptor to add JWT token if stored in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bizcard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
