import api from "./api";

export const getNotifications = () => api.get("/notifications");
export const createNotification = (payload) => api.post("/notifications", payload);
export const updateNotification = (id, payload) => api.put(`/notifications/${id}`, payload);
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
