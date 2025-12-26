import api from "./api";

// Public APIs (no authentication required)
export const publicEventsApi = {
  listByType: (type: "technical" | "managerial" | "workshops") =>
    api.post(`/events/public/type/${type}`),
  get: (idOrSlug: string) => {
    // console.log(localStorage.getItem("authToken") || localStorage.getItem("mb_admin_token"))
    if(localStorage.getItem("authToken") || localStorage.getItem("mb_admin_token")){
      return api.get(`/events/public/user/${idOrSlug}`);
    }
    return api.get(`/events/public/${idOrSlug}`);
  },
};