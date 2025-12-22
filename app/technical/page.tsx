'use client';

import React from 'react';
TechnicalBackground;
import TechnicalBackground from '@/components/events/TechnicalBackground';
import EventCard from '@/components/EventCard';

// const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11];

// Dummy Data Generator for Technical Events
// const TECHNICAL_EVENTS = Array.from({ length: 20 }).map((_, i) => ({
//   id: i,
//   title: `Tech Event ${i + 1}`,
//   aboutEvent: "Dive into the world of algorithms, coding errors and hardware hacks.",
//   date: `March ${15 + (i % 5)}th`,
//   prize: `₹${(15 + (i % 5)) * 1000}`,
//   image: images[i % images.length].src
// }));


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { publicEventsApi } from '@/lib/events';

interface Event {
  _id: string;
  name: string;
  aboutEvent?: string;
  slug: string,
  prizeMoney: Number,
  eventDate: Date,
  eventPhoto: string
  // Add other fields as needed
}

function Technical() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {

        publicEventsApi
          .listByType('technical')
          .then((res) => { setEvents(res.data?.data?.events || []) })
          .catch(() => setError('Failed to load events'))
          .finally(() => setLoading(false));

          console.log("Fetched Technical Events:", events);

      // dummy data for testing
    //   setEvents([
    //     {
    //       _id: "1",
    //       name: "Codewars",
    //       aboutEvent: "coding..",
    //       slug: "codewars",
    //       prizeMoney: 100,
    //       eventDate: new Date(),
    //       eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
    //     },
    //     {
    //       _id: "2",
    //       name: "Codewars",
    //       aboutEvent: "coding..",
    //       slug: "codewars",
    //       prizeMoney: 100,
    //       eventDate: new Date(),
    //       eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
    //     },
    //     {
    //       _id: "3",
    //       name: "Codewars",
    //       aboutEvent: "coding..",
    //       slug: "codewars",
    //       prizeMoney: 100,
    //       eventDate: new Date(),
    //       eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
    //     },
    // ])
    // setLoading(false)
   
    }
    fetchEvents();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
      <TechnicalBackground />
      <div className="container mx-auto py-8">
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
            TECHNICAL
          </h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 px-6 md:px-12 lg:px-22 my-12">
          {events.map(event => (            
                <EventCard
                  key={event._id}
                  slug={`/technical/${event.slug}`}
                  title={`${event.name}`}
                  aboutEvent={event.aboutEvent?.substring(0, 100) + "..."}
                  date={event.eventDate ? (() => { const d = new Date(event.eventDate); return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}th`; })() : 'Coming Soon'}
                  prize={`₹${event.prizeMoney}`}
                  // delay={index * 0.05}
                  image={event.eventPhoto}
                />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Technical