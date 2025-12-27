import api from "./api";

export const eventTeamApi = {
  register: (eventId: string, teamName?: string) => {
    if (teamName) {
      return api.post(`/events/${eventId}/register`, { teamName });
    }
    return api.post(`/events/${eventId}/register`);
  },
  joinTeam: (inviteToken: string) =>
    api.post(`/teams/join/${inviteToken}`),
  inviteMemberByEmail: (teamId: string, email: string) =>
    api.post(`/events/team/${teamId}/invite`, { email }),
  respondToInvite: (teamId: string, action: 'accept' | 'reject') =>
    api.post(`/events/team/${teamId}/invite/respond`, { action }),
  regenerateInvite: (teamId: string) =>
    api.post(`/teams/${teamId}/regenerate-invite`),
  removeMember: (teamId: string, memberId: string) =>
    api.delete(`/teams/${teamId}/members/${memberId}`),
  leaveTeam: (teamId: string) =>
    api.post(`/teams/${teamId}/leave`),
  getTeamDetails: (teamId: string) =>
    api.get(`/teams/${teamId}`),
  getTeamByInviteToken: (inviteToken: string) =>
    api.get(`/teams/invite/${inviteToken}`),
  deleteTeam: (teamId: string) => api.delete(`/teams/${teamId}`),
};
