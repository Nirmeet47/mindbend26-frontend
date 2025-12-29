'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { EventStatus } from '@/types';
import { useState } from 'react';
import { eventTeamApi } from '@/lib/eventTeam';
import Link from 'next/link';
import { TechDecorationBottomLeft, TechDecorationBottomRight, TechDecorationTopLeft, TechDecorationTopRight } from '../ui/TechDecorations';

interface RegistrationCTAProps {
  eventStatus: EventStatus;
  registrationDeadline: string;
  unstopLink?: string;
  psLink?: string;
  formatDate: (date: string) => string;
  eventId?: string;
  isTeamEvent?: boolean;
  isSvnitian?: boolean;
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({
  eventStatus,
  registrationDeadline,
  unstopLink,
  psLink,
  formatDate,
  eventId,
  isTeamEvent,
  isSvnitian
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
              {/* Status Messages */}
              {regSuccess && (
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
              {/* Internal registration button */}
              { isSvnitian ? (
                <>
              {eventId && !regSuccess && (
                
                  <>
                  {!isTeamEvent && (
                    <button
                      onClick={handleRegister}
                      disabled={regLoading}
                      className="group/register relative px-8 py-4 bg-[#FF4D00] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                      <span className="relative z-10 flex items-center gap-2">
                        {regLoading ? 'Registering...' : 'REGISTER_NOW'}
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
                        REGISTER_NOW
                      </span>
                    </button>
                  )}
                  </>
              )}
              {/* Custom Modal for team name */}
              <AnimatePresence>
                {showTeamModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/90 backdrop-blur-sm"
                      onClick={() => !regLoading && setShowTeamModal(false)}
                    />

                    {/* Modal Container */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="relative w-full max-w-md max-h-[90vh] flex flex-col"
                    >
                    {/* Frame Layer - Non-scrollable, stays fixed */}
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Background Shape with ClipPath */}
                      <div
                        className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-0 border-white/5 shadow-2xl"
                        style={{
                          clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)'
                        }}
                      />

                      {/* Decorative Tech Overlays */}
                      <TechDecorationTopLeft />
                      <TechDecorationTopRight />
                      <TechDecorationBottomRight />
                      <TechDecorationBottomLeft />

                      {/* Gradient Border Lines */}
                      <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-linear-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
                      <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-linear-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
                      <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-linear-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
                      <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-linear-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
                    </div>

                    {/* Close Button */}
                    <button
                      onClick={() => setShowTeamModal(false)}
                      disabled={regLoading}
                      className="absolute top-6 right-6 z-30 w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500 flex items-center justify-center transition-all group pointer-events-auto"
                    >
                      <X className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
                    </button>

                    {/* Scrollable Content - Inside the frame */}
                    <div
                      className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8 pointer-events-auto"
                      style={{
                        clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)'
                      }}
                    >
                      {/* Modal Header */}
                      <div className="mb-6 pb-4 border-b border-white/10">
                        <span className="block text-[10px] font-mono text-[#33ABB9] mb-2 tracking-widest uppercase">
                          TEAM.REGISTRATION // ENTER_DETAILS
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-white font-orbitron tracking-tight uppercase mb-2">
                          Enter Team Name
                        </h2>
                        <p className="text-gray-400 text-sm font-rajdhani">
                          Create a unique name for your team registration
                        </p>
                      </div>

                      {/* Input Section */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-mono text-[#33ABB9] mb-2 tracking-wider uppercase">
                            Team Name
                          </label>
                          <input
                            type="text"
                            className={`w-full px-4 py-3 bg-slate-950/80 border-2 ${teamNameTouched && !teamName.trim() ? 'border-red-500' : 'border-[#33ABB9]/50'} focus:outline-none focus:ring-2 focus:ring-[#33ABB9] focus:border-[#33ABB9] text-white font-rajdhani text-lg transition-all`}
                            placeholder="Enter your team name..."
                            value={teamName}
                            onChange={e => { setTeamName(e.target.value); setTeamNameTouched(true); setRegError(null); }}
                            disabled={regLoading}
                            autoFocus
                          />
                          {teamNameTouched && !teamName.trim() && (
                            <div className="text-red-400 text-xs mt-2 font-mono">Team name is required</div>
                          )}
                          {regError && (
                            <div className="text-red-400 text-sm mt-2 font-rajdhani">{regError}</div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8">
                          <button
                            onClick={handleRegister}
                            disabled={regLoading || !teamName.trim()}
                            className="flex-1 px-6 py-3 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden relative group disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300 opacity-30" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {regLoading ? 'REGISTERING...' : 'REGISTER_TEAM'}
                            </span>
                          </button>
                          <button
                            onClick={() => setShowTeamModal(false)}
                            disabled={regLoading}
                            className="px-6 py-3 border-2 border-white/20 text-white font-bold font-orbitron tracking-wider text-lg hover:bg-white/10 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
              
                </>
              ) : (
                <>

              {/* External links */}
              {unstopLink && (
                <Link
                  href={unstopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/register relative px-8 py-4 bg-[#FF4D00] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                  <span className="relative z-10 flex items-center gap-2">
                    REGISTER_NOW
                  </span>
                </Link>
              )}              
                </>
              )}

              {psLink && (
                <Link
                  href={psLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ps relative px-8 py-4 border border-white text-white font-bold font-orbitron tracking-wider text-lg overflow-hidden transition-colors duration-300 hover:text-black"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/ps:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    READ_PROBLEM_STATEMENT <ExternalLink className="w-4 h-4" />
                  </span>
                </Link>
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
