'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicEventsApi } from '@/lib/events';
import WorkshopBackground from '@/components/events/WorkshopBackground';
import WorkshopEventCard from '@/components/WorkshopEventCard';

interface Event {
  _id: string;
  name: string;
  aboutEvent?: string;
  slug: string,
  entryFee: Number,
  eventDate: Date,
  eventPhoto: string
  // Add other fields as needed
}

function Workshop() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {

        publicEventsApi
          .listByType('workshops')
          .then((res) => { setEvents(res.data?.data?.events || []) })
          .catch(() => setError('Failed to load events'))
          .finally(() => setLoading(false));

      // dummy data for testing
      setEvents([
        {
          _id: "1",
          name: "Codewars",
          aboutEvent: "coding..",
          slug: "codewars",
          entryFee: 100,
          eventDate: new Date(),
          eventPhoto: "https://res.cloudinary.com/dfbupup5c/image/upload/v1766389529/uac32yi7jxvdyl0sqf74.png"
        },
        {
          _id: "2",
          name: "Codewars",
          aboutEvent: "coding..",
          slug: "codewars",
          entryFee: 100,
          eventDate: new Date(),
          eventPhoto: "https://res.cloudinary.com/dfbupup5c/image/upload/v1766389529/uac32yi7jxvdyl0sqf74.png"
        },
        {
          _id: "3",
          name: "Codewars",
          aboutEvent: "coding..",
          slug: "codewars",
          entryFee: 100,
          eventDate: new Date(),
          eventPhoto: "https://res.cloudinary.com/dfbupup5c/image/upload/v1766389529/uac32yi7jxvdyl0sqf74.png"
        },
    ])
    setLoading(false)
   
    }
    fetchEvents();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
      <WorkshopBackground />
      <div className="container mx-auto py-8 z-5 relative">
        <div className="flex flex-col items-center w-full animate-fade-in">
          <h1
            className="text-7xl sm:text-8xl md:text-9xl uppercase tracking-normal leading-[1.1] font-black mb-4"
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
                    <div className="h-4 bg-gray-700/30 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-700/30 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
          {events.map(event => (            
                <WorkshopEventCard
                  key={event._id}
                  slug={`/workshops/${event.slug}`}
                  title={`${event.name}`}
                  date={event.eventDate ? (() => { const d = new Date(event.eventDate); return `${d.getDate()}th ${d.toLocaleString('default', { month: 'short' })}`; })() : 'Coming Soon'}
                  entryFee={`₹${event.entryFee || 0}`}
                  // delay={index * 0.05}
                  image={event.eventPhoto}
                />
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

export default Workshop