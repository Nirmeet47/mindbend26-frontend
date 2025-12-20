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
//   description: "Dive into the world of algorithms, coding errors and hardware hacks.",
//   date: `March ${15 + (i % 5)}th`,
//   prize: `₹${(15 + (i % 5)) * 1000}`,
//   image: images[i % images.length].src
// }));


import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event {
  _id: string;
  name: string;
  description?: string;
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
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';
        const res = await fetch(`${apiUrl}/api/events/public/type/technical`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setEvents(data.data?.events || []);
      } catch (err) {
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }


      // dummy data for testing
    //   setEvents([
    //     {
    //       _id: "1",
    //       name: "Codewars",
    //       description: "coding..",
    //       slug: "codewars",
    //       prizeMoney: 100,
    //       eventDate: new Date(),
    //       eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
    //     },
    //     {
    //       _id: "2",
    //       name: "Codewars",
    //       description: "coding..",
    //       slug: "codewars",
    //       prizeMoney: 100,
    //       eventDate: new Date(),
    //       eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
    //     },
    //     {
    //       _id: "3",
    //       name: "Codewars",
    //       description: "coding..",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            // <div key={event._id} className="bg-[#222] rounded-lg p-6 shadow-md">
            //   <h2
            //     className="text-xl font-semibold mb-2"
            //     style={{
            //       color: '#e0e4ea', // off-white
            //       fontWeight: 800,
            //       textShadow: '0 1px 6px rgba(0,0,0,0.18)'
            //     }}
            //   >
            //     {event.name}
            //   </h2>
            //   <p className="text-gray-300">{event.description}</p>
            // </div>

              <Link href={`/events/technical/${event.slug}`} key={event._id} className="block">
                  <EventCard
                    title={`${event.name}`}
                    description={event.description?.substring(0, 100) + "..."}
                    date={`${event.eventDate.toLocaleString('default', { month: 'short' })} ${event.eventDate.getDate()}th`}
                    prize={`₹${event.prizeMoney}`}
                    // delay={index * 0.05}
                    image={event.eventPhoto}
                  />
                </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Technical