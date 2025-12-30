import api from "./api";

export interface WorkshopRegistration {
  _id: string;
  name: string;
  slug: string;
  workshopDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  instructor: {
    name: string;
    company: string;
    photo: string;
    linkedin: string;
  };
  registeredAt: string;
}

export interface WorkshopRegistrationResponse {
  success: boolean;
  message: string;
  data?: {
    workshop: {
      _id: string;
      name: string;
      registeredCount: number;
      maxParticipants: number;
    };
  };
}

export interface MyWorkshopRegistrationsResponse {
  success: boolean;
  message: string;
  data?: {
    workshops: WorkshopRegistration[];
  };
}

export const workshopsRegistrationApi = {
  // Register for workshop (using slug instead of ID)
  registerForWorkshop: (workshopSlug: string) => 
    api.post(`/workshops/${workshopSlug}/register`),

  // Unregister from workshop (using slug instead of ID)
  unregisterFromWorkshop: (workshopSlug: string) => 
    api.delete(`/workshops/${workshopSlug}/unregister`),

  // Check workshop registration status directly
  checkWorkshopRegistration: (workshopSlug: string) => 
    api.get(`/workshops/${workshopSlug}/check-registration`),

  // Get user's workshop registrations
  getMyWorkshopRegistrations: () => 
    api.get('/workshops/my-registrations'),
};