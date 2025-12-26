'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Crown, Calendar, Trophy, AlertCircle, CheckCircle, Loader2, ArrowRight, Shield, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { eventTeamApi } from '@/lib/eventTeam';

// Tech Decorations matching RegisteredTeamModal style
const TechDecorationTopLeft = () => (
  <svg className="absolute -top-[1px] -left-[1px] w-16 h-16 pointer-events-none" viewBox="0 0 64 64" fill="none">
    <path d="M0 64V16L16 0H64" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
    <path d="M0 16L16 0" fill="#33ABB9" fillOpacity="0.2" />
    <circle cx="16" cy="16" r="2" fill="#33ABB9" />
    <path d="M6 16H26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
    <path d="M16 6V26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

const TechDecorationBottomRight = () => (
  <svg className="absolute -bottom-[1px] -right-[1px] w-20 h-20 pointer-events-none" viewBox="0 0 80 80" fill="none">
    <path d="M80 0V48L64 64H48L32 80H0" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
    <path d="M64 64L32 80V64H64Z" fill="#33ABB9" fillOpacity="0.1" />
    <g transform="translate(60, 60)">
      <circle cx="0" cy="0" r="12" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.8" strokeDasharray="10 5" />
      <circle cx="0" cy="0" r="6" stroke="#33ABB9" strokeWidth="1" fill="#33ABB9" fillOpacity="0.2" />
      <circle cx="0" cy="0" r="2" fill="#ffffff" />
    </g>
  </svg>
);

const TechDecorationTopRight = () => (
  <svg className="absolute -top-[1px] -right-[1px] w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
    <path d="M0 0H32L48 16V32" stroke="#33ABB9" strokeWidth="1.5" />
    <rect x="42" y="6" width="3" height="3" fill="#33ABB9" />
    <rect x="38" y="6" width="3" height="3" fill="#33ABB9" fillOpacity="0.5" />
  </svg>
);

const TechDecorationBottomLeft = () => (
  <svg className="absolute -bottom-[1px] -left-[1px] w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
    <path d="M0 32V48H16" stroke="#33ABB9" strokeWidth="1.5" />
    <path d="M0 32L16 48" stroke="#33ABB9" strokeWidth="0.5" strokeOpacity="0.3" />
  </svg>
);

interface TeamData {
  _id: string;
  name: string;
  eventId: {
    _id: string;
    name: string;
    type: string;
    venue?: string;
    eventDate?: string;
  };
  leader: {
    _id: string;
    name: string;
    email: string;
  };
  members: {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    status: 'active' | 'pending' | 'left';
  }[];
  currentSize: number;
  maxSize: number;
  minSize: number;
  isInviteExpired?: boolean;
}

export default function JoinTeamPage() {
  const params = useParams();
  const router = useRouter();
  const inviteToken = params.inviteToken as string;

  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch team details by invite token
  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const token = localStorage.getItem('authToken') || localStorage.getItem('mb_admin_token');
        
        if (!token) {
          setError('Please login to view this invite');
          setLoading(false);
          return;
        }

        const response = await eventTeamApi.getTeamByInviteToken(inviteToken);
        if (response.data?.data?.team) {
          setTeamData(response.data.data.team);
        }
      } catch (err: any) {
        const errorMsg = err?.response?.data?.message || 'Failed to load team details. The invite may be invalid or expired.';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [inviteToken]);

  const handleJoinTeam = async () => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('mb_admin_token');
    
    if (!token) {
      setError('Please login to join the team');
      setTimeout(() => {
        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      }, 2000);
      return;
    }

    setJoining(true);
    setError(null);

    try {
      const response = await eventTeamApi.joinTeam(inviteToken);
      const data = response.data?.data;
      
      if (data?.team) {
        setSuccess(true);
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/user/dashboard');
        }, 2000);
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to join team. Please try again.';
      setError(errorMsg);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF4D00] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading invite...</p>
        </div>
      </div>
    );
  }

  if (success && teamData) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full relative"
        >
          {/* Background Shape with ClipPath */}
          <div
            className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-[0px] border-white/5 shadow-2xl"
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
          <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
          <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
          <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
          <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />

          {/* Content */}
          <div className="relative z-10 p-6 md:p-8">
            {/* Success Icon */}
            <div className="text-center mb-4">
              <div className="w-16 h-16 mx-auto bg-green-400/20 border-4 border-green-400 flex items-center justify-center mb-3">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <span className="block text-[9px] font-mono text-[#33ABB9] mb-2 tracking-widest uppercase">
                SYS.STATUS // CONNECTION ESTABLISHED
              </span>
              <h1 className="text-2xl md:text-3xl font-black uppercase font-orbitron tracking-tight mb-2">
                WELCOME ABOARD
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-[#33ABB9] to-transparent mx-auto" />
            </div>

            {/* Team Info */}
            <div className="space-y-2 mb-4">
              <div className="bg-white/5 border border-[#33ABB9]/30 p-3">
                <p className="text-[#33ABB9]/60 text-[8px] uppercase tracking-widest mb-1 font-mono">Team</p>
                <p className="text-lg font-bold text-white font-orbitron">{teamData.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-gray-400 text-[8px] uppercase tracking-widest mb-1 font-mono">Event</p>
                  <p className="text-sm font-bold text-[#33ABB9]">{teamData.eventId.name}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-3">
                  <p className="text-gray-400 text-[8px] uppercase tracking-widest mb-1 font-mono">Leader</p>
                  <div className="flex items-center gap-1">
                    <Crown className="w-3 h-3 text-[#E8823A]" />
                    <p className="text-white font-bold text-xs">{teamData.leader.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3">
                <p className="text-gray-400 text-[8px] uppercase tracking-widest mb-1 font-mono">Team Size</p>
                <p className="text-white font-bold font-mono text-base">{teamData.currentSize}/{teamData.maxSize} members</p>
              </div>
            </div>

            {/* Redirect Message */}
            <div className="text-center bg-[#184344]/40 border border-[#33ABB9]/30 p-4">
              <p className="text-gray-300 mb-3 text-sm">
                Redirecting you to your dashboard...
              </p>
              <div className="flex items-center justify-center gap-2 text-[#33ABB9]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-mono uppercase tracking-wider">Processing...</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden selection:bg-[#33ABB9] selection:text-black">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="max-w-lg w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Background Shape with ClipPath */}
            <div
              className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-[0px] border-white/5 shadow-2xl"
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
            <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
            <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
            <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
            <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />

            {/* Content */}
            <div className="relative z-10 p-6 md:p-8">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-[#184344]/60 border-4 border-[#33ABB9]/50 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-[#33ABB9]" />
                </div>
                <span className="block text-[9px] font-mono text-[#33ABB9] mb-2 tracking-widest uppercase">
                  TEAM.INVITE // VERIFICATION_REQUIRED
                </span>
                <h1 className="text-2xl md:text-3xl font-black uppercase font-orbitron tracking-tight mb-2 text-white">
                  JOIN TEAM
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-[#33ABB9] to-transparent mx-auto" />
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 bg-red-500/10 border border-red-500/50 p-3 flex items-start gap-3"
                >
                  <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-bold mb-1 text-sm font-mono uppercase">Error</p>
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Team Details - Only show if team data is loaded */}
              {teamData && (
                <div className="space-y-2 mb-4">
                  <div className="bg-white/5 border border-[#33ABB9]/30 p-3">
                    <p className="text-[#33ABB9]/60 text-[8px] uppercase tracking-widest mb-1 font-mono">Team</p>
                    <p className="text-lg font-bold text-white font-orbitron">{teamData.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 border border-white/10 p-3">
                      <p className="text-gray-400 text-[8px] uppercase tracking-widest mb-1 font-mono">Event</p>
                      <p className="text-sm font-bold text-[#33ABB9]">{teamData.eventId.name}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3">
                      <p className="text-gray-400 text-[8px] uppercase tracking-widest mb-1 font-mono">Leader</p>
                      <div className="flex items-center gap-1">
                        <Crown className="w-3 h-3 text-[#E8823A]" />
                        <p className="text-white font-bold text-xs">{teamData.leader.name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-3">
                    <p className="text-gray-400 text-[8px] uppercase tracking-widest mb-1 font-mono">Team Size</p>
                    <p className="text-white font-bold font-mono text-base">{teamData.currentSize}/{teamData.maxSize} members</p>
                  </div>

                  {/* Current Members */}
                  {teamData.members && teamData.members.length > 0 && (
                    <div className="bg-[#184344]/40 border border-[#33ABB9]/30 p-3">
                      <p className="text-[#33ABB9] text-[8px] uppercase tracking-widest mb-2 font-mono">Members</p>
                      <div className="space-y-1">
                        {teamData.members.map((member, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <div className="w-1 h-1 bg-[#33ABB9]" />
                            <span className="text-white">{member.user.name}</span>
                            {member.status === 'pending' && (
                              <span className="text-[8px] text-yellow-400 font-mono uppercase">(pending)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleJoinTeam}
                  disabled={joining}
                  className="flex-1 group relative px-6 py-3 bg-[#184344]/60 hover:bg-[#33ABB9]/20 border border-[#33ABB9]/50 text-[#33ABB9] font-bold font-orbitron tracking-wider uppercase transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {joining ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Team
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-[#33ABB9]/20 transform -skew-x-12 translate-x-[-150%] group-hover:translate-x-full transition-transform duration-500" />
                </button>

                <button
                  onClick={() => router.push('/')}
                  disabled={joining}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold font-orbitron tracking-wider uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
