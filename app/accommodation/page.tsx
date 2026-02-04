"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Shield, Home, Building, ExternalLink } from 'lucide-react';
import Navbar from '@/components/layoutComp/Navbar';
import Footer from '@/components/homepageComp/Footer';
import { TechDecorationBottomLeft, TechDecorationBottomRight, TechDecorationTopLeft, TechDecorationTopRight } from '@/components/ui/TechDecorations';
import AccommodationBackground from '@/components/ui/AccommodationBackground';

const AccommodationCard = ({
  title,
  tag,
  description,
  price,
  features,
  tagColor,
  icon: Icon,
  delay = 0
}: {
  title: string;
  tag: string;
  description: string;
  price: string;
  features: string[];
  tagColor: string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative bg-white/5 border border-gray-700/30 overflow-hidden"
  >
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]/70" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]/70" />

    <div className="relative z-10 p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white tracking-wide uppercase font-orbitron mb-3">
          {title}
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded border ${tagColor}`}>
            {tag}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-base mb-5 leading-relaxed">{description}</p>

      {/* Features */}
      <div className="space-y-3 mb-7">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <div className="w-1 h-1 bg-[#33ABB9] rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-400">{feature}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mt-auto flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-[#33ABB9] mb-1">COST/DAY</span>
          <span className="text-3xl font-bold text-[#E8823A] font-mono">{price}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

const ImportantNotes = ({ notes, title, delay = 0 }: { notes: string[], title: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="relative bg-white/5 border border-gray-700/30 overflow-hidden"
  >
    {/* Corner Accents in Red */}
    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-400/70" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-400/70" />

    <div className="relative p-6">
      <div className="flex items-center gap-3 mb-4">
        <Shield className="w-5 h-5 text-red-400" />
        <h3 className="text-xl font-bold text-red-400 uppercase font-orbitron tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3">
        {notes.map((note, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            <div className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0" />
            <span className="text-gray-300">{note}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default function AccommodationPage() {
  const accommodationOptions = [
    {
      title: "Guest House",
      tag: "SVP Bhavan",
      description: "Guest House opposite to SVNIT Main Gate named, SVP Bhavan. Perfect for comfortable stay with premium amenities and dedicated facilities.",
      price: "₹1500",
      tagColor: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
      icon: Home,
      features: [
        "INR 1500/- per day for one room (2 person capacity)",
        "First come, first serve basis allocation",
        "In-time: 11:30 PM",
        "24-hour charges, no specific check-in/out time",
        "Total capacity: 20 seats only"
      ]
    },
    {
      title: "Common Halls",
      tag: "Hostel Stay",
      description: "Common Halls for Boys and Girls at respective Hostels. Budget-friendly accommodation with essential facilities for comfortable stay.",
      price: "₹150",
      tagColor: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
      icon: Building,
      features: [
        "INR 150/- per day",
        "Girls Hostel In-time: 10:30 PM",
        "Entrance Gate In-time: 10:30 PM (Both genders)",
        "Separate halls for boys and girls"
      ]
    }
  ];

  const guestHouseNotes = [
    "Before in-time everyone must be in the room",
    "No suspicious activity is promoted, strict actions will be taken by the college authorities if found",
    "Only two persons of the same gender are allowed per room"
  ];

  const hostelNotes = [
    "No boys will be allowed in girls hostel and no girls will be allowed in boys hostel",
    "Smoking or drinking are not allowed in the college premises, strict actions will be taken if found"
  ];

  return (
    <>
      <Navbar />
      <div className="relative pt-32 md:pt-24 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30">
        {/* Dynamic Shader Background */}
        <AccommodationBackground />

        <div className="container mx-auto py-8 relative z-10">
          <div className="flex flex-col items-center w-full animate-fade-in">
            <h1
              className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-normal leading-[1.1] font-black mb-6 text-center px-4"
              style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                color: '#e5e7eb',
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.25)'
              }}
            >
              ACCOMMODATION
            </h1>
            <div className="text-center mb-12 max-w-3xl">
              <p className="text-gray-400 text-base leading-relaxed">
                Choose from our carefully curated accommodation options designed to provide comfort and convenience during Mindbend 2026.
              </p>
            </div>
          </div>

          {/* Accommodation Options */}
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 my-12">
            {accommodationOptions.map((option, index) => (
              <AccommodationCard key={index} {...option} delay={index * 0.1} />
            ))}
          </div>

          {/* Important Notes Sections */}
          <div className="grid lg:grid-cols-2 gap-10 md:gap-20 px-8 md:px-12 lg:px-22 mb-12">
            <ImportantNotes
              title="Guest House Guidelines"
              notes={guestHouseNotes}
              delay={0.2}
            />
            <ImportantNotes
              title="Hostel Stay Guidelines"
              notes={hostelNotes}
              delay={0.3}
            />
          </div>

          {/* Google Form Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative bg-white/5 border border-gray-700/30 overflow-hidden w-full max-w-4xl mx-auto px-8 md:px-12 lg:px-22"
          >
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]/70" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]/70" />

            <div className="relative z-10 p-8 text-center">
              <div className="mb-6 pl-3 border-l-2 border-[#33ABB9]/50">
                <h3 className="text-2xl font-bold text-white tracking-wide uppercase font-orbitron">
                  Book Your Stay
                </h3>
              </div>

              <p className="text-gray-300 text-base mb-8 max-w-2xl mx-auto leading-relaxed">
                Ready to secure your accommodation for Mindbend 2026? Fill out our booking form to reserve your preferred option.
                Limited availability - book early to guarantee your spot!
              </p>

              <a
                href="https://forms.gle/ERQMVfLx8Kg61Xjm6"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-block px-8 py-3 bg-[#184344]/40 hover:bg-[#33ABB9]/20 border border-[#33ABB9]/50 text-[#33ABB9] text-sm font-bold tracking-wider uppercase transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Book Accommodation
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}