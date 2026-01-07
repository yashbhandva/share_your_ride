import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);
  const userId = localStorage.getItem(import.meta.env.VITE_USER_ID_KEY);
  const userRole = localStorage.getItem(import.meta.env.VITE_USER_ROLE_KEY);

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
      if (!error.config.url.includes("/profile")) {
        localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);
        localStorage.removeItem(import.meta.env.VITE_USER_ROLE_KEY);
        localStorage.removeItem(import.meta.env.VITE_USER_EMAIL_KEY);
        localStorage.removeItem(import.meta.env.VITE_USER_NAME_KEY);
        localStorage.removeItem(import.meta.env.VITE_USER_ID_KEY);

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
