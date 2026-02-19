'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, Trophy } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import InfoCard from '@/components/events/InfoCard';
import EventTabs from '@/components/events/EventTabs';
import { formatDate, getDaysRemaining, getWorkshopStatus } from '@/utils/eventsUtils';
import WorkshopEventCard from '@/components/WorkshopEventCard';
import EventsHeader from '@/components/events/EventsHeader';
import WorkshopRegistrationCTA from '@/components/workshops/WorkshopRegistrationCTA';
import { EventStatus } from '@/types';
import useAuth from '@/hooks/useAuth';
import { showErrorToast } from '@/utils/toast';


// Lazy load the background scene
const BackgroundScene = dynamic(() => import('@/components/events/BackgroundScene'), {
  ssr: false,
});

interface Workshop {
  _id: string;
  name: string;
  slug: string;
  workshopPhoto: string;
  entryFee: number;
  isFree: boolean;
  contact: {
    name: string;
    whatsappNo: string;
  }[];
  whatsappGrpLink: string;
  aboutWorkshop: string;
  prerequisites: string[];
  registrationDeadline: string;
  workshopDate: string;
  venue: string;
  maxParticipants: number;
  registeredCount: number;
  hideWorkshop: boolean;
  stopRegistration: boolean;
  isRegistrationOpen: boolean;
}

export default function WorkshopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSvnitian, setIsSvnitian] = useState<boolean>(false);

  // Set user's SVNitian status from auth context (only if authenticated)
  useEffect(() => {
    if (isAuthenticated && user?.isSvnitian) {
      setIsSvnitian(true);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchWorkshop();
  }, [slug]);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/proxy/workshops/public/${slug}`, {
        credentials: 'include' // Include cookies for auth
      });
      const data = await response.json();
      
      if (data.success) {
        setWorkshop(data.data.workshop);
        // Check if user is SVNITIAN from response
        if (data.data?.isSvnitian) {
          setIsSvnitian(true);
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch workshop details');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
        <div className="relative z-10">
          {/* Header Skeleton */}
          <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
            <div className="animate-pulse space-y-8">
              {/* Breadcrumb and title skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-800/50 rounded w-48"></div>
                <div className="h-16 bg-linear-to-r from-gray-800/50 to-gray-700/50 rounded w-3/4"></div>
                <div className="h-6 bg-gray-800/50 rounded w-32"></div>
              </div>
              
              {/* Workshop Card Skeleton */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg overflow-hidden border border-gray-700/30">
                <div className="w-full h-96 bg-gray-700/30"></div>
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-gray-700/30 rounded w-2/3"></div>
                  <div className="h-5 bg-gray-700/30 rounded w-full"></div>
                  <div className="h-5 bg-gray-700/30 rounded w-4/5"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-5 bg-gray-700/30 rounded w-32"></div>
                    <div className="h-5 bg-gray-700/30 rounded w-24"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Info Cards Skeleton */}
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-6 space-y-3">
                  <div className="h-8 w-8 bg-gray-700/40 rounded"></div>
                  <div className="h-4 bg-gray-700/40 rounded w-20"></div>
                  <div className="h-6 bg-gray-700/40 rounded w-full"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Tabs Skeleton */}
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="animate-pulse space-y-6">
              <div className="flex gap-4 border-b border-gray-800">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-gray-800/30 rounded-t w-32"></div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-800/30 rounded w-full"></div>
                <div className="h-6 bg-gray-800/30 rounded w-5/6"></div>
                <div className="h-6 bg-gray-800/30 rounded w-4/5"></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !workshop) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-8 relative">
            <div className="w-24 h-24 mx-auto border-4 border-[#33ABB9]/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#33ABB9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Workshop Not Found
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {error || 'The workshop you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={handleBack}
            className="px-8 py-4 bg-gradient-to-r from-[#33ABB9] to-[#184344] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#33ABB9]/50 transition-all duration-300 transform hover:scale-105"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  const formatWorkshopDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysRemainingWorkshop = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemainingWorkshop(workshop.registrationDeadline);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-[#33ABB9] selection:text-white font-rajdhani tracking-wide relative"
    >
      {/* Background 3D Scene - Reduced opacity */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
        <BackgroundScene />
      </div>

      {/* Cyberpunk Grid Overlay */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(51, 171, 185, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51, 171, 185, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      <div className="relative z-10">
        {/* Workshop Header */}
        <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
          <EventsHeader
            eventName={workshop.name}
            eventType="workshop"
            isTeamEvent={false}
            eventStatus={getWorkshopStatus(workshop)}
            breadcrumbType="WORKSHOPS"
          />
          {/* Workshop Image - Holographic Border */}
            {workshop.workshopPhoto && (
              <div className="relative w-full mb-12">
                <WorkshopEventCard
                  showExploreButton={false}
                  slug="#"
                  title={workshop.name}
                  aboutEvent={workshop.aboutWorkshop?.substring(0, 150) + "..." || ""}
                  date={workshop.workshopDate ? (() => { 
                    const d = new Date(workshop.workshopDate); 
                    return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}${d.getDate() % 10 === 1 && d.getDate() !== 11 ? 'st' : d.getDate() % 10 === 2 && d.getDate() !== 12 ? 'nd' : d.getDate() % 10 === 3 && d.getDate() !== 13 ? 'rd' : 'th'}`; 
                  })() : 'Coming Soon'}
                  prize={workshop.entryFee === 0 ? 'Free' : `₹${workshop.entryFee}`}
                  image={workshop.workshopPhoto}
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
              value={workshop.registrationDeadline ? formatWorkshopDate(workshop.registrationDeadline) : 'TBA'}
              sub={daysRemaining > 0 ? `${daysRemaining} DAYS LEFT` : null}
              color="text-[#33ABB9]"
              delay={0.3}
            />
            <InfoCard
              icon={MapPin}
              label="VENUE"
              value={workshop.venue || 'TBA'}
              color="text-[#33ABB9]"
              delay={0.4}
            />
            <InfoCard
              icon={Trophy}
              label="ENTRY FEE"
              value={(isAuthenticated && isSvnitian) ? '₹0' : (workshop.entryFee === 0 ? 'FREE' : `₹${workshop.entryFee}`)}
              color="text-[#33ABB9]"
              delay={0.6}
            />
            <InfoCard
              icon={Calendar}
              label="WORKSHOP DATE"
              value={formatWorkshopDate(workshop.workshopDate)}
              color="text-[#33ABB9]"
              delay={0.7}
            />
          </div>
        </section>
        {/* Tabbed Navigation - Terminal Style */}
        <EventTabs
          aboutEvent={workshop.aboutWorkshop}
          isTeamEvent={false}
          minTeamSize={1}
          maxTeamSize={1}
          rules={workshop.prerequisites.map((prerequisite: string, index: number) => ({
            heading: `Prerequisite ${index + 1}`,
            content: prerequisite
          }))}
          contact={workshop.contact}
          whatsappGrpLink={workshop.whatsappGrpLink}
        />

        {/* Registration CTA */}
        <WorkshopRegistrationCTA
          workshopSlug={workshop.slug}
          workshopName={workshop.name}
          registeredCount={workshop.registeredCount}
          maxParticipants={workshop.maxParticipants}
          isRegistrationOpen={workshop.isRegistrationOpen}
          stopRegistration={workshop.stopRegistration}
          registrationDeadline={workshop.registrationDeadline}
          isSvnitian={isSvnitian}
          entryFee={workshop.entryFee}
          isFree={workshop.isFree}
          formatDate={formatDate}
        />
      </div>
    </motion.div>
  );
}