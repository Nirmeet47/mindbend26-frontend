import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969/api";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  let token: string | null = null;
  if (typeof window !== "undefined") {
    // Prefer general user token, fallback to admin token
    token = localStorage.getItem("token") || localStorage.getItem("mb_admin_token");
  }
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default api;
