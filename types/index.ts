// For event-related types
export interface Event {
  _id: string;
  name: string;
  type: 'technical' | 'managerial' | 'esports' | 'workshops';
  slug?: string;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  prizeMoney: number;
  entryFee: number;
  aboutEvent: string;
  eventDate?: string;
  venue: string;
  eventPhoto: string;
  registrationDeadline: string;
  rules: { heading: string; content: string }[];
  structuredRules: StructuredRule[];
  structure: StructuredRule[];
  prizeDistribution: PrizeDistribution;
  hideEvent: boolean;
  stopRegistration: boolean;
  contact: EventContact[];
  whatsappGrpLink: string;
  unstopLink: string;
  psLink: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StructuredRule {
  heading: string;
  content: string[];
}

export type EventStatus = 'OPEN' | 'CLOSED' | 'HIDDEN';
export type EventType = 'technical' | 'managerial' | 'esports' | 'workshops';

export interface PrizeDistribution {
  first: number;
  second: number;
  third: number;
}

export interface EventContact {
  name: string;
  whatsappNo: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  college_name?: string;
}

export interface Team {
  _id: string;
  name: string;
  eventId: string;
  leader: string | User;
  members: {
    user: string | User;
    joinedAt: Date;
    status: 'active' | 'pending' | 'left';
  }[];
  inviteToken: string;
  maxSize: number;
  minSize: number;
  currentSize: number;
  isActive: boolean;
  registrationStatus: 'draft' | 'registered' | 'confirmed' | 'cancelled';
  inviteExpiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type DetailedTeam = {

  _id: string;
  name: string;
  eventId: {
    _id: string
    name: string
    type: string
    venue?: string
    eventDate?: string
    isTeamEvent: boolean
    whatsappGrpLink?: string
  }
  leader: { _id: string, name: string; email: string }
  members: {
    user: { _id: string, name: string; email: string };
    joinedAt: Date;
    status: 'active' | 'pending' | 'left';
  }[];
  inviteToken?: string;
  maxSize?: number;
  minSize?: number;
  currentSize?: number;
  isActive?: boolean;
  registrationStatus?: 'draft' | 'registered' | 'confirmed' | 'cancelled';
  inviteExpiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  pendingInvite?: boolean,
  isLeader?: boolean,
}

// Workshop interface
export interface Workshop {
  _id: string;
  name: string;
  slug: string;
  workshopPhoto: string;
  instructor: {
    name: string;
    company: string;
    photo: string;
    linkedin: string;
  };
  duration: string;
  entryFee: number;
  contact: {
    name: string;
    whatsappNo: string;
  }[];
  whatsappGrpLink: string;
  aboutWorkshop: string;
  prerequisites: string[];
  registrationDeadline: string;
  workshopDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  maxParticipants: number;
  registeredCount: number;
  hideWorkshop: boolean;
  stopRegistration: boolean;
  isRegistrationOpen: boolean;
}
