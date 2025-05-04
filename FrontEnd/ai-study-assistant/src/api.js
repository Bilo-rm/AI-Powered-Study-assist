import axios from "axios";

// Create main API instance
const api = axios.create({
  baseURL: "http://localhost:5000",
});

// Add request interceptor to include authentication token for all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth related API calls
export const loginUser = (credentials) => api.post("/auth/login", credentials);
export const registerUser = (userData) => api.post("/auth/register", userData);
export const getCurrentUser = () => api.get("/user/me");

// AI features API calls
export const uploadFile = (file, action) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("action", action);

  return api.post("/api/ai/upload", formData, {
    headers: { 
      "Content-Type": "multipart/form-data" 
      // Authorization header will be added by the interceptor
    },
  });
};

// Response History API calls
export const getResponseHistory = () => api.get("/api/history");
export const getResponseHistoryByAction = (action) => api.get(`/api/history/action/${action}`);
export const getResponseHistoryById = (id) => api.get(`/api/history/${id}`);
export const deleteResponseHistory = (id) => api.delete(`/api/history/${id}`);

export default api;