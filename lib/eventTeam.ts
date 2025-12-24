import api from "./api";

export const eventTeamApi = {
  register: (eventId: string, teamName?: string) => {
    if (teamName) {
      return api.post(`/events/${eventId}/register`, { teamName });
    }
    return api.post(`/events/${eventId}/register`);
  },
  inviteMemberByEmail: (teamId: string, email: string) =>
    api.post(`/events/team/${teamId}/invite`, { email }),
};
