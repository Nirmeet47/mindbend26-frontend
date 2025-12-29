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
  // Register for workshop
  registerForWorkshop: (workshopId: string) => 
    api.post(`/workshops/${workshopId}/register`),

  // Unregister from workshop
  unregisterFromWorkshop: (workshopId: string) => 
    api.delete(`/workshops/${workshopId}/unregister`),

  // Get user's workshop registrations
  getMyWorkshopRegistrations: () => 
    api.get('/workshops/my-registrations'),

  // Check if user is registered for a workshop
  checkWorkshopRegistration: async (workshopId: string): Promise<boolean> => {
    try {
      const response = await workshopsRegistrationApi.getMyWorkshopRegistrations();
      if (response.data?.data?.workshops) {
        return response.data.data.workshops.some((workshop: WorkshopRegistration) => workshop._id === workshopId);
      }
      return false;
    } catch (error) {
      console.error("Error checking workshop registration:", error);
      return false;
    }
  },
};