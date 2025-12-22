import { Event, EventStatus } from '@/types';

// Format date string for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Calculate days remaining until deadline
export function getDaysRemaining(deadlineString: string): number {
  const deadline = new Date(deadlineString);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}


// Get event status based on flags and deadline
export function getEventStatus(event: Event): EventStatus {
  if (event.hideEvent) return 'HIDDEN';
  if (event.stopRegistration) return 'CLOSED';
  
  const daysRemaining = getDaysRemaining(event.registrationDeadline);
  if (daysRemaining < 0) return 'CLOSED';
  
  return 'OPEN';
}
