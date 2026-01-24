'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TimelineSection {
    title: string;
    description: string;
    year?: string;
}

const timelineSections: TimelineSection[] = [
    {
        year: "2026",
        title: "The Future of Innovation",
        description: "Rooted in India's values and innovation, the theme envisions an indigenous, ethical intelligence shaped by purpose, responsibility, and self-reliance."
    },
    {
        year: "VISION",
        title: "Techno-Managerial Excellence",
        description: "Where cutting-edge technology meets strategic management. We're building the next generation of leaders who think beyond boundaries."
    },
    {
        year: "IMPACT",
        title: "15,000+ Participants",
        description: "Gujarat's largest techno-managerial festival, bringing together brilliant minds from across the nation to compete, collaborate, and create."
    },
    {
        year: "LEGACY",
        title: "31 Years of Excellence",
        description: "Three decades of fostering innovation, nurturing talent, and creating opportunities that shape the future of technology and management."
    }
];

export default function ScrollTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="bg-black">
            {timelineSections.map((section, index) => (
                <Section
                    key={index}
                    section={section}
                    index={index}
                    progress={scrollYProgress}
                    totalSections={timelineSections.length}
                />
            ))}
        </div>
    );
}

interface SectionProps {
    section: TimelineSection;
    index: number;
    progress: any;
    totalSections: number;
}

function Section({ section, index, progress, totalSections }: SectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);

    const start = index / totalSections;
    const end = (index + 1) / totalSections;

    // Parallax effects
    const y = useTransform(progress, [start, end], ['0%', '-50%']);
    const opacity = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [0, 1, 1, 0]
    );
    const scale = useTransform(
        progress,
        [start, start + 0.1, end - 0.1, end],
        [0.8, 1, 1, 0.8]
    );

    return (
        <div
            ref={sectionRef}
            className="relative h-screen w-full flex items-center justify-center overflow-hidden"
            style={{
                background: `linear-gradient(135deg, 
          rgba(0, 0, 0, 1) 0%, 
          rgba(0, 20, 40, 0.95) 50%, 
          rgba(0, 40, 80, 0.9) 100%)`
            }}
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Glowing Orbs */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
            />

            {/* Content */}
            <motion.div
                style={{ y, opacity, scale }}
                className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center"
            >
                {/* Year/Label */}
                {section.year && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6"
                    >
                        <span className="inline-block px-6 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-mono tracking-widest">
                            {section.year}
                        </span>
                    </motion.div>
                )}

                {/* Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                    {section.title}
                </motion.h2>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-0.5 w-64 mx-auto bg-gradient-to-r from-transparent via-blue-500 to-transparent mb-8"
                />

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-gray-300 text-lg md:text-2xl leading-relaxed max-w-3xl mx-auto"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                    {section.description}
                </motion.p>

                {/* Scroll Indicator (only on first section) */}
                {index === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{
                            opacity: { delay: 1, duration: 0.5 },
                            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-blue-400 text-sm tracking-widest uppercase">Scroll</span>
                            <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex items-start justify-center p-2">
                                <motion.div
                                    animate={{ y: [0, 12, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            {/* Progress Line */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
                <div className="relative h-64 w-0.5 bg-blue-900/30">
                    <motion.div
                        style={{
                            scaleY: useTransform(
                                progress,
                                [start, end],
                                [0, 1]
                            )
                        }}
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500 to-cyan-400 origin-top"
                    />
                    <motion.div
                        style={{
                            y: useTransform(
                                progress,
                                [start, end],
                                ['0%', '100%']
                            )
                        }}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"
                    />
                </div>
            </div>
        </div>
    );
}
