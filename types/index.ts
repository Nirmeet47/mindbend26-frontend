// For event-related types
export interface Event {
  _id: string;
  name: string;
  type: 'technical' | 'managerial';
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
  rules: string[];
  prizeDistribution: PrizeDistribution;
  hideEvent: boolean;
  stopRegistration: boolean;
  whatsappNo: string;
  whatsappGrpLink: string;
  unstopLink: string;
  psLink: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrizeDistribution {
  first: number;
  second: number;
  third: number;
}

export type EventStatus = 'OPEN' | 'CLOSED' | 'HIDDEN';
export type EventType = 'technical' | 'managerial' | 'cultural';