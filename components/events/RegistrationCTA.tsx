'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { EventStatus } from '@/types';

import { useState } from 'react';
import { X } from 'lucide-react';
import { eventTeamApi } from '@/lib/eventTeam';

interface RegistrationCTAProps {
  eventStatus: EventStatus;
  registrationDeadline: string;
  unstopLink?: string;
  psLink?: string;
  formatDate: (date: string) => string;
  eventId?: string;
  isTeamEvent?: boolean;
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({
  eventStatus,
  registrationDeadline,
  unstopLink,
  psLink,
  formatDate,
  eventId,
  isTeamEvent
}) => {
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamNameTouched, setTeamNameTouched] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const handleRegister = async () => {
    if (!eventId) return;
    setRegLoading(true);
    setRegError(null);
    try {
      if (isTeamEvent) {
        if (!teamName.trim()) {
          setRegError('Please enter a team name.');
          setRegLoading(false);
          setTeamNameTouched(true);
          return;
        }
        await eventTeamApi.register(eventId, teamName.trim());
      } else {
        await eventTeamApi.register(eventId);
      }
      setRegSuccess(true);
      setShowTeamModal(false);
    } catch (err: any) {
      setRegError(err?.response?.data?.message || 'Registration failed.');
    } finally {
      setRegLoading(false);
    }
  };
  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-y border-white/10 bg-white/5 p-12 md:p-16 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4D00]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4D00]" />

        {/* Background pulse */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#FF4D00]/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        <h3 className="text-4xl md:text-6xl font-black uppercase mb-8 font-orbitron tracking-tighter">
          Ready to <span className="text-[#FF4D00] inline-block transform hover:skew-x-12 transition-transform">Dominate?</span>
        </h3>

        {eventStatus === 'OPEN' ? (
          <div className="space-y-8 relative z-10">
            <p className="text-gray-400 max-w-2xl mx-auto font-rajdhani text-lg">
              Portal closes on <span className="text-white font-bold">{formatDate(registrationDeadline)}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Internal registration button */}
              {eventId && !regSuccess && (
                <div className="flex flex-col items-center gap-4 w-full">
                  {!isTeamEvent && (
                    <button
                      onClick={handleRegister}
                      disabled={regLoading}
                      className="group/register relative px-8 py-4 bg-[#FF4D00] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                      <span className="relative z-10 flex items-center gap-2">
                        {regLoading ? 'Registering...' : 'REGISTER NOW'}
                      </span>
                    </button>
                  )}
                  {isTeamEvent && (
                    <button
                      onClick={() => setShowTeamModal(true)}
                      disabled={regLoading}
                      className="group/register relative px-8 py-4 bg-[#FF4D00] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                      <span className="relative z-10 flex items-center gap-2">
                        REGISTER NOW
                      </span>
                    </button>
                  )}
                  {/* Custom Modal for team name */}
                  {showTeamModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                      <div className="fixed inset-0 bg-black/70" onClick={() => !regLoading && setShowTeamModal(false)} />
                      <div className="relative bg-[#18181b] border-2 border-[#FF4D00] rounded-xl shadow-xl p-8 w-full max-w-md mx-auto flex flex-col items-center animate-fadeIn">
                        <button
                          className="absolute top-3 right-3 text-[#FF4D00] hover:text-white transition"
                          onClick={() => setShowTeamModal(false)}
                          disabled={regLoading}
                          aria-label="Close modal"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <div className="text-2xl font-bold text-[#FF4D00] mb-4 font-orbitron">Enter Team Name</div>
                        <input
                          type="text"
                          className={`w-full px-4 py-3 rounded border-2 ${teamNameTouched && !teamName.trim() ? 'border-red-500' : 'border-[#FF4D00]'} focus:outline-none focus:ring-2 focus:ring-[#FF4D00] bg-black text-white font-rajdhani text-lg`}
                          placeholder="Team Name"
                          value={teamName}
                          onChange={e => { setTeamName(e.target.value); setTeamNameTouched(true); setRegError(null); }}
                          disabled={regLoading}
                          autoFocus
                        />
                        {teamNameTouched && !teamName.trim() && (
                          <div className="text-red-500 text-xs mt-1">Team name is required</div>
                        )}
                        {regError && (
                          <div className="text-red-400 text-sm mt-2">{regError}</div>
                        )}
                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleRegister}
                            disabled={regLoading || !teamName.trim()}
                            className="px-6 py-2 bg-[#FF4D00] text-black font-bold rounded hover:bg-[#ff7a33] transition disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {regLoading ? 'Registering...' : 'Register'}
                          </button>
                          <button
                            onClick={() => setShowTeamModal(false)}
                            className="px-6 py-2 bg-gray-700 text-white font-bold rounded hover:bg-gray-600 transition"
                            disabled={regLoading}
                          >Cancel</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {regSuccess && (
                <span className="px-8 py-4 bg-green-600/20 text-green-400 font-bold font-orbitron tracking-wider text-lg rounded">Registration Successful!</span>
              )}
              {regError && (
                <span className="px-8 py-4 bg-red-600/20 text-red-400 font-bold font-orbitron tracking-wider text-lg rounded">{regError}</span>
              )}
              {/* External links */}
              {unstopLink && (
                <a
                  href={unstopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/register relative px-8 py-4 bg-[#FF4D00] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                  <span className="relative z-10 flex items-center gap-2">
                    REGISTER_NOW <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              )}
              {psLink && (
                <a
                  href={psLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ps relative px-8 py-4 border border-white text-white font-bold font-orbitron tracking-wider text-lg overflow-hidden transition-colors duration-300 hover:text-black"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/ps:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    READ_PROBLEM_STATEMENT <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 text-2xl font-bold font-orbitron tracking-widest border border-red-500/50 inline-block px-6 py-2 bg-red-500/10">REGISTRATION_CLOSED</p>
            <p className="text-gray-500 font-share-tech-mono">
              Access denied. Max capacity reached or deadline exceeded.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default RegistrationCTA;
