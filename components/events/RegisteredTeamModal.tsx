'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Users, Crown, Copy, Check, RefreshCw, Mail, UserMinus, X, Shield, Zap, ChevronRight } from 'lucide-react';
import { DetailedTeam, Team } from '@/types';
import { eventTeamApi } from '@/lib/eventTeam';

// Tech Decorations matching EventCard style
const TechDecorationTopLeft = () => (
  <svg className="absolute -top-px -left-px w-16 h-16 pointer-events-none" viewBox="0 0 64 64" fill="none">
    <path d="M0 64V16L16 0H64" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
    <path d="M0 16L16 0" fill="#33ABB9" fillOpacity="0.2" />
    <circle cx="16" cy="16" r="2" fill="#33ABB9" />
    <path d="M6 16H26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
    <path d="M16 6V26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
  </svg>
);

const TechDecorationBottomRight = () => (
  <svg className="absolute -bottom-px -right-px w-20 h-20 pointer-events-none" viewBox="0 0 80 80" fill="none">
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
  <svg className="absolute -top-px -right-px w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
    <path d="M0 0H32L48 16V32" stroke="#33ABB9" strokeWidth="1.5" />
    <rect x="42" y="6" width="3" height="3" fill="#33ABB9" />
    <rect x="38" y="6" width="3" height="3" fill="#33ABB9" fillOpacity="0.5" />
  </svg>
);

const TechDecorationBottomLeft = () => (
  <svg className="absolute -bottom-px -left-px w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
    <path d="M0 32V48H16" stroke="#33ABB9" strokeWidth="1.5" />
    <path d="M0 32L16 48" stroke="#33ABB9" strokeWidth="0.5" strokeOpacity="0.3" />
  </svg>
);

interface RegisteredTeamModalProps {
  team: DetailedTeam;
  isLeader: boolean;
  eventId: string;
  eventName: string;
  isFullView?: boolean;
  userEmail?: string;
  onAcceptRejectInvite?: (teamId: string, action: 'accept' | 'reject') => void;
}

const RegisteredTeamModal: React.FC<RegisteredTeamModalProps> = ({ team, isLeader, eventId, eventName, isFullView = true, userEmail, onAcceptRejectInvite }) => {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [inviteToken, setInviteToken] = useState(team.inviteToken);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  const inviteLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/join-team/${inviteToken}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegenerateLink = async () => {
    if (!isLeader) return;
    setRegenerating(true);
    try {
      const response = await eventTeamApi.regenerateInvite(team._id);
      setInviteToken(response.data?.data?.inviteToken || team.inviteToken);
    } catch (err) {
      console.error('Failed to regenerate link:', err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail.trim()) {
      setInviteError('Please enter a valid email');
      return;
    }
    setInviteLoading(true);
    setInviteError(null);
    try {
      await eventTeamApi.inviteMemberByEmail(team._id, inviteEmail.trim());
      setInviteSuccess(true);
      setInviteEmail('');
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
      }, 2000);
    } catch (err: any) {
      setInviteError(err?.response?.data?.message || 'Failed to send invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!isLeader) return;
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await eventTeamApi.removeMember(team._id, memberId);
      window.location.reload();
    } catch (err) {
      console.error('Failed to remove member:', err);
    }
  };

  const handleLeaveTeam = async () => {
    if (isLeader) return;
    if (!confirm('Are you sure you want to leave this team?')) return;
    try {
      await eventTeamApi.leaveTeam(team._id);
      window.location.reload();
    } catch (err) {
      console.error('Failed to leave team:', err);
    }
  };

  const activeMembers = team.members.filter(m => m.status === 'active');
  const pendingMembers = team.members.filter(m => m.status === 'pending');
  
  // For list view - check current user's status
  const currentMember = userEmail ? team.members.find((m) => m.user.email === userEmail) : null;
  const isPending = currentMember?.status === 'pending';
  return (
    <>
      {/* Registration Status Card - Technical Style */}

      {
        isFullView ? (
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group min-h-75 w-full cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          {/* Background Shape with ClipPath */}
          <div
            className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-0 border-white/5 shadow-xl transition-all duration-300 group-hover:bg-[#184344]/40"
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
          <div className="relative z-10 p-8 md:p-10">
            {/* Header with System ID */}
            <div className="mb-6 pl-3 border-l-2 border-[#33ABB9]/50">
              <span className="block text-[10px] font-mono text-[#33ABB9] mb-2 tracking-widest uppercase">
                SYS.STATUS // REGISTRATION CONFIRMED
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide group-hover:text-[#33ABB9] transition-colors uppercase font-orbitron mb-2">
                {team.name}
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center space-x-2">
                  <div className="h-1 w-1 bg-[#33ABB9] rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-[#33ABB9]/80 bg-[#184344]/30 px-3 py-1 rounded border border-[#33ABB9]/30">
                    TEAM REGISTERED
                  </span>
                </div>
                {isLeader && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#E8823A]/20 border border-[#E8823A]/50 rounded">
                    <Crown className="w-3 h-3 text-[#E8823A]" />
                    <span className="text-xs font-bold text-[#E8823A] uppercase">Leader</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {/* Event Name */}
              <div className="bg-white/5 border border-white/10 rounded p-4 hover:border-[#33ABB9]/30 transition-colors">
                <p className="text-[#33ABB9]/60 text-[9px] uppercase tracking-widest mb-1 font-mono">Event</p>
                <p className="text-white font-bold text-sm truncate">{eventName}</p>
              </div>

              {/* Team Size */}
              <div className="bg-white/5 border border-white/10 rounded p-4 hover:border-[#33ABB9]/30 transition-colors">
                <p className="text-[#33ABB9]/60 text-[9px] uppercase tracking-widest mb-1 font-mono">Team Size</p>
                <p className="text-white font-bold text-lg font-mono">
                  {team.currentSize}
                  <span className="text-gray-500 text-sm">/{team.maxSize}</span>
                </p>
              </div>

              {/* Status */}
              <div className="bg-white/5 border border-white/10 rounded p-4 hover:border-[#33ABB9]/30 transition-colors">
                <p className="text-[#33ABB9]/60 text-[9px] uppercase tracking-widest mb-1 font-mono">Status</p>
                <p className={`font-bold text-sm ${(team.currentSize ?? 0) >= (team.minSize ?? 0) ? 'text-green-400' : 'text-yellow-400'}`}>
                  {(team.currentSize ?? 0) >= (team.minSize ?? 0) ? 'READY' : 'FORMING'}
                </p>
              </div>

              {/* Active Members */}
              <div className="bg-white/5 border border-white/10 rounded p-4 hover:border-[#33ABB9]/30 transition-colors">
                <p className="text-[#33ABB9]/60 text-[9px] uppercase tracking-widest mb-1 font-mono">Active</p>
                <p className="text-white font-bold text-lg font-mono">{activeMembers.length}</p>
              </div>
            </div>

            {/* View Details CTA */}
            <div className="flex justify-end">
              <div className="group/btn relative px-6 py-2 bg-[#184344]/40 hover:bg-[#33ABB9]/20 border border-[#33ABB9]/50 text-[#33ABB9] text-xs font-bold tracking-wider uppercase transition-all overflow-hidden">
                <span className="relative z-10">View Full Details</span>
                <div className="absolute inset-0 bg-[#33ABB9]/20 transform -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-full transition-transform duration-500" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>
        ) : (
          // Compact List View for Dashboard
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm transition-all flex flex-col ${
              currentMember?.status?.toLowerCase() !== 'left' 
                ? 'cursor-pointer hover:border-cyan-400' 
                : 'opacity-60 cursor-not-allowed'
            }`}
            style={{
              clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)"
            }}
            onClick={() => { if (currentMember?.status?.toLowerCase() !== 'left') setShowModal(true); }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-white font-bold text-lg mb-2">{team.name}</h4>
                <div className="flex gap-4 text-cyan-300/70 text-sm">
                  <span className="text-cyan-400">{team.eventId.name}</span>
                  {currentMember?.status !== 'left' && (
                    <>
                      <span>•</span>
                      <span>{activeMembers.length} Active</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex items-center gap-3">
                {isPending ? (
                  <>
                    <span className="px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] bg-yellow-600/30 text-yellow-300 border border-yellow-500/60">
                      Pending
                    </span>
                    {onAcceptRejectInvite && (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 border border-green-500/50 bg-green-500/10 text-green-300 text-[10px] font-bold uppercase hover:bg-green-500/20 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptRejectInvite(team._id, 'accept');
                          }}
                        >
                          Accept
                        </button>
                        <button
                          className="px-3 py-1 border border-red-500/50 bg-red-500/10 text-red-300 text-[10px] font-bold uppercase hover:bg-red-500/20 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAcceptRejectInvite(team._id, 'reject');
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {currentMember?.status?.toLowerCase() === "left" ? (
                      <span className="px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] bg-red-700/30 text-red-300 border border-red-600/60">
                        Left
                      </span>
                    ) : (
                      <span className="px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] bg-green-600/30 text-green-300 border border-green-500/60">
                        Active
                      </span>
                    )}
                  </>
                )}
                {isLeader && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-[#E8823A]/20 border border-[#E8823A]/50">
                    <Crown className="w-3 h-3 text-[#E8823A]" />
                    <span className="text-xs font-bold text-[#E8823A] uppercase">Leader</span>
                  </div>
                )}
                {currentMember?.status?.toLowerCase() !== 'left' && (
                  <ChevronRight className="text-cyan-400" size={20} />
                )}
              </div>
            </div>

            {/* Invite UI for leader */}
            {isLeader && (
              <div className="mt-4 pt-4 border-t border-cyan-500/30">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    className="flex-1 px-3 py-2 border border-cyan-500/30 bg-black/50 text-cyan-300 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                    placeholder="invite@email.com"
                    value={inviteEmail}
                    onChange={(e) => {
                      e.stopPropagation();
                      setInviteEmail(e.target.value);
                      setInviteStatus(null);
                      setInviteError(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    disabled={inviteLoading}
                  />
                  <button
                    className="px-5 py-2 bg-cyan-600/30 hover:bg-cyan-600/40 border border-cyan-500/60 text-cyan-300 font-bold tracking-wider uppercase transition-all disabled:opacity-50 text-sm"
                    disabled={inviteLoading || !inviteEmail}
                    onClick={async (e) => {
                      e.stopPropagation();
                      setInviteLoading(true);
                      setInviteStatus(null);
                      setInviteError(null);
                      try {
                        await eventTeamApi.inviteMemberByEmail(team._id, inviteEmail);
                        setInviteStatus("Invite sent!");
                        setInviteEmail("");
                        setTimeout(() => setInviteStatus(null), 3000);
                      } catch (err: any) {
                        setInviteError(err?.response?.data?.message || "Failed to send invite");
                        setTimeout(() => setInviteError(null), 3000);
                      } finally {
                        setInviteLoading(false);
                      }
                    }}
                  >
                    {inviteLoading ? "Sending..." : "Invite"}
                  </button>
                </div>
                {inviteStatus && (
                  <div className="mt-2 text-green-400 text-xs bg-green-400/10 border border-green-400/30 px-3 py-1">
                    {inviteStatus}
                  </div>
                )}
                {inviteError && (
                  <div className="mt-2 text-red-400 text-xs bg-red-400/10 border border-red-400/30 px-3 py-1">
                    {inviteError}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )
    }
      {/* Full Team Details Modal - Technical Style */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col mx-4"
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

                {/* Decorative Tech Overlays for Modal */}
                <TechDecorationTopLeft />
                <TechDecorationTopRight />
                <TechDecorationBottomRight />
                <TechDecorationBottomLeft />

                {/* Gradient Border Lines */}
                <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
                <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
                <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
                <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 z-30 w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500 flex items-center justify-center transition-all group pointer-events-auto"
              >
                <X className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Scrollable Content - Inside the frame */}
              <div 
                className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pointer-events-auto"
                style={{
                  clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)'
                }}
              >
                {/* Modal Header */}
                <div className="mb-6 pb-4 border-b border-white/10">
                  <span className="block text-[10px] font-mono text-[#33ABB9] mb-2 tracking-widest uppercase">
                    TEAM.INTERFACE // {team.eventId.name}
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-orbitron tracking-tight uppercase mb-2">
                    {team.name}
                  </h2>
                  <div className="h-1 w-24 bg-gradient-to-r from-[#33ABB9] to-transparent" />
                </div>

                {/* Team Stats - Card Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {/* Current Size */}
                  <div className="bg-white/5 border border-[#33ABB9]/30 p-4 relative overflow-hidden group hover:border-[#33ABB9]/50 transition-colors">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-[#33ABB9]/5 rounded-full blur-xl" />
                    <div className="relative">
                      <p className="text-[#33ABB9]/60 text-[9px] uppercase tracking-widest mb-1 font-mono">Current Size</p>
                      <p className="text-2xl font-bold text-[#33ABB9] font-mono">{team.currentSize}</p>
                    </div>
                  </div>

                  {/* Min Size */}
                  <div className="bg-white/5 border border-white/10 p-4 hover:border-[#33ABB9]/30 transition-colors">
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1 font-mono">Min Required</p>
                    <p className="text-2xl font-bold text-white font-mono">{team.minSize}</p>
                  </div>

                  {/* Max Size */}
                  <div className="bg-white/5 border border-white/10 p-4 hover:border-[#33ABB9]/30 transition-colors">
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1 font-mono">Max Capacity</p>
                    <p className="text-2xl font-bold text-white font-mono">{team.maxSize}</p>
                  </div>

                  {/* Status */}
                  <div className={`bg-white/5 border p-4 transition-colors ${(team.currentSize ?? 0) >= (team.minSize ?? 0) ? 'border-green-400/30 hover:border-green-400/50' : 'border-yellow-400/30 hover:border-yellow-400/50'}`}>
                    <p className="text-gray-400 text-[9px] uppercase tracking-widest mb-1 font-mono">Status</p>
                    <p className={`text-lg font-bold font-mono ${(team.currentSize ?? 0) >= (team.minSize ?? 0) ? 'text-green-400' : 'text-yellow-400'}`}>
                      {(team.currentSize ?? 0) >= (team.minSize ?? 0) ? 'READY' : 'FORMING'}
                    </p>
                  </div>
                </div>

                {/* Leader Controls */}
                {isLeader && (
                  <div className="mb-6 bg-gradient-to-r from-[#184344]/40 to-transparent border-l-2 border-[#33ABB9] p-5 relative overflow-hidden">
                    {/* Tech Pattern Background */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #33ABB9 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-[#33ABB9]" />
                        <h3 className="text-lg font-bold text-white font-orbitron uppercase tracking-wider">Leader Controls</h3>
                      </div>

                      {/* Invite Link */}
                      <div className="mb-3">
                        <label className="text-[#33ABB9]/80 text-xs uppercase tracking-wider mb-2 block font-mono">Invite Link</label>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={inviteLink}
                            readOnly
                            className="flex-1 bg-black/50 border border-white/20 px-3 py-2 text-white font-mono text-sm focus:border-[#33ABB9]/50 focus:outline-none transition-colors"
                          />
                          <button
                            onClick={copyInviteLink}
                            className="group/btn relative px-4 py-2 bg-[#184344]/60 hover:bg-[#33ABB9]/20 border border-[#33ABB9]/50 text-[#33ABB9] font-bold tracking-wider uppercase transition-all overflow-hidden text-sm shrink-0"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              {copied ? 'Copied' : 'Copy'}
                            </span>
                            <div className="absolute inset-0 bg-[#33ABB9]/20 transform -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-full transition-transform duration-500" />
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                        <button
                          onClick={handleRegenerateLink}
                          disabled={regenerating}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#33ABB9]/50 text-white text-sm font-medium transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${regenerating ? 'animate-spin' : ''}`} />
                          {regenerating ? 'Regenerating...' : 'Regenerate'}
                        </button>
                        <button
                          onClick={() => setShowInviteModal(true)}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#33ABB9]/50 text-white text-sm font-medium transition-all flex items-center gap-2"
                        >
                          <Mail className="w-3 h-3" />
                          Invite by Email
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Team Members List */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#33ABB9]" />
                    <h4 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">
                      Team Members
                      <span className="text-[#33ABB9] ml-2">({activeMembers.length})</span>
                    </h4>
                  </div>

                  <div className="space-y-2">
                    {activeMembers.map((member, index) => {
                      const memberUserId = typeof member.user === 'string' ? member.user : member.user._id;
                      const isLeaderMember = memberUserId === (typeof team.leader === 'string' ? team.leader : team.leader._id);
                      return (
                        <motion.div
                          key={memberUserId}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 border border-white/10 p-4 hover:border-[#33ABB9]/30 transition-colors relative overflow-hidden group"
                        >
                          {/* Scan line effect on hover */}
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(51,171,185,0.03)_50%)] bg-[length:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${isLeaderMember ? 'bg-gradient-to-br from-[#E8823A] to-[#E8823A]/60 border-2 border-[#E8823A]' : 'bg-[#184344]/40 border-2 border-[#33ABB9]/30'} flex items-center justify-center relative shrink-0`}>
                                {isLeaderMember ? (
                                  <Crown className="w-4 h-4 text-black" />
                                ) : (
                                  <span className="text-[#33ABB9] font-mono font-bold text-sm">{index + 1}</span>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-green-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                  <p className="text-white font-bold text-base truncate">
                                    {typeof member.user === 'object' ? member.user.name : 'Member'}
                                  </p>
                                  {isLeaderMember && (
                                    <span className="px-1.5 py-0.5 bg-[#E8823A]/20 border border-[#E8823A]/50 text-[#E8823A] text-[9px] font-bold font-mono uppercase shrink-0">
                                      Leader
                                    </span>
                                  )}
                                </div>
                                {typeof member.user === 'object' && member.user.email && (
                                  <p className="text-gray-400 text-xs font-mono truncate">{member.user.email}</p>
                                )}
                              </div>
                            </div>

                            {isLeader && !isLeaderMember && (
                              <button
                                onClick={() => handleRemoveMember(memberUserId)}
                                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-400 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 shrink-0"
                              >
                                <UserMinus className="w-3 h-3" />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Pending Invitations */}
                  {pendingMembers.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-bold text-[#33ABB9] font-mono mb-2 uppercase tracking-wider">
                        Pending Invitations ({pendingMembers.length})
                      </h5>
                      <div className="space-y-1">
                        {pendingMembers.map((member) => {
                          const memberUserId = typeof member.user === 'string' ? member.user : member.user._id;
                          const memberEmail = typeof member.user === 'object' ? member.user.email : 'Pending';
                          return (
                            <div key={memberUserId} className="bg-yellow-500/10 border border-yellow-500/30 p-3 flex items-center gap-2">
                              <Zap className="w-3 h-3 text-yellow-400" />
                              <p className="text-yellow-400 text-xs font-mono">
                                {memberEmail} - Awaiting response
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Leave Team Button (Non-Leaders) */}
                  {!isLeader && (
                    <div className="mt-4">
                      <button
                        onClick={handleLeaveTeam}
                        className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 text-red-400 font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <UserMinus className="w-4 h-4" />
                        Leave Team
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invite by Email Modal - Technical Style */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => !inviteLoading && setShowInviteModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md"
            >
              {/* Background Shape */}
              <div
                className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-0 border-white/5 shadow-2xl"
                style={{
                  clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 24px) 100%, 0 100%, 0 16px)'
                }}
              />

              {/* Decorations */}
              <div className="absolute -top-px -left-px w-12 h-12 pointer-events-none">
                <svg viewBox="0 0 48 48" fill="none">
                  <path d="M0 48V12L12 0H48" stroke="#33ABB9" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="2" fill="#33ABB9" />
                </svg>
              </div>
              <div className="absolute -bottom-px -right-px w-16 h-16 pointer-events-none">
                <svg viewBox="0 0 64 64" fill="none">
                  <path d="M64 0V32L48 48H24L16 64H0" stroke="#33ABB9" strokeWidth="1.5" />
                  <circle cx="48" cy="48" r="8" stroke="#33ABB9" strokeWidth="1" strokeDasharray="4 2" fill="#33ABB9" fillOpacity="0.1" />
                </svg>
              </div>

              {/* Border Lines */}
              <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
              <div className="absolute bottom-0 left-0 right-24 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />

              {/* Content */}
              <div className="relative z-10 p-8">
                <button
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 hover:border-red-500 flex items-center justify-center transition-all"
                  onClick={() => setShowInviteModal(false)}
                  disabled={inviteLoading}
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>

                <div className="mb-6">
                  <span className="block text-[10px] font-mono text-[#33ABB9] mb-2 tracking-widest uppercase">
                    TEAM.INVITE // EMAIL_PROTOCOL
                  </span>
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-[#33ABB9]" />
                    <h3 className="text-2xl font-bold text-white font-orbitron uppercase">Invite Member</h3>
                  </div>
                  <div className="h-1 w-20 bg-gradient-to-r from-[#33ABB9] to-transparent mt-2" />
                </div>

                {inviteSuccess ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-400/20 border-2 border-green-400 flex items-center justify-center">
                      <Check className="w-8 h-8 text-green-400" />
                    </div>
                    <p className="text-green-400 font-bold text-lg font-mono">INVITATION_SENT</p>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 mb-4 text-sm">Enter email address to send team invitation:</p>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-[#33ABB9]/30 focus:border-[#33ABB9] focus:outline-none bg-black/50 text-white font-mono text-sm mb-4 transition-colors"
                      placeholder="operative@domain.com"
                      value={inviteEmail}
                      onChange={e => { setInviteEmail(e.target.value); setInviteError(null); }}
                      disabled={inviteLoading}
                      autoFocus
                    />
                    {inviteError && (
                      <div className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/30 p-3 font-mono">
                        ERROR: {inviteError}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={handleInviteMember}
                        disabled={inviteLoading || !inviteEmail.trim()}
                        className="group/btn flex-1 relative px-6 py-3 bg-[#184344]/60 hover:bg-[#33ABB9]/20 border border-[#33ABB9]/50 text-[#33ABB9] font-bold tracking-wider uppercase transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="relative z-10">{inviteLoading ? 'Sending...' : 'Send Invite'}</span>
                        <div className="absolute inset-0 bg-[#33ABB9]/20 transform -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-full transition-transform duration-500" />
                      </button>
                      <button
                        onClick={() => setShowInviteModal(false)}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-medium transition-all"
                        disabled={inviteLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RegisteredTeamModal;
