import api from "./api";
export const processPayment = (data) => api.post("/payment", data);
