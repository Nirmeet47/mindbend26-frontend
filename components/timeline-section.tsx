'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

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

export default function TimelineSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="relative py-32 overflow-hidden bg-[#020205]"
        >
            {/* Flowing White Line with Curls - Extended to reach the end */}
            <svg
                className="absolute left-0 top-0 w-full h-full pointer-events-none"
                viewBox="0 0 1000 3400"
                preserveAspectRatio="none"
            >
                {/* Main flowing path - EXTENDED to reach all the way to the bottom */}
                <motion.path
                    d="M 100 50 Q 700 150, 300 450 Q 50 650, 600 850 Q 950 1050, 350 1350 Q 150 1550, 700 1750 Q 900 1950, 500 2150 Q 300 2350, 600 2550 Q 800 2750, 400 2950 Q 200 3100, 500 3250 L 500 3350"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    style={{ pathLength }}
                    initial={{ pathLength: 0 }}
                />

                {/* Decorative curls and loops */}
                <motion.circle
                    cx="500"
                    cy="300"
                    r="40"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />

                <motion.path
                    d="M 600 600 Q 650 550, 700 600 Q 650 650, 600 600"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />

                <motion.circle
                    cx="350"
                    cy="1100"
                    r="30"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                    fill="none"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                />

                <motion.path
                    d="M 700 1500 Q 750 1450, 800 1500 Q 750 1550, 700 1500"
                    stroke="rgba(255, 255, 255, 0.25)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2.5 }}
                />

                {/* Spiral curl */}
                <motion.path
                    d="M 400 1900 Q 450 1850, 500 1900 Q 450 1950, 400 1900 Q 430 1920, 470 1900"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: 3 }}
                />
            </svg>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header - Hidden initially, appears on scroll */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="text-center mb-32"
                >
                    <h2 className="text-7xl md:text-9xl font-black tracking-tight mb-4" style={{ color: '#00d3f2' }}>
                        Our Journey
                    </h2>
                    <p className="text-lg" style={{ color: 'rgba(0, 211, 242, 0.7)', fontFamily: 'Space Grotesk, sans-serif' }}>
                        Three decades of innovation and excellence
                    </p>
                </motion.div>

                {/* Timeline Events */}
                <div className="relative space-y-56">
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
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Only show after scrolling - starts invisible
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.9], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.9], [100, 0, 0, -100]);
    const scale = useTransform(scrollYProgress, [0, 0.2, 0.7, 0.9], [0.8, 1, 1, 0.8]);

    // Alternate positioning
    const isLeft = index % 2 === 0;
    const x = useTransform(
        scrollYProgress,
        [0, 0.2, 0.7, 0.9],
        isLeft ? [-150, 0, 0, 150] : [150, 0, 0, -150]
    );

    return (
        <motion.div
            ref={ref}
            style={{ opacity, y, scale, x }}
            className={`relative ${isLeft ? 'text-left md:ml-0' : 'text-right md:ml-auto'} max-w-2xl`}
        >
            {/* Year - Large Background - Bluish */}
            <motion.div
                className="mb-6"
                whileHover={{ scale: 1.05 }}
            >
                <span
                    className="text-9xl md:text-[12rem] font-black"
                    style={{
                        color: 'rgba(0, 185, 218, 0.15)',
                        WebkitTextStroke: '1px rgba(0, 211, 242, 0.2)',
                    }}
                >
                    {event.year}
                </span>
            </motion.div>

            {/* Title - Bluish */}
            <motion.h3
                className="text-6xl md:text-8xl font-black mb-6 leading-tight"
                style={{ color: '#00d3f2' }}
                whileHover={{ x: isLeft ? 10 : -10 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                {event.title}
            </motion.h3>

            {/* Description - Light Blue */}
            <motion.p
                className="text-xl md:text-2xl leading-relaxed max-w-xl"
                style={{ color: '#00b9da', fontFamily: 'Space Grotesk, sans-serif' }}
                whileHover={{ color: '#00d3f2' }}
            >
                {event.description}
            </motion.p>

            {/* Decorative White Line */}
            <motion.div
                className={`h-px w-40 mt-8 ${!isLeft && 'ml-auto'}`}
                style={{ backgroundColor: 'rgba(0, 185, 218, 0.4)' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ transformOrigin: isLeft ? 'left' : 'right' }}
            />

            {/* Dot on the line */}
            <motion.div
                className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-1/2 w-3 h-3 rounded-full shadow-lg`}
                style={{ backgroundColor: '#00d3f2', boxShadow: '0 0 20px rgba(0, 211, 242, 0.5)' }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                viewport={{ once: true }}
            />
        </motion.div>
    );
}
