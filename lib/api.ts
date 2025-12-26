import axios from "axios";

// const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6969/api";
const baseURL = "/api/proxy";  // Using proxy rewrite for API calls

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true
});

// localstorage + header authorization implementation (commented out for server-side cookies)
// api.interceptors.request.use((config) => {
//   let token: string | null = null;
//   if (typeof window !== "undefined") {
//     // Prefer general user token, fallback to admin token
//     token = localStorage.getItem("token") || localStorage.getItem("mb_admin_token");
//   }
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers["Authorization"] = `Bearer ${token}`;
//   }
//   return config;
// });

// Server-side cookies implementation - cookies are sent automatically with withCredentials: true
// No manual token management needed on client side

export default api;
