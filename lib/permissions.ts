// Role-based permission utilities

export type AdminRole = "technical" | "managerial" | "superAdmin" | "dev";

export interface User {
  role: AdminRole;
  email?: string;
}

// Permission checks
export const permissions = {
  canAddEvent: (role: AdminRole): boolean => {
    return ["technical", "managerial", "superAdmin", "dev"].includes(role);
  },
  canUpdateEvent: (role: AdminRole): boolean => {
    return ["technical", "managerial", "superAdmin", "dev"].includes(role);
  },
  canHideEvent: (role: AdminRole): boolean => {
    return ["superAdmin", "dev"].includes(role);
  },
  canViewHiddenEvents: (role: AdminRole): boolean => {
    return ["superAdmin", "dev"].includes(role);
  },
  canViewUsers: (role: AdminRole): boolean => {
    return ["superAdmin", "dev"].includes(role);
  },
  canViewTeams: (role: AdminRole): boolean => {
    return ["superAdmin", "dev"].includes(role);
  },
  canViewSecurity: (role: AdminRole): boolean => {
    return ["superAdmin"].includes(role);
  },
  canBanUser: (role: AdminRole): boolean => {
    return ["superAdmin"].includes(role);
  },
  canManageTeamStatus: (role: AdminRole): boolean => {
    return ["superAdmin", "dev"].includes(role);
  },
  canBanIP: (role: AdminRole): boolean => {
    return ["superAdmin"].includes(role);
  },
};
