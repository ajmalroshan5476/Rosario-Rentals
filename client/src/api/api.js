// src/api/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default API; // ✅ Export the instance

export const getData = () => API.get('/api/your-route'); // Optional helper

