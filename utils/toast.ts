import toast from 'react-hot-toast';

// Base toast styling that matches your theme
const baseToastStyle = {
  background: 'rgba(3, 3, 3, 0.95)',
  borderRadius: '0',
  fontFamily: 'Orbitron, monospace',
  fontWeight: '600',
  fontSize: '14px',
  letterSpacing: '0.025em',
  backdropFilter: 'blur(8px)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
  padding: '12px 16px',
  minWidth: '300px'
};

// Success toast with cyan theme
export const showSuccessToast = (message: string, options?: any) => {
  return toast.success(message, {
    duration: 4000,
    style: {
      ...baseToastStyle,
      border: '1px solid rgba(51, 171, 185, 0.6)',
      borderLeft: '4px solid #33ABB9',
      color: '#33ABB9',
      ...options?.style
    },
    ...options
  });
};

// Error toast with red theme
export const showErrorToast = (message: string, options?: any) => {
  return toast.error(message, {
    duration: 4000,
    style: {
      ...baseToastStyle,
      border: '1px solid rgba(239, 68, 68, 0.6)',
      borderLeft: '4px solid #EF4444',
      color: '#EF4444',
      ...options?.style
    },
    ...options
  });
};

// Warning toast with yellow theme
export const showWarningToast = (message: string, options?: any) => {
  return toast((t) => message, {
    duration: 4000,
    style: {
      ...baseToastStyle,
      border: '1px solid rgba(245, 158, 11, 0.6)',
      borderLeft: '4px solid #F59E0B',
      color: '#F59E0B',
      ...options?.style
    },
    icon: '⚠️',
    ...options
  });
};

// Info toast with blue theme
export const showInfoToast = (message: string, options?: any) => {
  return toast((t) => message, {
    duration: 4000,
    style: {
      ...baseToastStyle,
      border: '1px solid rgba(59, 130, 246, 0.6)',
      borderLeft: '4px solid #3B82F6',
      color: '#3B82F6',
      ...options?.style
    },
    icon: 'ℹ️',
    ...options
  });
};

// Custom toast for specific use cases
export const showCustomToast = (message: string, type: 'success' | 'error' | 'warning' | 'info', options?: any) => {
  switch (type) {
    case 'success':
      return showSuccessToast(message, options);
    case 'error':
      return showErrorToast(message, options);
    case 'warning':
      return showWarningToast(message, options);
    case 'info':
      return showInfoToast(message, options);
    default:
      return showSuccessToast(message, options);
  }
};

// Predefined messages for common actions
export const toastMessages = {
  // Registration
  registration: {
    success: (eventName: string) => `REGISTRATION SUCCESSFUL\nYou've registered for ${eventName}`,
    error: (error: string) => `REGISTRATION FAILED\n${error}`,
    alreadyRegistered: 'ALREADY REGISTERED\nYou are already registered for this event',
  },
  
  // Unregistration
  unregistration: {
    success: (eventName: string) => `UNREGISTERED SUCCESSFULLY\nRemoved from ${eventName}`,
    error: (error: string) => `UNREGISTRATION FAILED\n${error}`,
  },
  
  // Team actions
  team: {
    created: (teamName: string) => `TEAM CREATED\n${teamName} has been created successfully`,
    joined: (teamName: string) => `JOINED TEAM\nWelcome to ${teamName}`,
    left: (teamName: string) => `LEFT TEAM\nYou have left ${teamName}`,
    error: (error: string) => `TEAM ACTION FAILED\n${error}`,
  },
  
  // General actions
  general: {
    saved: 'SAVED SUCCESSFULLY\nYour changes have been saved',
    deleted: 'DELETED SUCCESSFULLY\nItem has been removed',
    updated: 'UPDATED SUCCESSFULLY\nChanges have been applied',
    error: (error: string) => `ACTION FAILED\n${error}`,
  },
  
  // Authentication
  auth: {
    loginSuccess: 'LOGIN SUCCESSFUL\nWelcome back!',
    loginError: (error: string) => `LOGIN FAILED\n${error}`,
    logoutSuccess: 'LOGGED OUT\nSee you next time!',
    signupSuccess: 'ACCOUNT CREATED\nWelcome to MindBend!',
    signupError: (error: string) => `SIGNUP FAILED\n${error}`,
  }
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  custom: showCustomToast,
  messages: toastMessages
};