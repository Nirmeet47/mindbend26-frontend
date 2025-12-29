'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import WorkshopBackground from '@/components/events/WorkshopBackground';
import Navbar from '@/components/layoutComp/Navbar';

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

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch('http://localhost:6969/api/workshops/public');
      const data = await response.json();
      
      if (data.success) {
        setWorkshops(data.data.workshops);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch workshops');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="relative mt-8 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
          <WorkshopBackground />
          <div className="container mx-auto py-8 z-5 relative">
            <div className="text-center">
              <div className="text-white text-xl">Loading workshops...</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="relative mt-8 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
          <WorkshopBackground />
          <div className="container mx-auto py-8 z-5 relative">
            <div className="text-center">
              <div className="text-red-500 text-xl">{error}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative mt-8 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
        <WorkshopBackground />
        <div className="container mx-auto py-8 z-5 relative">
          <div className="flex flex-col items-center w-full animate-fade-in">
            <h1
              className="text-7xl sm:text-8xl md:text-9xl uppercase tracking-normal leading-[1.1] font-black mb-4"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#e5e7eb',
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            >
              WORKSHOPS
            </h1>
            <p className="text-lg text-center max-w-2xl mb-8 text-gray-300">
              Enhance your skills with our expert-led workshops. Free for SVNIT students!
            </p>
          </div>

        {workshops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-400">No workshops available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
            {workshops.map((workshop) => (
              <div
                key={workshop._id}
                className="bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-lg overflow-hidden border border-gray-700/30 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105"
              >
                {workshop.workshopPhoto && (
                  <div className="w-full h-48 bg-gray-800 rounded-t-lg overflow-hidden">
                    <img 
                      src={workshop.workshopPhoto} 
                      alt={workshop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white hover:text-cyan-400">
                    {workshop.name}
                  </h3>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">
                    {workshop.aboutWorkshop}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">👨‍🏫</span>
                      <span>{workshop.instructor.name}</span>
                      {workshop.instructor.company && (
                        <span className="ml-1">- {workshop.instructor.company}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">⏱️</span>
                      <span>{workshop.duration}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">📅</span>
                      <span>{formatDate(workshop.workshopDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">🕐</span>
                      <span>{workshop.startTime} - {workshop.endTime}</span>
                    </div>
                    
                    {workshop.venue && (
                      <div className="flex items-center text-sm text-gray-400">
                        <span className="mr-2">📍</span>
                        <span>{workshop.venue}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">👥</span>
                      <span>{workshop.registeredCount}/{workshop.maxParticipants} participants</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-green-400">
                      {workshop.entryFee === 0 ? 'Free' : `₹${workshop.entryFee}`}
                    </div>
                    
                    <Link href={`/workshops/${workshop.slug}`}>
                      <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                        Explore
                      </button>
                    </Link>
                  </div>

                  {workshop.prerequisites.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Prerequisites:</p>
                      <p className="text-xs text-gray-400">{workshop.prerequisites.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
}