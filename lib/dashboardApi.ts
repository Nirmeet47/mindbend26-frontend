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
  listAdmin: (payload = { page: 1, limit: 20 }) =>
    api.post("/events/admin/all", payload),
  getAdmin: (id: string) => api.get(`/events/admin/${id}`),
  create: (body: any) => api.post("/events/create", body),
  update: (id: string, body: any) => api.put(`/events/update/${id}`, body),
  toggleVisibility: (id: string) =>
    api.patch(`/events/toggle-visibility/${id}`),
  toggleRegistration: (id: string) =>
    api.patch(`/events/toggle-registration/${id}`),
  stats: () => api.get("/events/stats"),
  getEventTeams: (id: string) => api.get(`/events/${id}/teams`),
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
};

export const securityApi = {
  status: () => api.get("/security/status"),
  blockIp: (ip: string, reason?: string) =>
    api.post("/security/block-ip", { ip, reason }),
  unblockIp: (ip: string) => api.post("/security/unblock-ip", { ip }),
};

export const getCounts = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data.data.counts;
};
