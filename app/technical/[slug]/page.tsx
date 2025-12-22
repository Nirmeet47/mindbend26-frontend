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
import { Event } from '@/types';

// Lazy load the background scene
const BackgroundScene = dynamic(() => import('@/components/events/BackgroundScene'), {
  ssr: false,
});

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch event data from API
  useEffect(() => {
    async function fetchEvent() {
      publicEventsApi
        .get(slug)
        .then((res) => { setEvent(res.data?.data?.event || null); })
        .catch(() => setError('Failed to load event details. Please try again later.'))
        .finally(() => setLoading(false));
    }
    // console.log(event)
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
  const daysRemaining = getDaysRemaining(event.registrationDeadline);

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

      <div className="relative z-10">
        {/* Event Header */}
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          <EventsHeader
            eventName={event.name}
            eventType={event.type}
            isTeamEvent={event.isTeamEvent}
            eventStatus={eventStatus}
            breadcrumbType="TECHNICAL"
          />
          {/* Event Image - Holographic Border */}
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

        {/* Quick Info Cards - Cyberpunk Style */}
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InfoCard
              icon={Calendar}
              label="DEADLINE"
              value={formatDate(event.registrationDeadline)}
              sub={daysRemaining > 0 ? `${daysRemaining} DAYS LEFT` : null}
              color="text-[#00F0FF]"
              delay={0.3}
            />
            <InfoCard
              icon={MapPin}
              label="VENUE"
              value={event.venue || 'TBA'}
              color="text-[#FF4D00]"
              delay={0.4}
            />
            <InfoCard
              icon={Users}
              label="TEAM SIZE"
              value={event.minTeamSize === event.maxTeamSize
                ? `${event.minTeamSize} ${event.minTeamSize === 1 ? 'MEMBER' : 'MEMBERS'}`
                : `${event.minTeamSize} - ${event.maxTeamSize} MEMBERS`}
              color="text-[#00F0FF]"
              delay={0.5}
            />
            <InfoCard
              icon={Trophy}
              label="FEES"
              value={event.entryFee === 0 ? 'FREE_ENTRY' : `₹${event.entryFee}`}
              color="text-[#FF4D00]"
              delay={0.6}
            />
          </div>
        </section>

        {/* Prize Pool Section - Cyber VAULT Style */}
        {event.prizeMoney > 0 && (
          <PrizePoolSection
            prizeMoney={event.prizeMoney}
            prizeDistribution={event.prizeDistribution}
          />
        )}

        {/* Tabbed Navigation - Terminal Style */}
        <EventTabs
          aboutEvent={event.aboutEvent}
          isTeamEvent={event.isTeamEvent}
          minTeamSize={event.minTeamSize}
          maxTeamSize={event.maxTeamSize}
          rules={event.rules}
          whatsappNo={event.whatsappNo}
          whatsappGrpLink={event.whatsappGrpLink}
        />

        {/* Registration CTA */}
        <RegistrationCTA
          eventStatus={eventStatus}
          registrationDeadline={event.registrationDeadline}
          unstopLink={event.unstopLink}
          psLink={event.psLink}
          formatDate={formatDate}
        />
      </div>
    </motion.div>
  );
}