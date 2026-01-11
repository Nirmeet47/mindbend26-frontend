'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Google Analytics tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
    
    if (!GA_TRACKING_ID) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    script.onload = () => {
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        (window as any).dataLayer?.push(arguments);
      };
      
      (window as any).dataLayer = (window as any).dataLayer || [];
      window.gtag('js', new Date());
      window.gtag('config', GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Track page views
  useEffect(() => {
    const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
    if (!GA_TRACKING_ID || !window.gtag) return;

    window.gtag('config', GA_TRACKING_ID, {
      page_path: pathname,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}

// Event tracking functions
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackRegistration = (eventType: string) => {
  trackEvent('register', 'engagement', `registration_${eventType}`);
};

export const trackWorkshopView = (workshopName: string) => {
  trackEvent('view_workshop', 'content', workshopName);
};

export const trackEventView = (eventName: string, eventType: string) => {
  trackEvent('view_event', 'content', `${eventType}_${eventName}`);
};