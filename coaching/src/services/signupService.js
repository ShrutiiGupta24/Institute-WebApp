import api from "./api";

export const submitSignupRequest = (payload) => api.post("/signup/", payload);

export const fetchSignupRequests = (status) =>
	api.get("/signup/requests", {
		params: status ? { status } : undefined
	});

export const approveSignupRequest = (requestId, notePayload = {}) =>
	api.post(`/signup/${requestId}/approve`, notePayload);

export const rejectSignupRequest = (requestId, notePayload = {}) =>
	api.post(`/signup/${requestId}/reject`, notePayload);
