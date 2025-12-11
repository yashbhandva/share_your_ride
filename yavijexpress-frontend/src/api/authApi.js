import api from "./axiosClient";

// Backend wraps responses in ApiResponse<T> { status, message, data, ... }
// For login we care about the inner JwtResponse in `data`.
export const login = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  // res.data.data is AuthDTO.JwtResponse
  return res.data?.data;
};

export const register = async (payload) => {
  const res = await api.post("/api/auth/register", payload);
  return res.data; // caller may use message/status if needed
};

export const verifyOTP = async (payload) => {
  const res = await api.post("/api/auth/verify-otp", payload);
  return res.data;
};

export const logoutApi = async () => {
  await api.post("/api/auth/logout");
};
