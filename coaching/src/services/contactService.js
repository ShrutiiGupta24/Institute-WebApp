import api from "./api";

export const submitContactQuery = (payload) => {
  return api.post("/contact", payload);
};
