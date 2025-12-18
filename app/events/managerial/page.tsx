'use client';

// import ManagerialBackground from '@/components/managerial/ManagerialBackground';
// import EventCard from '@/components/managerial/EventCard';
// import { IMAGES } from '@/components/events/constants'; // Import real data
// import Link from 'next/link';
import ManagerialBackground from "@/components/ManagerialBackground";

// Helper to generate slug consistent with the detail page logic
// const generateSlug = (item: any) => {
//     return `${item.title.toLowerCase().replace(/\s+/g, '-')}-${item.subtitle.toLowerCase().replace(/\s+/g, '-')}`;
// };

export default function ManagerialPage() {
    return (
        <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-blue-500/30">
            <div className="fixed inset-0 z-0">
                {/* <ManagerialBackground /> */}
                <ManagerialBackground
                    density={350}
                    backgroundColor="#000000"
                    fontSize={25}
                    speed={1}
                    opacity={0.8}
                />
            </div>

        </div>
    );
}
