'use client';
import ManagerialBackground from "@/components/events/ManagerialBackground";
import EventCard from "@/components/EventCard";
import Link from "next/link";


import { useEffect, useState } from 'react';
import { publicEventsApi } from "@/lib/events";
import Navbar from "@/components/layoutComp/Navbar";

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

export default function ManagerialPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {

            publicEventsApi
                .listByType("managerial")
                .then((res) => {
                    const events = res.data?.data?.events || [];
                    // Sort events by prize money in descending order (highest prize first)
                    const sortedEvents = events.sort((a: Event, b: Event) => Number(b.prizeMoney) - Number(a.prizeMoney));
                    setEvents(sortedEvents);
                })
                .catch(() => {setError('Failed to load events')})
                .finally(() => setLoading(false))
        }
        fetchEvents();

    }, []);

    return (
        <>
        <Navbar />
        <div className="relative mt-8 w-full min-h-screen text-white overflow-x-hidden selection:bg-blue-500/30">
            <div className="fixed inset-0 z-0">
                <ManagerialBackground
                    density={350}
                    backgroundColor="#000000"
                    fontSize={25}
                    speed={1}
                    opacity={0.8}
                />
            </div>
            <div className="container mx-auto py-8 relative z-10">
                <div className="flex flex-col items-center w-full animate-fade-in">
                    <h1
                        className="text-5xl sm:text-7xl md:text-8xl uppercase tracking-normal leading-[1.1] font-black mb-4"
                        style={{
                            fontFamily: 'Barlow Condensed, sans-serif',
                            color: '#e5e7eb', // off-white
                            fontWeight: 900,
                            textShadow: '0 2px 8px rgba(0,0,0,0.25)'
                        }}
                    >
                        MANAGERIAL EVENTS
                    </h1>
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-linear-to-br from-gray-800/50 to-gray-900/50 rounded-lg overflow-hidden border border-gray-700/30">
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
                    {events.map(event => (
                        
                        <EventCard
                            key={event._id}
                            slug={`/managerial/${event.slug}`}
                            title={`${event.name}`}
                            aboutEvent={event.aboutEvent?.substring(0, 100) + "..."}
                            date={event.eventDate ? (() => { const d = new Date(event.eventDate); return `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}th`; })() : 'Coming Soon'}
                            prize={`₹${event.prizeMoney}`}
                            // delay={index * 0.05}
                            image={event.eventPhoto}
                        />
                    ))}
                </div>
                )}
            </div>
        </div>
        </>
    );
}
