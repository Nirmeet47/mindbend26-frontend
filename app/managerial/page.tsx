'use client';

// import ManagerialBackground from '@/components/managerial/ManagerialBackground';
// import { IMAGES } from '@/components/events/constants'; // Import real data
import ManagerialBackground from "@/components/events/ManagerialBackground";
import EventCard from "@/components/EventCard";
import Link from "next/link";

// Helper to generate slug consistent with the detail page logic
// const generateSlug = (item: any) => {
//     return `${item.title.toLowerCase().replace(/\s+/g, '-')}-${item.subtitle.toLowerCase().replace(/\s+/g, '-')}`;
// };


import { useEffect, useState } from 'react';

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

export default function ManagerialPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';
                const res = await fetch(`${apiUrl}/api/events/public/type/managerial`, {
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


        // dummy data for testing
        // setEvents([
        //     {
        //     _id: "1",
        //     name: "Codewars",
        //     description: "coding..",
        //     slug: "codewars",
        //     prizeMoney: 100,
        //     eventDate: new Date(),
        //     eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
        //     },
        //     {
        //     _id: "2",
        //     name: "Codewars",
        //     description: "coding..",
        //     slug: "codewars",
        //     prizeMoney: 100,
        //     eventDate: new Date(),
        //     eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
        //     },
        //     {
        //     _id: "3",
        //     name: "Codewars",
        //     description: "coding..",
        //     slug: "codewars",
        //     prizeMoney: 100,
        //     eventDate: new Date(),
        //     eventPhoto: "https://mindbend-main.vercel.app/mindbend.png"
        //     },
        // ])
        // setLoading(false)

    }, []);

    return (
        <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-blue-500/30">
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
                                        className="text-7xl sm:text-8xl md:text-9xl uppercase tracking-normal leading-[1.2] font-black mb-4"
                                        style={{
                                            fontFamily: 'Barlow Condensed, sans-serif',
                                            color: '#e5e7eb', // off-white
                                            fontWeight: 900,
                                            textShadow: '0 2px 8px rgba(0,0,0,0.25)'
                                        }}
                                    >
                                        MANAGERIAL
                                    </h1>
                                </div>
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        // <div key={event._id} className="bg-[#222] rounded-lg p-6 shadow-md">
                        //     <h2
                        //         className="text-xl font-semibold mb-2"
                        //         style={{
                        //             color: '#e0e4ea', // off-white
                        //             fontWeight: 800,
                        //             textShadow: '0 1px 6px rgba(0,0,0,0.18)'
                        //         }}
                        //     >
                        //         {event.name}
                        //     </h2>
                        //     <p className="text-gray-300">{event.description}</p>
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
