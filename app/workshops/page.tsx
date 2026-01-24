'use client';

import React from 'react';
import WorkshopBackground from '@/components/events/WorkshopBackground';
import WorkshopEventCard from '@/components/WorkshopEventCard';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layoutComp/Navbar';

interface Workshop {
  _id: string;
  name: string;
  aboutWorkshop?: string;
  slug: string,
  entryFee: Number,
  workshopDate: Date,
  workshopPhoto: string
  // Add other fields as needed
}

function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWorkshops() {
      try {
        const response = await fetch('/api/proxy/workshops/public');
        const data = await response.json();

        if (data.success) {
          setWorkshops(data.data.workshops || []);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to load workshops');
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative pt-32 md:pt-24 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#8B5CF6]/30">
        <WorkshopBackground />
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center w-full animate-fade-in relative z-20">
            <h1
              className="text-4xl sm:text-6xl md:text-8xl uppercase tracking-normal leading-[1.1] font-black mb-4 text-center px-4"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#e5e7eb', // off-white
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            >
              WORKSHOPS
            </h1>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-lg overflow-hidden border border-gray-700/30">
                    <div className="w-full h-48 bg-gray-700/30"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-700/30 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-700/30 rounded w-full"></div>
                      <div className="h-4 bg-gray-700/30 rounded w-5/6"></div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="h-4 bg-gray-700/30 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-700/30 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
              {workshops.map(workshop => (
                <WorkshopEventCard
                  key={workshop._id}
                  slug={`/workshops/${workshop.slug}`}
                  title={`${workshop.name}`}
                  aboutEvent={workshop.aboutWorkshop?.substring(0, 100) + "..."}
                  date={workshop.workshopDate ? (() => { const d = new Date(workshop.workshopDate); return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}th`; })() : 'Coming Soon'}
                  prize={workshop.entryFee === 0 ? 'Free' : `₹${workshop.entryFee}`}
                  // delay={index * 0.05}
                  image={workshop.workshopPhoto}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Workshops