// lib/axios.ts - VERSION MINIMALE FONCTIONNELLE
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  maxRedirects: 0,        
  headers: {
    'Content-Type': 'application/json',
  },
});

// lib/axios.ts
axiosInstance.interceptors.request.use((config) => {
  if (typeof window === 'undefined') return config;
  
  const authStorage = localStorage.getItem('auth-storage');
  
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage);
      const token = parsed.state?.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
    }
  }
  
  return config;
});