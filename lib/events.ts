import api from "./api";

// Public APIs (no authentication required)
export const publicEventsApi = {
  listByType: (type: "technical" | "managerial" | "workshops") =>
    api.post(`/events/public/type/${type}`),
  get: (idOrSlug: string) => api.get(`/events/public/${idOrSlug}`),
};