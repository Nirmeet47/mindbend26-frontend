'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { workshopsRegistrationApi } from '@/lib/workshopsApi';

interface WorkshopRegistrationCTAProps {
  workshopId: string;
  workshopName: string;
  registeredCount: number;
  maxParticipants: number;
  isRegistrationOpen: boolean;
  stopRegistration: boolean;
  registrationDeadline?: string;
  isSvnitian?: boolean;
  formatDate: (date: string) => string;
}

const WorkshopRegistrationCTA: React.FC<WorkshopRegistrationCTAProps> = ({
  workshopId,
  workshopName,
  registeredCount,
  maxParticipants,
  isRegistrationOpen,
  stopRegistration,
  registrationDeadline,
  isSvnitian,
  formatDate
}) => {
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [unregLoading, setUnregLoading] = useState(false);

  // Check if user is already registered (you might want to fetch this on component mount)
  const checkRegistrationStatus = async () => {
    try {
      const isUserRegistered = await workshopsRegistrationApi.checkWorkshopRegistration(workshopId);
      setIsRegistered(isUserRegistered);
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  // Call this when component mounts
  React.useEffect(() => {
    checkRegistrationStatus();
  }, [workshopId]);

  const handleRegister = async () => {
    setRegLoading(true);
    setRegError(null);
    try {
      await workshopsRegistrationApi.registerForWorkshop(workshopId);
      setRegSuccess(true);
      setIsRegistered(true);
    } catch (err: any) {
      setRegError(err?.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setRegLoading(false);
    }
  };

  const handleUnregister = async () => {
    setUnregLoading(true);
    setRegError(null);
    try {
      await workshopsRegistrationApi.unregisterFromWorkshop(workshopId);
      setIsRegistered(false);
      setRegSuccess(false);
    } catch (err: any) {
      setRegError(err?.response?.data?.message || err.message || 'Unregistration failed.');
    } finally {
      setUnregLoading(false);
    }
  };

  const isRegOpen = !stopRegistration;

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-y border-white/10 bg-white/5 p-12 md:p-16 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

        {/* Background pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#33ABB9]/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        <h3 className="text-4xl md:text-6xl font-black uppercase mb-8 font-orbitron tracking-tighter">
          Ready to <span className="text-[#33ABB9] inline-block transform hover:skew-x-12 transition-transform">Learn?</span>
        </h3>

        {/* Workshop capacity info */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#33ABB9]/10 border border-[#33ABB9]/30 rounded-lg">
            <span className="text-[#33ABB9] font-orbitron font-bold text-lg">
              {registeredCount}/{maxParticipants} REGISTERED
            </span>
            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#33ABB9] to-cyan-400 transition-all duration-500"
                style={{ width: `${(registeredCount / maxParticipants) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {isRegOpen ? (
          <div className="space-y-8 relative z-10">
            {/* Status Messages */}
            {regSuccess && !isRegistered && (
              <div className="px-8 py-4 bg-green-600/20 border-2 border-green-500/50 text-green-400 font-bold font-orbitron tracking-wider text-lg rounded-lg mx-auto max-w-md">
                Unregistered Successfully!
              </div>
            )}
            {regSuccess && isRegistered && (
              <div className="px-8 py-4 bg-green-600/20 border-2 border-green-500/50 text-green-400 font-bold font-orbitron tracking-wider text-lg rounded-lg mx-auto max-w-md">
                Registration Successful!
              </div>
            )}
            {regError && (
              <div className="px-8 py-4 bg-red-600/20 border-2 border-red-500/50 text-red-400 font-bold font-orbitron tracking-wider text-lg rounded-lg mx-auto max-w-md">
                {regError}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Registration button for SVNIT students */}
              {isSvnitian ? (
                <>
                  {!isRegistered && registeredCount < maxParticipants && (
                    <button
                      onClick={handleRegister}
                      disabled={regLoading}
                      className="group/register relative px-8 py-4 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                      <span className="relative z-10 flex items-center gap-2">
                        {regLoading ? 'REGISTERING...' : 'REGISTER_NOW'}
                      </span>
                    </button>
                  )}

                  {isRegistered && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="px-8 py-4 bg-[#33ABB9]/20 border-2 border-[#33ABB9]/50 text-[#33ABB9] font-bold font-orbitron tracking-wider text-lg rounded-lg">
                        YOU ARE REGISTERED ✓
                      </div>
                      <button
                        onClick={handleUnregister}
                        disabled={unregLoading}
                        className="px-6 py-2 border-2 border-red-500/50 text-red-400 font-bold font-orbitron tracking-wider text-sm hover:bg-red-500/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {unregLoading ? 'UNREGISTERING...' : 'UNREGISTER'}
                      </button>
                    </div>
                  )}

                  {registeredCount >= maxParticipants && !isRegistered && (
                    <div className="px-8 py-4 bg-yellow-600/20 border-2 border-yellow-500/50 text-yellow-400 font-bold font-orbitron tracking-wider text-lg rounded-lg">
                      WORKSHOP FULL
                    </div>
                  )}
                </>
              ) : (
                <div className="px-8 py-4 bg-red-600/20 border-2 border-red-500/50 text-red-400 font-bold font-orbitron tracking-wider text-lg rounded-lg mx-auto max-w-md">
                  ONLY SVNIT STUDENTS CAN REGISTER
                </div>
              )}
            </div>

            {registrationDeadline && (
              <div className="text-center">
                <p className="text-gray-400 font-rajdhani text-lg">
                  Registration Deadline: <span className="text-[#33ABB9] font-bold">{formatDate(registrationDeadline)}</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 text-2xl font-bold font-orbitron tracking-widest border border-red-500/50 inline-block px-6 py-2 bg-red-500/10">
              REGISTRATION_CLOSED
            </p>
            <p className="text-gray-500 font-share-tech-mono">
              Access denied. Max capacity reached or deadline exceeded.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default WorkshopRegistrationCTA;