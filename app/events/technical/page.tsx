'use client';

import React from 'react';
TechnicalBackground;
import TechnicalBackground from '@/components/events/TechnicalBackground';
// import TechnicalEventCard from '@/components/events/technical/TechnicalEventCard';

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

interface Event {
  _id: string;
  name: string;
  description?: string;
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
    }
    fetchEvents();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
      <TechnicalBackground />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Technical Events</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event._id} className="bg-[#222] rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-300">{event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Technical