import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request from localStorage
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('zestora_user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed?.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

// Global response error handling
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired – clear storage
      localStorage.removeItem('zestora_user');
    }
    return Promise.reject(error);
  }
);

export default API;
