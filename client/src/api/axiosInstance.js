import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_MODE === 'development'
  ? import.meta.env.VITE_API_LOCAL_BACKEND_URL
  : import.meta.env.VITE_API_SERVER_BACKEND_URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export {
  axiosInstance,
  BASE_URL,
};