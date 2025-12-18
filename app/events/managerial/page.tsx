'use client';

// import ManagerialBackground from '@/components/managerial/ManagerialBackground';
// import EventCard from '@/components/managerial/EventCard';
// import { IMAGES } from '@/components/events/constants'; // Import real data
// import Link from 'next/link';
import ManagerialBackground from "@/components/events/ManagerialBackground";

// Helper to generate slug consistent with the detail page logic
// const generateSlug = (item: any) => {
//     return `${item.title.toLowerCase().replace(/\s+/g, '-')}-${item.subtitle.toLowerCase().replace(/\s+/g, '-')}`;
// };


import { useEffect, useState } from 'react';

interface Event {
    _id: string;
    name: string;
    description?: string;
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
                <h1 className="text-3xl font-bold mb-6">Managerial Events</h1>
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
