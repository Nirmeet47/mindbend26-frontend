'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { EventStatus } from '@/types';

interface EventsHeaderProps {
  eventName: string;
  eventType: string;
  isTeamEvent?: boolean;
  eventStatus: EventStatus;
  breadcrumbType: 'TECHNICAL' | 'MANAGERIAL' | 'WORKSHOPS';
}

function EventsHeader({ eventName, eventType, isTeamEvent, eventStatus, breadcrumbType }: EventsHeaderProps) {
  const router = useRouter();
  
  // Handle back navigation
  const goHome = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.push('./');
  };

  return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Breadcrumb - Tech Style */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-cyan-500/60 mb-8 font-share-tech-mono uppercase tracking-widest">
          <span className="hover:text-cyan-400 transition-colors cursor-pointer" onClick={goHome}>[ HOME ]</span>
          <span>/</span>
          <span className="hover:text-cyan-400 transition-colors cursor-pointer capitalize" onClick={handleBack}>{breadcrumbType}</span>
          <span>/</span>
          <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{eventName}</span>
        </div>

        {/* Event Title */}
        <div className="relative mb-16 p-8 border-l-2 border-[#33ABB9] bg-linear-to-r from-[#33ABB9]/5 to-transparent">
          {/* Decorative artifacts */}
          <div className="absolute -left-[5px] -top-[5px] w-2 h-2 bg-[#33ABB9]" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
            <div>
              <h1 className="text-5xl md:text-5xl lg:text-7xl font-black font-orbitron uppercase tracking-tighter leading-none text-white mb-4"
                style={{ textShadow: '0 0 20px rgba(51, 171, 185, 0.3)' }}>
                {eventName}
              </h1>
                <p className="text-lg md:text-xl text-gray-400 font-rajdhani uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-0.5 bg-[#00F0FF]" />
                {eventType} Event
                {isTeamEvent !== null && isTeamEvent !== undefined && (
                  <>
                  <span className="text-[#00F0FF]">•</span> {isTeamEvent ? 'Team_Squad' : 'Solo_Operative'}
                  </>
                )}
                </p>
            </div>

            {/* Status Badge - Cyberpunk Style */}
            <div className="relative">
              <div className={`
                relative px-8 py-2 transform -skew-x-12 border
                ${eventStatus === 'OPEN' ? 'border-green-500 bg-green-500/10 text-green-400' :
                  eventStatus === 'CLOSED' ? 'border-red-500 bg-red-500/10 text-red-400' :
                    'border-gray-500 bg-gray-500/10 text-gray-400'}
              `}>
                <div className="transform skew-x-12 font-orbitron font-bold tracking-widest text-lg flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${eventStatus === 'OPEN' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  STATUS: {eventStatus}
                </div>
              </div>
              {/* Decorative lines */}
              <div className="absolute -bottom-2 -right-2 w-full h-[1px] bg-current opacity-30" />
              <div className="absolute -bottom-2 -right-2 w-[1px] h-full bg-current opacity-30" />
            </div>
          </div>
        </div>
      </motion.div>
  );
}

export default EventsHeader;