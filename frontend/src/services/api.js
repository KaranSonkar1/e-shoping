import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getProducts = () => API.get("/products");
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const createOrder = (data) => API.post("/payment/create-order", data);
export const verifyPayment = (data) => API.post("/payment/verify", data);
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Add JWT token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
