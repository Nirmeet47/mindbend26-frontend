'use client';

import React from 'react';
import { NeuralNoise } from '@/components/NeuralNoise';
import EventCard from '@/components/EventCard';

import { useEffect, useState } from 'react';
import { publicEventsApi } from '@/lib/events';
import Navbar from '@/components/layoutComp/Navbar';
import Footer from '@/components/homepageComp/Footer';

interface Event {
  _id: string;
  name: string;
  aboutEvent?: string;
  slug: string;
  prizeMoney: number;
  eventDate: Date;
  eventPhoto: string;
}

function Esports() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      publicEventsApi
        .listByType('esports')
        .then((res) => {
          const events = res.data?.data?.events || [];
          // Sort events by prize money in descending order (highest prize first)
          const sortedEvents = events.sort((a: Event, b: Event) => Number(b.prizeMoney) - Number(a.prizeMoney));
          setEvents(sortedEvents);
        })
        .catch(() => setError('Failed to load events'))
        .finally(() => setLoading(false));
    }
    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative pt-32 md:pt-24 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
        <NeuralNoise className="fixed inset-0 -z-10 bg-black pointer-events-none" />
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center w-full animate-fade-in">
            <h1
              className="text-4xl sm:text-6xl md:text-8xl uppercase tracking-normal leading-[1.1] font-black mb-4 text-center px-4"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#e5e7eb',
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            >
              ESPORTS ARENA
            </h1>
            <div className="text-center mb-12 max-w-3xl">
              <p className="text-gray-400 text-sm leading-relaxed">
                Compete in the ultimate gaming showdown. Show your skills in VALORANT, BGMI, and more!
              </p>
            </div>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/5 rounded-lg overflow-hidden border border-gray-700/30">
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
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-gray-300 mb-2">Coming Soon!</h2>
              <p className="text-gray-500 text-center max-w-md">
                Esports events are being prepared. Stay tuned for exciting gaming competitions!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
              {events.map(event => (
                <EventCard
                  key={event._id}
                  slug={`/esports/${event.slug}`}
                  title={`${event.name}`}
                  aboutEvent={event.aboutEvent?.substring(0, 100) + "..."}
                  date={event.eventDate ? (() => { const d = new Date(event.eventDate); return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}th`; })() : 'Coming Soon'}
                  prize={`₹${event.prizeMoney}`}
                  image={event.eventPhoto}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Esports;