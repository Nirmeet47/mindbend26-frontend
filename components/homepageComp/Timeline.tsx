'use client'
import { useState, useEffect } from 'react';
import TimelineDesktop from './timeline/Timeline-desktop';
import TimelineMobile from './timeline/Timeline-mobile';

export default function Timeline() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isMobile ? <TimelineMobile /> : <TimelineDesktop />;
}