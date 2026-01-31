'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Trophy } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import InfoCard from '@/components/events/InfoCard';
import PrizePoolSection from '@/components/events/PrizePoolSection';
import EventTabs from '@/components/events/EventTabs';
import RegistrationCTA from '@/components/events/RegistrationCTA';
import { formatDate, getDaysRemaining, getEventStatus } from '@/utils/eventsUtils';
import { publicEventsApi } from '@/lib/events';
import EventCard from '@/components/EventCard';
import EventsHeader from '@/components/events/EventsHeader';
import RegisteredTeamModal from '@/components/events/RegisteredTeamModal';
import { DetailedTeam, Event } from '@/types';
import useAuth from '@/hooks/useAuth';
import EsportsBackground from '@/components/events/EsportsBackground';

export default function EsportsEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [eventTeam, setEventTeam] = useState<DetailedTeam | null>(null);
  const [isLeader, setIsLeader] = useState<boolean>(false);
  const [isSvnitian, setIsSvnitian] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set user's SVNitian status from auth context (only if authenticated)
  useEffect(() => {
    if (isAuthenticated && user?.isSvnitian) {
      setIsSvnitian(true);
    }
  }, [isAuthenticated, user]);

  // Fetch event data from API
  useEffect(() => {
    async function fetchEvent() {
      publicEventsApi
        .get(slug)
        .then((res) => {
          setEvent(res.data?.data?.event || null);
          if(res.data?.data?.team){
            setEventTeam(res.data?.data?.team || null);
          }
          if(res.data?.data?.team && res.data?.data?.isLeader){
            setIsLeader(true);
          }
          if(res.data?.data?.isSvnitian){
            setIsSvnitian(true);
          }
        })
        .catch(() => setError('Failed to load event details. Please try again later.'))
        .finally(() => setLoading(false));
    }
    fetchEvent();
  }, [slug]);

  const handleBack = () => {
    router.push('/esports');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden">
        <EsportsBackground />
        <div className="relative z-10">
          {/* Header Skeleton */}
          <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
            <div className="animate-pulse space-y-8">
              <div className="space-y-4">
                <div className="h-4 bg-purple-800/30 rounded w-48"></div>
                <div className="h-16 bg-linear-to-r from-purple-800/30 to-cyan-700/30 rounded w-3/4"></div>
                <div className="h-6 bg-purple-800/30 rounded w-32"></div>
              </div>
              
              <div className="bg-linear-to-br from-purple-800/20 to-gray-900/30 rounded-lg overflow-hidden border border-purple-700/30">
                <div className="w-full h-96 bg-purple-700/20"></div>
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-purple-700/20 rounded w-2/3"></div>
                  <div className="h-5 bg-purple-700/20 rounded w-full"></div>
                  <div className="h-5 bg-purple-700/20 rounded w-4/5"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Info Cards Skeleton */}
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-purple-800/20 border border-purple-700/30 rounded-lg p-6 space-y-3">
                  <div className="h-8 w-8 bg-purple-700/30 rounded"></div>
                  <div className="h-4 bg-purple-700/30 rounded w-20"></div>
                  <div className="h-6 bg-purple-700/30 rounded w-full"></div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] text-white flex items-center justify-center px-4">
        <EsportsBackground />
        <div className="text-center max-w-md relative z-10">
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto border-4 border-purple-500/30 rounded-full flex items-center justify-center">
              <span className="text-5xl">🎮</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Event Not Found
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {error || 'The esports event you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={handleBack}
            className="px-8 py-4 bg-linear-to-r from-purple-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Back to Esports
          </button>
        </div>
      </div>
    );
  }

  const eventStatus = getEventStatus(event);
  const daysRemaining = getDaysRemaining(event.registrationDeadline);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a1a] text-white overflow-x-hidden selection:bg-purple-500/50 selection:text-white font-rajdhani tracking-wide relative"
    >
      <EsportsBackground />

      {/* Cyberpunk Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      <div className="relative z-10">
        {/* Event Header */}
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          <EventsHeader
            eventName={event.name}
            eventType={event.type}
            isTeamEvent={event.isTeamEvent}
            eventStatus={eventStatus}
            breadcrumbType="ESPORTS"
          />
          {/* Event Image */}
            {event.eventPhoto && (
              <div className="relative w-full mb-12">
                <EventCard
                  showExploreButton={false}
                  slug="#"
                  title={event.name}
                  aboutEvent={event.aboutEvent?.substring(0, 150) + "..." || ""}
                  date={event.eventDate ? (() => { 
                    const d = new Date(event.eventDate); 
                    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}${d.getDate() % 10 === 1 && d.getDate() !== 11 ? 'st' : d.getDate() % 10 === 2 && d.getDate() !== 12 ? 'nd' : d.getDate() % 10 === 3 && d.getDate() !== 13 ? 'rd' : 'th'}`; 
                  })() : 'Coming Soon'}
                  prize={event.prizeMoney > 0 ? `₹${event.prizeMoney.toLocaleString()}` : 'TBA'}
                  image={event.eventPhoto}
                />
              </div>
            )}
        </section>

        {/* Quick Info Cards */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InfoCard
              icon={Calendar}
              label="DEADLINE"
              value={event.registrationDeadline ? formatDate(event.registrationDeadline) : 'TBA'}
              sub={daysRemaining > 0 ? `${daysRemaining} DAYS LEFT` : null}
              color="text-purple-400"
              delay={0.3}
            />
            <InfoCard
              icon={MapPin}
              label="VENUE"
              value={event.venue || 'Online'}
              color="text-cyan-400"
              delay={0.4}
            />
            <InfoCard
              icon={Users}
              label={event.isTeamEvent ? 'TEAM SIZE' : 'PARTICIPATION'}
              value={event.isTeamEvent
                ? (event.minTeamSize === event.maxTeamSize
                  ? `${event.minTeamSize} ${event.minTeamSize === 1 ? 'PLAYER' : 'PLAYERS'}`
                  : `${event.minTeamSize} - ${event.maxTeamSize} PLAYERS`)
                : 'SOLO'}
              color="text-purple-400"
              delay={0.5}
            />
            <InfoCard
              icon={Trophy}
              label="ENTRY FEE"
              value={(isAuthenticated && isSvnitian) ? '₹0' : (event.entryFee === 0 ? 'FREE_ENTRY' : `₹${event.entryFee}`)}
              color="text-cyan-400"
              delay={0.6}
            />
          </div>
        </section>

        {/* Prize Pool Section */}
        {event.prizeMoney > 0 && (
          <PrizePoolSection
            prizeMoney={event.prizeMoney}
            prizeDistribution={event.prizeDistribution}
          />
        )}

        {/* Tabbed Navigation */}
        <EventTabs
          aboutEvent={event.aboutEvent}
          isTeamEvent={event.isTeamEvent}
          minTeamSize={event.minTeamSize}
          maxTeamSize={event.maxTeamSize}
          rules={event.rules}
          structuredRules={event.structuredRules}
          structure={event.structure}
          contact={event.contact}
          whatsappGrpLink={event.whatsappGrpLink}
        />

        {/* Registered Team Modal or Registration CTA */}
        {eventTeam ? (
          <RegisteredTeamModal
            team={eventTeam}
            isLeader={isLeader}
            eventId={event._id}
            eventName={event.name}
            isTeamEvent={event.isTeamEvent}
          />
        ) : (
          <RegistrationCTA
            eventStatus={eventStatus}
            registrationDeadline={event.registrationDeadline}
            unstopLink={event.unstopLink}
            psLink={event.psLink}
            formatDate={formatDate}
            eventId={event._id}
            eventName={event.name}
            isTeamEvent={event.isTeamEvent}
            isSvnitian={isSvnitian}
            eventType="esports"
          />
        )}
      </div>
    </motion.div>
  );
}
