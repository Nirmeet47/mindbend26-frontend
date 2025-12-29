'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Navbar from '@/components/layoutComp/Navbar';
import WorkshopBackground from '@/components/events/WorkshopBackground';

interface Workshop {
  _id: string;
  name: string;
  slug: string;
  workshopPhoto: string;
  instructor: {
    name: string;
    company: string;
    photo: string;
    linkedin: string;
  };
  duration: string;
  entryFee: number;
  contact: {
    name: string;
    whatsappNo: string;
  }[];
  whatsappGrpLink: string;
  aboutWorkshop: string;
  prerequisites: string[];
  registrationDeadline: string;
  workshopDate: string;
  startTime: string;
  endTime: string;
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

  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkshop();
  }, [slug]);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`http://localhost:6969/api/workshops/public/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setWorkshop(data.data.workshop);
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
                <div className="h-16 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded w-3/4"></div>
                <div className="h-6 bg-gray-800/50 rounded w-32"></div>
              </div>
              
              {/* Event Card Skeleton */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg overflow-hidden border border-gray-700/30">
                <div className="w-full h-96 bg-gray-700/30"></div>
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-gray-700/30 rounded w-2/3"></div>
                  <div className="flex justify-between items-center">
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
            <div className="w-24 h-24 mx-auto border-4 border-[#FF4D00]/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#FF4D00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Workshop Not Found
          </h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {error || 'The workshop you are looking for does not exist or has been removed.'}
          </p>
          <button
            onClick={handleBack}
            className="px-8 py-4 bg-gradient-to-r from-[#FF4D00] to-[#FF6020] text-white font-bold rounded-lg hover:shadow-lg hover:shadow-[#FF4D00]/50 transition-all duration-300 transform hover:scale-105"
          >
            Back to Workshops
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Navbar />
      <div className="relative mt-8 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
        <WorkshopBackground />
        <div className="container mx-auto py-8 z-5 relative">
          {/* Header */}
          <div className="flex flex-col items-center w-full animate-fade-in mb-8">
            <button 
              onClick={() => router.push('/workshops')}
              className="self-start mb-4 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              ← Back to Workshops
            </button>
            
            <h1
              className="text-5xl sm:text-6xl md:text-7xl uppercase tracking-normal leading-[1.1] font-black mb-4 text-center"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#e5e7eb',
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            >
              {workshop.name}
            </h1>
          </div>

          {/* Workshop Details */}
          <div className="max-w-4xl mx-auto">
            {/* Workshop Photo */}
            {workshop.workshopPhoto && (
              <div className="w-full h-64 md:h-96 bg-gray-800 rounded-lg mb-8 overflow-hidden">
                <img 
                  src={workshop.workshopPhoto} 
                  alt={workshop.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Workshop Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Instructor */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/30">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-400">Instructor</h2>
                  <div className="flex items-center space-x-4">
                    {workshop.instructor.photo && (
                      <img 
                        src={workshop.instructor.photo} 
                        alt={workshop.instructor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold">{workshop.instructor.name}</h3>
                      {workshop.instructor.company && (
                        <p className="text-gray-400">{workshop.instructor.company}</p>
                      )}
                      {workshop.instructor.linkedin && (
                        <a 
                          href={workshop.instructor.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 text-sm"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Workshop Info */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/30">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-400">Workshop Details</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="mr-3">📅</span>
                      <span>{formatDate(workshop.workshopDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">🕐</span>
                      <span>{workshop.startTime} - {workshop.endTime}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">⏱️</span>
                      <span>{workshop.duration}</span>
                    </div>
                    {workshop.venue && (
                      <div className="flex items-center">
                        <span className="mr-3">📍</span>
                        <span>{workshop.venue}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <span className="mr-3">👥</span>
                      <span>{workshop.registeredCount}/{workshop.maxParticipants} participants</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3">💰</span>
                      <span className="text-green-400 font-semibold">
                        {workshop.entryFee === 0 ? 'Free' : `₹${workshop.entryFee}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* About Workshop */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/30">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-400">About Workshop</h2>
                  <p className="text-gray-300 leading-relaxed">{workshop.aboutWorkshop}</p>
                </div>

                {/* Prerequisites */}
                {workshop.prerequisites.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/30">
                    <h2 className="text-2xl font-bold mb-4 text-cyan-400">Prerequisites</h2>
                    <ul className="space-y-2">
                      {workshop.prerequisites.map((prereq, index) => (
                        <li key={index} className="flex items-center text-gray-300">
                          <span className="mr-3">✓</span>
                          {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contact */}
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg p-6 border border-gray-700/30">
                  <h2 className="text-2xl font-bold mb-4 text-cyan-400">Contact</h2>
                  <div className="space-y-3">
                    {workshop.contact.map((contact, index) => (
                      <div key={index} className="flex items-center">
                        <span className="mr-3">📱</span>
                        <div>
                          <p className="font-semibold">{contact.name}</p>
                          <p className="text-gray-400">{contact.whatsappNo}</p>
                        </div>
                      </div>
                    ))}
                    {workshop.whatsappGrpLink && (
                      <a 
                        href={workshop.whatsappGrpLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Join WhatsApp Group
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Registration CTA */}
            <div className="text-center">
              <button 
                className={`px-8 py-4 text-lg font-semibold rounded-lg transition-colors duration-200 ${
                  !workshop.stopRegistration 
                    ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                disabled={workshop.stopRegistration}
              >
                {!workshop.stopRegistration ? 'Register for Workshop' : 'Registration Closed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}