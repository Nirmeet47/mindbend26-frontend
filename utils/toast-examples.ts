// Example usage of the global toast system throughout your application

import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast, toastMessages } from '@/utils/toast';

// === WORKSHOP/EVENT REGISTRATION ===
// Success
showSuccessToast(toastMessages.registration.success("AI Workshop"));

// Error
showErrorToast(toastMessages.registration.error("User not found"));

// === TEAM MANAGEMENT ===
// Team created
showSuccessToast(toastMessages.team.created("Team Alpha"));

// Joined team
showSuccessToast(toastMessages.team.joined("Team Beta"));

// === USER AUTHENTICATION ===
// Login success
showSuccessToast(toastMessages.auth.loginSuccess);

// Login error
showErrorToast(toastMessages.auth.loginError("Invalid credentials"));

// === GENERAL ACTIONS ===
// Save action
showSuccessToast(toastMessages.general.saved);

// Delete action
showSuccessToast(toastMessages.general.deleted);

// Warning
showWarningToast("DEADLINE APPROACHING\nRegistration closes in 2 hours");

// Info
showInfoToast("MAINTENANCE SCHEDULED\nSystem will be down from 2-4 AM");

// === CUSTOM TOASTS ===
// Quick custom messages
showSuccessToast("PROFILE UPDATED\nYour changes have been saved");

showErrorToast("NETWORK ERROR\nPlease check your connection");

// Custom toast with options
showSuccessToast("CUSTOM MESSAGE", {
  duration: 6000, // Override default 4000ms
  style: {
    // Override any styling if needed
    fontSize: '16px'
  }
});

// === IN COMPONENTS ===
/*
// In any React component:

import { showSuccessToast, showErrorToast, toastMessages } from '@/utils/toast';

const handleSubmit = async () => {
  try {
    await someApiCall();
    showSuccessToast(toastMessages.general.saved);
  } catch (error) {
    showErrorToast(toastMessages.general.error(error.message));
  }
};

// For event registration:
const handleEventRegistration = async (eventName: string) => {
  try {
    await registerForEvent();
    showSuccessToast(toastMessages.registration.success(eventName));
  } catch (error) {
    showErrorToast(toastMessages.registration.error(error.message));
  }
};

// For team actions:
const createTeam = async (teamName: string) => {
  try {
    await createTeamApi(teamName);
    showSuccessToast(toastMessages.team.created(teamName));
  } catch (error) {
    showErrorToast(toastMessages.team.error(error.message));
  }
};
*/