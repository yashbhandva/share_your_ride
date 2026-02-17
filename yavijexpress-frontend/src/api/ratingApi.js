import api from "./axiosClient";

export const submitRating = async (ratingData) => {
  const response = await api.post("/api/ratings", ratingData);
  return response.data;
};

export const getUserRatings = async (userId) => {
  const response = await api.get(`/api/ratings/user/${userId}`);
  return response.data;
};

export const getBookingRating = async (bookingId) => {
  const response = await api.get(`/api/ratings/booking/${bookingId}`);
  return response.data;
};

export const getUserAverageRating = async (userId) => {
  const response = await api.get(`/api/ratings/user/${userId}/average`);
  return response.data;
};

export const deleteRating = async (ratingId) => {
  const response = await api.delete(`/api/ratings/${ratingId}`);
  return response.data;
};
