import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Emergency API
export const emergencyAPI = {
  createRequest: (data) => api.post("/emergency/request", data),
  getAllRequests: (params) => api.get("/emergency/requests", { params }),
  getRequestById: (id) => api.get(`/emergency/requests/${id}`),
  updateStatus: (id, data) =>
    api.patch(`/emergency/requests/${id}/status`, data),
  getStats: () => api.get("/emergency/stats"),
};

// NGO API
export const ngoAPI = {
  register: (data) => api.post("/ngos/register", data),
  getAll: (params) => api.get("/ngos", { params }),
  getById: (id) => api.get(`/ngos/${id}`),
  update: (id, data) => api.patch(`/ngos/${id}`, data),
  delete: (id) => api.delete(`/ngos/${id}`),
  findNearby: (params) => api.get("/ngos/nearby", { params }),
};

// Volunteer API
export const volunteerAPI = {
  register: (data) => api.post("/volunteers/register", data),
  getAll: (params) => api.get("/volunteers", { params }),
  getById: (id) => api.get(`/volunteers/${id}`),
  update: (id, data) => api.patch(`/volunteers/${id}`, data),
  delete: (id) => api.delete(`/volunteers/${id}`),
  findNearby: (params) => api.get("/volunteers/nearby", { params }),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  verify: () => api.get("/auth/verify"),
  createAdmin: (data) => api.post("/auth/create-admin", data),
};

export default api;
