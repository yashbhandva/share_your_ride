import api from "./axiosClient";

export const getUnreadCount = async () => {
  const response = await api.get("/api/notifications/unread/count");
  return response.data;
};
