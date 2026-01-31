'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { EventStatus } from '@/types';
import { useState } from 'react';
import { eventTeamApi } from '@/lib/eventTeam';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TechDecorationBottomLeft, TechDecorationBottomRight, TechDecorationTopLeft, TechDecorationTopRight } from '../ui/TechDecorations';
import { showSuccessToast, showErrorToast, toastMessages } from '@/utils/toast';
import useAuth from '@/hooks/useAuth';

interface RegistrationCTAProps {
  eventStatus: EventStatus;
  registrationDeadline: string;
  unstopLink?: string;
  psLink?: string;
  formatDate: (date: string) => string;
  eventId?: string;
  eventName?: string;
  isTeamEvent?: boolean;
  isSvnitian?: boolean;
  eventType?: 'technical' | 'managerial' | 'esports';
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({
  eventStatus,
  registrationDeadline,
  unstopLink,
  psLink,
  formatDate,
  eventId,
  eventName = 'this event',
  isTeamEvent,
  isSvnitian,
  eventType = 'technical'
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamNameTouched, setTeamNameTouched] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [whatsappGroupLink, setWhatsappGroupLink] = useState<string>('');

  // Theme colors based on event type - using cyan for consistency
  const themeColor = '#33ABB9'; // Always use cyan for consistency
  const themeColorRgb = '51, 171, 185'; // Always use cyan RGB

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showErrorToast('Please login to register for the event');
      router.push('/login');
      return;
    }
    if (!eventId) return;
    setRegLoading(true);
    setRegError(null);
    try {
      let response;
      if (isTeamEvent) {
        if (!teamName.trim()) {
          setRegError('Please enter a team name.');
          setRegLoading(false);
          setTeamNameTouched(true);
          return;
        }
        response = await eventTeamApi.register(eventId, teamName.trim());
        showSuccessToast(toastMessages.team.created(teamName.trim()));
      } else {
        response = await eventTeamApi.register(eventId);
        showSuccessToast(toastMessages.registration.success(eventName));
      }

      // Store WhatsApp group link if available
      const data = response.data?.data;
      if (data?.whatsappGroupLink) {
        setWhatsappGroupLink(data.whatsappGroupLink);
      }

      setRegSuccess(true);
      setShowTeamModal(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Registration failed.';
      setRegError(errorMessage);
      showErrorToast(toastMessages.registration.error(errorMessage));
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
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: themeColor }} />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: themeColor }} />

        {/* Background pulse */}
        <div
          className="absolute inset-0 bg-linear-to-r from-transparent to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
          style={{
            background: `linear-gradient(to right, transparent, rgba(${themeColorRgb}, 0.05), transparent)`
          }}
        />

        <h3 className="text-4xl md:text-6xl font-black uppercase mb-12 font-orbitron tracking-tighter">
          Ready to <span className="inline-block transform hover:skew-x-12 transition-transform" style={{ color: themeColor }}>Dominate?</span>
        </h3>

        {eventStatus === 'OPEN' ? (
          <div className="space-y-8 relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Check authentication first */}
              {!isAuthenticated ? (
                <>
                  {/* Login prompt button for unauthenticated users */}
                  <button
                    onClick={() => {
                      showErrorToast('Please login to register for the event');
                      router.push('/login');
                    }}
                    className="group/register relative px-8 py-4 text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                    style={{ backgroundColor: themeColor }}
                  >
                    <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                    <span className="relative z-10 flex items-center gap-2">
                      LOGIN_TO_REGISTER
                    </span>
                  </button>
                </>
              ) : isSvnitian ? (
                <>
                  {/* Internal registration for authenticated SVNitians */}
                  {eventId && !regSuccess && (
                    <>
                      {!isTeamEvent && (
                        <button
                          onClick={handleRegister}
                          disabled={regLoading}
                          className="group/register relative px-8 py-4 text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                          style={{ backgroundColor: themeColor }}
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
                          className="group/register relative px-8 py-4 text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{ backgroundColor: themeColor }}
                        >
                          <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                          <span className="relative z-10 flex items-center gap-2">
                            REGISTER_NOW
                          </span>
                        </button>
                      )}
                    </>
                  )}

                  {/* Success Display */}
                  {regSuccess && (
                    <div className="space-y-4">
                      <div className="relative px-10 py-4 bg-linear-to-r backdrop-blur-xl border text-white font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                        style={{
                          background: `linear-gradient(to right, rgba(${themeColorRgb}, 0.1), rgba(${themeColorRgb}, 0.05))`,
                          borderColor: `rgba(${themeColorRgb}, 0.4)`
                        }}
                      >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: themeColor }} />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: themeColor }} />

                        {/* Glowing background effect */}
                        <div
                          className="absolute inset-0 bg-linear-to-r from-transparent to-transparent transform -translate-x-full animate-pulse"
                          style={{
                            background: `linear-gradient(to right, transparent, rgba(${themeColorRgb}, 0.2), transparent)`
                          }}
                        />

                        <span className="relative z-10" style={{ color: themeColor }}>
                          {isTeamEvent ? `TEAM REGISTERED: ${teamName}` : 'YOU ARE REGISTERED'}
                        </span>
                      </div>

                      {/* WhatsApp Group Link */}
                      {whatsappGroupLink && (
                        <div className="relative px-6 py-4 bg-linear-to-r backdrop-blur-xl border text-white overflow-hidden"
                          style={{
                            background: `linear-gradient(to right, rgba(37, 211, 102, 0.1), rgba(37, 211, 102, 0.05))`,
                            borderColor: `rgba(37, 211, 102, 0.4)`
                          }}
                        >
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-400" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-400" />

                          <div className="flex items-center justify-center space-x-3">
                            <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.785" />
                            </svg>
                            <span className="font-medium text-green-400">Join WhatsApp Group:</span>
                            <a
                              href={whatsappGroupLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-300 hover:text-green-200 underline font-medium transition-colors"
                            >
                              Click Here to Join
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
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
                  {/* External links for authenticated non-SVNIT users */}
                  <Link
                    href={unstopLink || '#'}
                    target={unstopLink ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!unstopLink) {
                        e.preventDefault();
                        alert('Registration link coming soon! Please contact the event organizers for more information.');
                      }
                    }}
                    className="group/register relative px-8 py-4 text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                    style={{ backgroundColor: themeColor }}
                  >
                    <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                    <span className="relative z-10 flex items-center gap-2">
                      REGISTER_NOW
                    </span>
                  </Link>
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
