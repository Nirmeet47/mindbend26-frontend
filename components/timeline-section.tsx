'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import EventCard from './EventCard';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

const events: TimelineEvent[] = [
    {
        year: "1950s–60s",
        title: "Foundations",
        description: "IITs, IISc, ISRO founded: Human intelligence strengthened"
    },
    {
        year: "1980s",
        title: "Computing Era",
        description: "Computers & C-DAC: Machines assist human work"
    },
    {
        year: "1990s",
        title: "IT Boom",
        description: "Human skill meets machine efficiency"
    },
    {
        year: "2009",
        title: "Identity",
        description: "Aadhaar: Digital identity at national scale"
    },
    {
        year: "2015",
        title: "Digital India",
        description: "Technology empowers citizens"
    },
    {
        year: "2018",
        title: "AI Strategy",
        description: "National AI Strategy: “AI for All” vision"
    },
    {
        year: "2023",
        title: "IndiaAI",
        description: "IndiaAI Mission: Indigenous AI ecosystem born"
    },
    {
        year: "2024",
        title: "Adoption",
        description: "AI adoption across governance & Indian languages"
    },
    {
        year: "2025",
        title: "Expansion",
        description: "National AI infrastructure & research hubs expand"
    },
    {
        year: "2026",
        title: "Future",
        description: "Nationwide AI centres & ethical AI governance"
    }
];

const CYAN_GLOW = '#33ABB9';

export default function TimelineSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    // Transform scroll progress to path length (0 to 100)
    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // Generate curved path
    const pathData = events.map((_, i) => {
        const yStart = i * 400;
        const yMid = yStart + 200;
        const yEnd = yStart + 400;
        const xMid = i % 2 === 0 ? 150 : 50;
        return `Q ${xMid} ${yMid}, 100 ${yEnd}`;
    }).join(' ');

    const fullPath = `M 100 0 ${pathData}`;

    return (
        <section
            ref={containerRef}
            className="relative py-32 overflow-hidden"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="sticky top-0 h-screen overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 blur-[150px] rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 blur-[150px] rounded-full" style={{ backgroundColor: `${CYAN_GLOW}10` }} />
                </div>
            </div>

            {/* Header - Above Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-center mb-20 relative z-10"
            >
                <h2 className="text-7xl md:text-9xl font-black tracking-tight mb-4 text-white">
                    Our Journey
                </h2>
                <p className="text-lg mb-12" style={{ color: `${CYAN_GLOW}B3`, fontFamily: 'Space Grotesk, sans-serif' }}>
                    Three decades of innovation and excellence
                </p>
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* The Curved Track Container (Desktop Only) */}
                <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[200px] pointer-events-none">
                    <svg
                        viewBox={`0 0 200 ${events.length * 400}`}
                        preserveAspectRatio="none"
                        className="w-full h-full overflow-visible"
                    >
                        <defs>
                            <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{ stopColor: CYAN_GLOW, stopOpacity: 0.1 }} />
                                <stop offset="50%" style={{ stopColor: '#003399', stopOpacity: 0.3 }} />
                                <stop offset="100%" style={{ stopColor: CYAN_GLOW, stopOpacity: 0.1 }} />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Static Background Path */}
                        <path
                            d={fullPath}
                            stroke="url(#curveGrad)"
                            strokeWidth="2"
                            fill="none"
                            className="opacity-20"
                        />

                        {/* Animated Progress Path */}
                        <motion.path
                            d={fullPath}
                            stroke={CYAN_GLOW}
                            strokeWidth="3"
                            fill="none"
                            pathLength="1"
                            strokeDasharray="1"
                            strokeDashoffset={useTransform(pathLength, [0, 100], [1, 0])}
                            filter="url(#glow)"
                            strokeLinecap="round"
                            style={{
                                strokeDashoffset: useTransform(pathLength, [0, 100], [1, 0])
                            }}
                        />
                    </svg>
                </div>

                {/* Mobile Straight Line */}
                <div className="md:hidden absolute left-4 sm:left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#33ABB9]/50 to-transparent"></div>

                {/* Timeline Events */}
                <div className="relative space-y-0">
                    {events.map((event, index) => (
                        <TimelineEvent
                            key={index}
                            event={event}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

interface TimelineEventProps {
    event: TimelineEvent;
    index: number;
}

function TimelineEvent({ event, index }: TimelineEventProps) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) setIsVisible(true);
                else if (entry.boundingClientRect.top > 0) setIsVisible(false);
            });
        }, {
            threshold: 0.2,
            rootMargin: "-10% 0px -10% 0px"
        });

        if (domRef.current) observer.observe(domRef.current);
        return () => {
            if (domRef.current) observer.unobserve(domRef.current);
        };
    }, []);

    const isEven = index % 2 === 0;
    const sideClass = isEven ? 'md:pr-24 lg:pr-32' : 'md:pl-24 lg:pl-32 md:order-last';

    return (
        <div
            ref={domRef}
            className={`relative flex flex-col md:flex-row items-start md:items-center justify-between w-full min-h-[250px] md:h-[400px] transition-all duration-1000 ease-in-out py-0 md:py-0
                ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-12'}`}
        >
            {/* The Anchor Node on the curve */}
            <div className={`
                absolute md:static left-4 sm:left-8 md:left-auto 
                -translate-x-1/2 md:translate-x-0
                md:absolute md:left-1/2 md:-translate-x-1/2 
                flex items-center justify-center z-20 
                top-10 md:top-auto
            `}>
                <div className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${isVisible ? 'scale-100' : 'scale-0'}`}>
                    <div className="absolute w-12 h-12 md:w-16 md:h-16 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${CYAN_GLOW}1A` }} />
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white z-20 border-2" style={{
                        borderColor: CYAN_GLOW,
                        boxShadow: `0 0 15px ${CYAN_GLOW}`
                    }} />

                    {/* Connector line to card */}
                    <div
                        className={`absolute h-[1px] transition-all duration-1000 delay-500
                            origin-left md:origin-center
                            left-full md:left-auto
                            ${isEven ? 'md:right-full md:origin-right' : 'md:left-full md:origin-left'}
                            ${isVisible ? 'w-8 md:w-24 opacity-40' : 'w-0 opacity-0'}`}
                        style={{
                            background: `linear-gradient(to ${isEven ? 'left' : 'right'}, ${CYAN_GLOW}, transparent)`
                        }}
                    />
                </div>

                {/* Year Label */}
                <div className={`absolute -top-6 md:top-8 whitespace-nowrap font-mono text-xs tracking-[0.4em] font-bold transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                    left-1/2 -translate-x-1/2 md:translate-x-0 
                    ${isEven ? 'md:right-8 md:text-right md:left-auto' : 'md:left-8 md:text-left'}`}>
                    <span style={{ color: CYAN_GLOW }}>{event.year}</span>
                </div>
            </div>

            {/* Content Card */}
            <div className={`w-full pl-12 sm:pl-20 md:pl-0 md:max-w-none md:w-[40%] group ${sideClass}`}>
                <div className={`transition-all duration-1000 delay-100 relative
                    ${isVisible
                        ? 'opacity-100 translate-x-0'
                        : `opacity-0 ${isEven ? 'translate-x-10' : '-translate-x-10'}`}`}>
                    <EventCard
                        title={event.title}
                        aboutEvent={event.description}
                        date={event.year}
                        prizeLabel="Milestone"
                        prize={(index + 1).toString().padStart(2, '0')}
                        slug="#"
                        showExploreButton={false}
                        showImage={false}
                    />
                </div>
            </div>

            {/* Spacer */}
            <div className="w-[45%] md:w-[40%] hidden md:block" />
        </div>
    );
}
