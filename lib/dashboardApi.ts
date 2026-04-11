import api from "./api";

export const usersApi = {
  list: (payload = { page: 1, limit: 20 }) => api.post("/users/all", payload),
  get: (id: string) => api.get(`/users/${id}`),
  create: (body: any) => api.post("/users/create", body),
  ban: (id: string, action: "ban" | "unban", reason?: string) =>
    api.patch(`/users/${id}/ban`, { action, reason }),
  changeRole: (id: string, role: string) =>
    api.patch(`/users/${id}/role`, { role }),
};

export const eventsApi = {
  listAdmin: (payload = { page: 1, limit: 1000 }) =>
    api.post("/events/admin/all", payload),
  getAdmin: (id: string) => api.get(`/events/admin/${id}`),
  create: (body: any) => api.post("/events/create", body, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  update: (id: string, body: any) => api.put(`/events/update/${id}`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  toggleVisibility: (id: string) =>
    api.patch(`/events/toggle-visibility/${id}`),
  toggleRegistration: (id: string) =>
    api.patch(`/events/toggle-registration/${id}`),
  stats: () => api.get("/events/stats"),
  getEventTeams: (id: string) => api.get(`/events/${id}/teams`),
  exportTeamsCSV: (id: string) => api.get(`/events/${id}/teams/export-csv`, {
    responseType: 'blob',
  }),
};

export const teamsApi = {
  myTeams: () => api.get("/teams"),
  register: (body: any) => api.post("/teams/register", body),
  join: (token: string) => api.post(`/teams/join/${token}`),
  getTeam: (id: string) => api.get(`/teams/${id}`),
  removeMember: (teamId: string, memberId: string) =>
    api.delete(`/teams/${teamId}/members/${memberId}`),
  leaveTeam: (teamId: string) => api.post(`/teams/${teamId}/leave`),
  regenerateInvite: (teamId: string) =>
    api.post(`/teams/${teamId}/regenerate-invite`),
  listAdmin: (payload: { page?: number; limit?: number; filter?: any; sortBy?: any } = { page: 1, limit: 20 }) =>
    api.post("/teams/admin/all", payload),
  adminDelete: (id: string, isCodeWars: boolean = false) => {
    if (isCodeWars) {
      return api.delete(`/codewars/admin/${id}`);
    }
    return api.delete(`/teams/admin/${id}`);
  },
};

export const securityApi = {
  status: () => api.get("/security/status"),
  blockIp: (ip: string, reason?: string) =>
    api.post("/security/block-ip", { ip, reason }),
  unblockIp: (ip: string) => api.post("/security/unblock-ip", { ip }),
};

export const workshopsApi = {
  listAdmin: () => api.get("/workshops/admin/all"),
  getAdmin: (id: string) => api.get(`/workshops/admin/${id}`),
  create: (body: any) => {
    // Check if body is FormData, if so, use multipart headers
    if (body instanceof FormData) {
      return api.post("/workshops", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return api.post("/workshops", body);
    }
  },
  update: (id: string, body: any) => {
    // Check if body is FormData, if so, use multipart headers
    if (body instanceof FormData) {
      return api.put(`/workshops/${id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return api.put(`/workshops/${id}`, body);
    }
  },
  toggleVisibility: (id: string) =>
    api.patch(`/workshops/${id}/toggle-visibility`),
  toggleRegistration: (id: string) =>
    api.patch(`/workshops/${id}/toggle-registration`),
  delete: (id: string) => api.delete(`/workshops/${id}`),
  // Payment verification endpoints
  getAllPayments: () => api.get("/admin/workshops/payments"),
  getPendingPayments: () => api.get("/admin/workshops/payments/pending"),
  approvePayment: (registrationId: string) =>
    api.patch(`/admin/workshops/payments/${registrationId}/approve`),
  rejectPayment: (registrationId: string, reason: string) =>
    api.patch(`/admin/workshops/payments/${registrationId}/reject`, { reason }),
};

export const getCounts = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data.data.counts;
};

export const getAdminInfo = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data.data.adminInfo;
};

export const getTeamStats = async () => {
  const response = await api.get("/admin/stats/teams");
  return response.data.data;
};

export const getEventTeamStats = async () => {
  const response = await api.get("/admin/stats/teams/by-event");
  return response.data.data;
};
