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

function Technical() {
  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">

      <TechnicalBackground />
    </div>
  )
}

export default Technical