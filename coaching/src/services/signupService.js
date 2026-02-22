import api from "./api";

export const submitSignupRequest = (payload) => api.post("/signup", payload);
