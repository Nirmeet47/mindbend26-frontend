'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, MapPin, Trophy, ExternalLink, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Event, getEventBySlug, formatDate, getDaysRemaining, getEventStatus } from '@/lib/api/events';

// Lazy load the background scene
const BackgroundScene = dynamic(() => import('@/components/events/BackgroundScene'), {
  ssr: false,
});

type TabType = 'about' | 'structure' | 'rules' | 'contact';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('about');

  // Fetch event data from API
  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const data = await getEventBySlug(slug);
        setEvent(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [slug]);

  // Handle back navigation
  const goHome = () => {
    router.push('/');
  };

  const handleBack = () => {
    router.push('./');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF4D00] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'The event you are looking for does not exist.'}</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-[#FF4D00] text-white font-bold rounded hover:bg-[#FF6020] transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus(event);
  const daysRemaining = getDaysRemaining(event.registrationDeadline.$date);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-[#FF4D00] selection:text-white font-rajdhani tracking-wide relative"
    >
      {/* Background 3D Scene - Reduced opacity */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
        <BackgroundScene />
      </div>

      {/* Cyberpunk Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* Noise Texture */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
      />

      {/* Navigation */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-[#030303]/90 backdrop-blur-md border-b border-white/10"
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-3 group relative px-4 py-2 overflow-hidden"
        >
          <div className="absolute inset-0 border border-white/20 -skew-x-12 group-hover:bg-white/5 transition-all" />
          <div className="w-2 h-2 bg-[#FF4D00] transform rotate-45 group-hover:rotate-90 transition-transform" />
          <span className="font-orbitron font-bold tracking-widest text-sm relative z-10">BACK_SYSTEM</span>
        </button>
        <div className="font-orbitron font-bold tracking-[0.2em] text-[#00F0FF] text-shadow-glow">MINDBEND_2025 // SYSTEM_ACTIVE</div>
      </motion.div> */}

      <div className="relative z-10">
        {/* Event Header */}
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Breadcrumb - Tech Style */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-cyan-500/60 mb-8 font-share-tech-mono uppercase tracking-widest">
              <span className="hover:text-cyan-400 transition-colors cursor-pointer" onClick={goHome}>[ HOME ]</span>
              <span>/</span>
              <span className="hover:text-cyan-400 transition-colors cursor-pointer capitalize" onClick={handleBack}>MANAGERIAL</span>
              <span>/</span>
              <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{event.name}</span>
            </div>

            {/* Event Title */}
            <div className="relative mb-16 p-8 border-l-2 border-[#FF4D00] bg-gradient-to-r from-[#FF4D00]/5 to-transparent">
              {/* Decorative artifacts */}
              <div className="absolute -left-[5px] -top-[5px] w-2 h-2 bg-[#FF4D00]" />
              <div className="absolute -left-[5px] -bottom-[5px] w-2 h-2 bg-[#FF4D00]" />
              <div className="absolute right-0 top-0 text-[10px] text-[#FF4D00]/40 font-share-tech-mono writing-vertical-rl">ID: {slug.toUpperCase().substring(0, 8)}</div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <Trophy className="w-6 h-6 text-[#FF4D00]" />
                    <span className="text-[#FF4D00] tracking-[0.3em] font-orbitron text-sm">CLASSIFIED_EVENT</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-orbitron uppercase tracking-tighter leading-none text-white mb-4"
                    style={{ textShadow: '0 0 20px rgba(255, 77, 0, 0.3)' }}>
                    {event.name}
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-400 font-rajdhani uppercase tracking-widest flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-[#00F0FF]" />
                    {event.type} Event <span className="text-[#00F0FF]">•</span> {event.isTeamEvent ? 'Team_Squad' : 'Solo_Operative'}
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

            {/* Event Image - Holographic Border */}
            {event.eventPhoto && (
              <div className="relative w-full aspect-[21/9] group mb-12">
                {/* Frame */}
                <div className="absolute inset-0 border border-white/10 z-20 pointer-events-none">
                  {/* Corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00F0FF]" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00F0FF]" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00F0FF]" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00F0FF]" />
                </div>

                {/* Image */}
                <div className="relative w-full h-full overflow-hidden bg-black/50">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={event.eventPhoto}
                      alt={event.name}
                      fill
                      className="object-cover opacity-80 hover:opacity-100 transition-opacity grayscale-[30%] hover:grayscale-0"
                      priority
                    />
                    {/* Scanline Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Quick Info Cards - Cyberpunk Style */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                icon: Calendar,
                label: "DEADLINE",
                value: formatDate(event.registrationDeadline.$date),
                sub: daysRemaining > 0 ? `${daysRemaining} DAYS LEFT` : null,
                color: "text-[#00F0FF]"
              },
              {
                icon: MapPin,
                label: "SECTOR",
                value: event.venue || 'TBA',
                sub: "COORDINATES_LOCKED",
                color: "text-[#FF4D00]"
              },
              {
                icon: Users,
                label: "UNIT_SIZE",
                value: event.minTeamSize === event.maxTeamSize
                  ? `${event.minTeamSize} ${event.minTeamSize === 1 ? 'AGENT' : 'AGENTS'}`
                  : `${event.minTeamSize} - ${event.maxTeamSize} AGENTS`,
                sub: "SQUAD_CONFIG",
                color: "text-[#00F0FF]"
              },
              {
                icon: Trophy,
                label: "ACCESS_COST",
                value: event.entryFee === 0 ? 'FREE_ENTRY' : `₹${event.entryFee}`,
                sub: "CREDITS_REQUIRED",
                color: "text-[#FF4D00]"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-white/5 transform skew-x-[-5deg] group-hover:bg-white/10 transition-colors border border-white/10 group-hover:border-[#00F0FF]/50" />
                <div className="relative p-6 px-8 z-10 flex flex-col h-full justify-between min-h-[140px]">
                  <div className="flex justify-between items-start mb-4">
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                    <div className="w-2 h-2 bg-white/20 group-hover:bg-[#00F0FF] transition-colors" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-share-tech-mono tracking-[0.2em] mb-1">{item.label}</p>
                    <p className="font-orbitron font-bold text-xl tracking-wide">{item.value}</p>
                    {item.sub && (
                      <p className={`text-[10px] mt-2 font-mono uppercase tracking-wider opacity-60 ${item.color === 'text-[#FF4D00]' ? 'text-[#FF4D00]' : 'text-[#00F0FF]'}`}>
                        [{item.sub}]
                      </p>
                    )}
                  </div>
                </div>
                {/* Corner details */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30 group-hover:border-[#00F0FF] transition-colors" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30 group-hover:border-[#00F0FF] transition-colors" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prize Pool Section - Cyber VAULT Style */}
        {event.prizeMoney > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative p-[1px] bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent"
            >
              <div className="bg-[#050505] p-8 md:p-12 relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(#FF4D00 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="text-center md:text-left">
                    <div className="inline-flex items-center gap-2 border border-[#FF4D00] px-3 py-1 text-xs text-[#FF4D00] font-share-tech-mono uppercase tracking-widest mb-4">
                      <span className="w-2 h-2 bg-[#FF4D00] animate-pulse rounded-full" />
                      Protocol: Reward_Distribution
                    </div>
                    <div className="text-6xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                      ₹{event.prizeMoney.toLocaleString()}
                    </div>
                    <p className="text-gray-500 font-rajdhani tracking-[0.3em] uppercase mt-2">Total Prize Pool Allocated</p>
                  </div>

                  <div className="flex-1 w-full md:w-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: '1ST_PLACE', value: event.prizeDistribution.first, color: 'from-amber-300 to-amber-600' },
                        { label: '2ND_PLACE', value: event.prizeDistribution.second, color: 'from-slate-300 to-slate-500' },
                        { label: '3RD_PLACE', value: event.prizeDistribution.third, color: 'from-orange-700 to-orange-900' }
                      ].map((prize, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-4 relative group hover:border-[#FF4D00]/50 transition-colors">
                          <p className="text-[10px] text-gray-500 font-share-tech-mono mb-2">{prize.label}</p>
                          <p className="text-2xl font-bold font-orbitron">₹{prize.value.toLocaleString()}</p>
                          <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${prize.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Tabbed Navigation - Terminal Style */}
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="border-b border-white/10 mb-8 relative">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00F0FF]/50 to-transparent" />
            <div className="flex flex-wrap gap-2 md:gap-8 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: 'about', label: 'About_Event' },
                { id: 'structure', label: 'Structure_Grid' },
                { id: 'rules', label: 'Protocol_List' },
                { id: 'contact', label: 'Comms_Link' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`pb-4 px-4 font-orbitron font-bold tracking-wider text-sm relative transition-all whitespace-nowrap ${activeTab === tab.id ? 'text-[#00F0FF]' : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  <span className="relative z-10 px-2">
                    {activeTab === tab.id && <span className="text-[#00F0FF] mr-2">&gt;</span>}
                    {tab.label}
                  </span>

                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.7)]"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 bg-[#00F0FF]/5 transform -skew-x-12 z-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px]"
          >
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <h3 className="text-xs font-bold text-[#FF4D00] mb-6 tracking-[0.3em] uppercase font-orbitron flex items-center gap-2">
                    <span className="w-12 h-[1px] bg-[#FF4D00]" />
                    Mission Briefing
                  </h3>
                  <p className="text-xl md:text-2xl font-rajdhani font-medium leading-relaxed text-gray-300 tracking-wide text-justify">
                    {event.aboutEvent || 'Data packet corrupted or missing...'}
                  </p>
                </div>

                {/* Important Note - Hologram Style */}
                <div className="bg-[#00F0FF]/5 border-l-2 border-[#00F0FF] p-6 relative overflow-hidden backdrop-blur-sm">
                  {/* Scanlines */}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 bg-[#00F0FF] animate-pulse" />
                      <p className="font-bold text-[#00F0FF] font-orbitron tracking-wider">SYSTEM_NOTICE</p>
                    </div>
                    <p className="text-gray-300 font-rajdhani text-lg">SVNTians must use their institute email for registration access.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Structure Tab */}
            {activeTab === 'structure' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-[#FF4D00] mb-6 tracking-[0.3em] uppercase font-orbitron">Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 p-8 relative group">
                      <div className="absolute top-0 right-0 p-2 opacity-50">
                        <Users className="w-8 h-8 text-white/20" />
                      </div>
                      <h4 className="text-xl font-bold mb-4 font-orbitron text-[#00F0FF]">Event Format</h4>
                      <p className="text-gray-400 font-rajdhani text-lg">
                        This is a <span className="text-white font-bold">{event.isTeamEvent ? 'SQUAD-BASED' : 'SOLO_OPERATIVE'}</span> task.
                        {event.isTeamEvent && ` Squad size parameters: ${event.minTeamSize}-${event.maxTeamSize} units.`}
                      </p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 relative group">
                      <div className="absolute top-0 right-0 p-2 opacity-50">
                        <Calendar className="w-8 h-8 text-white/20" />
                      </div>
                      <h4 className="text-xl font-bold mb-4 font-orbitron text-[#00F0FF]">Timeline_Sequence</h4>
                      <p className="text-gray-400 font-rajdhani text-lg">
                        Temporal coordinates and execution schedule will be transmitted to registered operatives.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-[#00F0FF] mb-6 tracking-[0.3em] uppercase flex items-center gap-2 font-orbitron">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                  Engagement_Protocols
                </h3>
                {event.rules && event.rules.length > 0 ? (
                  <div className="grid gap-3">
                    {event.rules.map((rule, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white/5 border-l-4 border-cyan-500/30 p-4 pl-6 hover:bg-white/10 hover:border-cyan-400 transition-all group flex items-start gap-4"
                      >
                        <span className="font-share-tech-mono text-[#00F0FF] opacity-50 text-sm mt-1">
                          {String(i + 1).padStart(2, '0')} //
                        </span>
                        <p className="text-lg font-rajdhani font-medium leading-tight group-hover:text-white text-gray-300">{rule}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/10 p-8 rounded-lg text-center border-dashed">
                    <p className="text-gray-400 font-share-tech-mono">Protocols encrypting... Standby.</p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="space-y-8">
                <h3 className="text-xs font-bold text-[#FF4D00] mb-6 tracking-[0.3em] uppercase font-orbitron">Encrypted Channels</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp Contact */}
                  {event.whatsappNo && (
                    <div className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all flex items-center justify-between group">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MessageCircle className="w-5 h-5 text-green-400" />
                          <h4 className="font-bold text-lg font-orbitron">Direct_Comms</h4>
                        </div>
                        <p className="text-gray-400 font-share-tech-mono text-xs">{event.whatsappNo}</p>
                      </div>
                      <a
                        href={`https://wa.me/${event.whatsappNo.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-black font-bold uppercase tracking-wider text-xs transition-all"
                      >
                        Initiate_Link
                      </a>
                    </div>
                  )}

                  {/* WhatsApp Group */}
                  {event.whatsappGrpLink && (
                    <div className="bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-all flex items-center justify-between group">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-5 h-5 text-green-400" />
                          <h4 className="font-bold text-lg font-orbitron">Squad_Net</h4>
                        </div>
                        <p className="text-gray-400 font-share-tech-mono text-xs">Broadcast Frequency</p>
                      </div>
                      <a
                        href={event.whatsappGrpLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500 hover:text-black font-bold uppercase tracking-wider text-xs transition-all"
                      >
                        Connect
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </section>

        {/* Registration CTA */}
        <section className="max-w-7xl mx-auto px-4 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-y border-white/10 bg-white/5 p-12 md:p-16 text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4D00]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4D00]" />

            {/* Background pulse */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4D00]/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

            <h3 className="text-4xl md:text-6xl font-black uppercase mb-8 font-orbitron tracking-tighter">
              Ready to <span className="text-[#FF4D00] inline-block transform hover:skew-x-12 transition-transform">Dominate?</span>
            </h3>

            {eventStatus === 'OPEN' ? (
              <div className="space-y-8 relative z-10">
                <p className="text-gray-400 max-w-2xl mx-auto font-rajdhani text-lg">
                  Portal closes on <span className="text-white font-bold">{formatDate(event.registrationDeadline.$date)}</span>. Ensure requisite credits and squad configuration before proceeding.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6">
                  {event.unstopLink && (
                    <a
                      href={event.unstopLink}
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
                  {event.psLink && (
                    <a
                      href={event.psLink}
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

        {/* Footer */}
        {/* <section className="py-8 text-center border-t border-white/5 bg-[#030303]">
          <p className="text-xs text-gray-600 font-share-tech-mono tracking-[0.3em] uppercase">MindBend 2025 // System_Version_2.0 // {event.type}</p>
        </section> */}
      </div>
    </motion.div>
  );
}
