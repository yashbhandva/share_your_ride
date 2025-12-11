import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("userRole");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
   if (userId && !config.headers["X-User-ID"]) {
     config.headers["X-User-ID"] = userId;
   }
   if (userRole && !config.headers["X-User-Role"]) {
     config.headers["X-User-Role"] = userRole;
   }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only redirect to login if it's not a profile request
      if (!error.config.url.includes('/profile')) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
