"use client";

import React, { useRef } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from 'framer-motion';
import Navbar from '@/components/layoutComp/Navbar';
import Footer from '@/components/homepageComp/Footer';
import AccommodationBackground from '@/components/ui/AccommodationBackground';
import { IMAGES } from '@/constants/assets';

/* ─────────────────────────────────────────
   Helper — single word that clip-reveals upward on mount
───────────────────────────────────────────*/
function RevealWord({
    children,
    delay = 0,
    color,
}: {
    children: React.ReactNode;
    delay?: number;
    color?: string;
}) {
    return (
        <span className="inline-block overflow-hidden leading-tight">
            <motion.span
                className="inline-block"
                style={{ color }}
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
            >
                {children}
            </motion.span>
        </span>
    );
}

/* ─────────────────────────────────────────
   Member card
───────────────────────────────────────────*/
const MemberCard = ({
    name,
    image,
    index = 0,
}: {
    name: string;
    image: string;
    index?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
            duration: 0.7,
            delay: index * 0.14,
            ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -7, transition: { duration: 0.22, ease: 'easeOut' } }}
        className="relative bg-white/5 border border-gray-700/30 overflow-hidden flex flex-col items-center group w-[80%] mx-auto cursor-default"
    >
        {/* Corner accents — top-left + bottom-right */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]/70 z-20" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]/70 z-20" />

        {/* Hover shimmer */}
        <div
            className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(51,171,185,0.09) 0%, transparent 65%)' }}
        />

        {/* Square photo */}
        <div className="w-full aspect-square overflow-hidden">
            <motion.img
                src={image}
                alt={name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                whileHover={{ scale: 1.05, transition: { duration: 0.4 } }}
            />
        </div>

        {/* Name */}
        <div className="relative z-10 w-full px-4 py-4 text-center border-t border-gray-700/30">
            <p
                className="text-white font-bold text-base uppercase tracking-widest"
                style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
                {name}
            </p>
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────
   Section heading — lines extend full width with animated reveal
───────────────────────────────────────────*/
const SectionHeading = ({
    first,
    firstCyan,
    delay = 0,
}: {
    first: string;
    firstCyan: boolean;
    delay?: number;
}) => (
    <motion.div
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center mb-10"
    >
        <h2
            className="text-3xl md:text-4xl font-black uppercase tracking-widest text-center"
            style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
        >
            <span style={{ color: firstCyan ? '#33ABB9' : '#e5e7eb' }}>{first}</span>
            {' '}
            <span style={{ color: '#e5e7eb' }}>Developers</span>
        </h2>
    </motion.div>
);

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────────*/
export default function TeamPage() {
    const logo = IMAGES.mbLogoJpg;

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });

    // Smooth spring-based parallax for the hero block
    const rawY = useTransform(scrollYProgress, [0, 1], [0, -120]);
    const rawOp = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const heroY = useSpring(rawY, { stiffness: 80, damping: 20 });
    const heroOp = useSpring(rawOp, { stiffness: 80, damping: 20 });

    const seniors = [
        { name: 'Nirmeet Parmar', image: logo },
        { name: 'Nevil Vataliya', image: logo },
        { name: 'Sneh Karanjiya', image: logo },
    ];

    const juniors = [
        { name: 'Gaurav', image: logo },
        { name: 'Rudraksh', image: logo },
        { name: 'Rushang', image: logo },
    ];

    return (
        <>
            <Navbar />

            <div
                ref={containerRef}
                className="relative pt-24 md:pt-18 w-full min-h-screen text-white overflow-x-hidden selection:bg-[#33ABB9]/30"
            >
                <AccommodationBackground />

                <div className="container mx-auto py-8 relative z-10">

                    {/* ── HERO — parallax + spring scroll ── */}
                    <motion.div
                        style={{ y: heroY, opacity: heroOp }}
                        className="flex flex-col items-center w-full mb-14"
                    >
                        {/* Title — each word clips up from underneath */}
                        <h1
                            className="text-5xl sm:text-7xl md:text-9xl uppercase tracking-normal leading-[1.1] font-black text-center px-4"
                            style={{
                                fontFamily: 'Barlow Condensed, sans-serif',
                                fontWeight: 900,
                                textShadow: '0 2px 8px rgba(0,0,0,0.25)',
                            }}
                        >
                            <RevealWord delay={0.18} color="#e5e7eb">WEB</RevealWord>
                            {' '}
                            <RevealWord delay={0.28} color="#e5e7eb">DEV</RevealWord>
                            {' '}
                            <RevealWord delay={0.40} color="#33ABB9">TEAM</RevealWord>
                        </h1>

                        {/* Tagline */}
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.75, delay: 0.65, ease: 'easeOut' }}
                            className="text-center max-w-3xl"
                        >
                            <p className="text-gray-300 text-lg md:text-xl leading-relaxed tracking-widest uppercase font-semibold">
                                Meet the{' '}
                                <span className="text-[#33ABB9] font-bold">Architects</span>
                                {' '}Behind{' '}
                                <span className="text-[#33ABB9] font-bold">Mindbend&apos;s</span>
                                {' '}
                                <span className="text-white font-bold">Digital Backbone</span>
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* ── SENIOR DEVELOPERS ── */}
                    <div className="px-8 md:px-12 lg:px-22 mb-16">
                        <SectionHeading first="Senior" firstCyan={true} delay={0.05} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                            {seniors.map((m, i) => (
                                <MemberCard key={m.name} {...m} index={i} />
                            ))}
                        </div>
                    </div>

                    {/* ── JUNIOR DEVELOPERS ── */}
                    <div className="px-8 md:px-12 lg:px-22 mb-12">
                        <SectionHeading first="Junior" firstCyan={true} delay={0.05} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                            {juniors.map((m, i) => (
                                <MemberCard key={m.name} {...m} index={i} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}
