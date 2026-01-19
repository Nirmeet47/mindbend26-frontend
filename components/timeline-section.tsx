'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface TimelineEvent {
    year: string;
    title: string;
    description: string;
}

const events: TimelineEvent[] = [
    {
        year: "1995",
        title: "Genesis",
        description: "Born from innovation at SVNIT Surat, pioneering the techno-managerial revolution in Gujarat."
    },
    {
        year: "2010",
        title: "Digital Era",
        description: "Embraced AI, robotics, and cutting-edge tech, transforming into a digital powerhouse."
    },
    {
        year: "2020",
        title: "Global Impact",
        description: "Reached 15,000+ participants nationwide, creating a movement of innovation."
    },
    {
        year: "2026",
        title: "Future Vision",
        description: "Leading ethical AI and sustainable tech, shaping tomorrow's indigenous innovation."
    }
];

const CYAN_GLOW = '#00f2ff';

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
            className="relative py-32 overflow-hidden bg-[#020205]"
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

                {/* Mobile Straight Line - REMOVED for Centered Layout */}
                {/* <div className="md:hidden absolute left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#00f2ff]/30 to-transparent"></div> */}

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
            className={`relative flex flex-col md:flex-row items-center justify-between w-full min-h-[400px] md:h-[400px] transition-all duration-1000 ease-in-out py-10 md:py-0
                ${isVisible ? 'opacity-100' : 'opacity-0 translate-y-12'}`}
        >
            {/* The Anchor Node on the curve */}
            <div className={`relative md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-20 mb-8 md:mb-0`}>
                <div className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${isVisible ? 'scale-100' : 'scale-0'}`}>
                    <div className="absolute w-16 h-16 rounded-full blur-xl animate-pulse" style={{ backgroundColor: `${CYAN_GLOW}1A` }} />
                    <div className="w-4 h-4 rounded-full bg-white z-20 border-2" style={{
                        borderColor: CYAN_GLOW,
                        boxShadow: `0 0 15px ${CYAN_GLOW}`
                    }} />

                    {/* Connector line to card */}
                    <div
                        className={`absolute h-[1px] transition-all duration-1000 delay-500
                            ${isEven ? 'right-full origin-right' : 'left-full origin-left'}
                            ${isVisible ? 'w-12 md:w-24 opacity-40' : 'w-0 opacity-0'}`}
                        style={{
                            background: `linear-gradient(to ${isEven ? 'left' : 'right'}, ${CYAN_GLOW}, transparent)`
                        }}
                    />
                </div>

                {/* Year Label */}
                <div className={`absolute top-8 whitespace-nowrap font-mono text-xs tracking-[0.4em] font-bold transition-all duration-1000 delay-300
                    ${isVisible ? 'opacity-100' : 'opacity-0'}
                    left-1/2 -translate-x-1/2 md:translate-x-0 ${isEven ? 'md:right-8 md:text-right md:left-auto' : 'md:left-8 md:text-left'}`}>
                    <span style={{ color: CYAN_GLOW }}>{event.year}</span>
                </div>
            </div>

            {/* Content Card */}
            <div className={`w-full max-w-sm md:max-w-none md:w-[40%] group ${sideClass}`}>
                <div className={`p-6 md:p-10 rounded-3xl border transition-all duration-1000 delay-100 backdrop-blur-xl relative overflow-hidden
                    ${isVisible
                        ? 'bg-white/5 border-white/10 shadow-[40px_40px_80px_rgba(0,0,0,0.4)] translate-x-0'
                        : `bg-transparent border-transparent ${isEven ? 'translate-x-10' : '-translate-x-10'}`}`}>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 border-t border-r rounded-tr-3xl" style={{ borderColor: `${CYAN_GLOW}4D` }} />

                    <h3
                        className="text-2xl md:text-4xl font-serif mb-4 leading-tight text-white transition-colors duration-500"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                        {event.title}
                    </h3>

                    <p className="text-blue-100/60 leading-relaxed font-light text-sm md:text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                        {event.description}
                    </p>

                    <div className="mt-8 flex items-center gap-4 group-hover:gap-6 transition-all">
                        <div className="px-3 py-1 rounded border text-[10px] tracking-tighter uppercase font-bold"
                            style={{
                                backgroundColor: `${CYAN_GLOW}1A`,
                                borderColor: `${CYAN_GLOW}33`,
                                color: CYAN_GLOW
                            }}>
                            Milestone {index + 1}
                        </div>
                        <div className="h-[1px] flex-grow bg-white/10" />
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="w-[45%] md:w-[40%] hidden md:block" />
        </div>
    );
}
