'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { IMAGES } from "@/constants/assets";

interface EventCardProps {
    title: string;
    slug: string,
    aboutEvent: string;
    showExploreButton?: boolean;
    date: string;
    prize: string;
    delay?: number;
    image?: string;
}

// Technical Theme Colors:
// Cyan: #33ABB9
// Dark Green: #184344
// Orange: #E8823A

const TechDecorationTopLeft = () => (
    <svg className="absolute -top-[1px] -left-[1px] w-16 h-16 pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M0 64V16L16 0H64" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
        <path d="M0 16L16 0" fill="#33ABB9" fillOpacity="0.2" />
        <circle cx="16" cy="16" r="2" fill="#33ABB9" />
        <path d="M6 16H26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
        <path d="M16 6V26" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
);

const TechDecorationBottomRight = () => (
    <svg className="absolute -bottom-[1px] -right-[1px] w-20 h-20 pointer-events-none" viewBox="0 0 80 80" fill="none">
        <path d="M80 0V48L64 64H48L32 80H0" stroke="#33ABB9" strokeWidth="1.5" strokeOpacity="1" />
        <path d="M64 64L32 80V64H64Z" fill="#33ABB9" fillOpacity="0.1" />
        <g transform="translate(60, 60)">
            <circle cx="0" cy="0" r="12" stroke="#33ABB9" strokeWidth="1" strokeOpacity="0.8" strokeDasharray="10 5" />
            <circle cx="0" cy="0" r="6" stroke="#33ABB9" strokeWidth="1" fill="#33ABB9" fillOpacity="0.2" />
            <circle cx="0" cy="0" r="2" fill="#ffffff" />
        </g>
    </svg>
);

const TechDecorationTopRight = () => (
    <svg className="absolute -top-[1px] -right-[1px] w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
        <path d="M0 0H32L48 16V32" stroke="#33ABB9" strokeWidth="1.5" />
        <rect x="42" y="6" width="3" height="3" fill="#33ABB9" />
        <rect x="38" y="6" width="3" height="3" fill="#33ABB9" fillOpacity="0.5" />
    </svg>
)

const TechDecorationBottomLeft = () => (
    <svg className="absolute -bottom-[1px] -left-[1px] w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
        <path d="M0 32V48H16" stroke="#33ABB9" strokeWidth="1.5" />
        <path d="M0 32L16 48" stroke="#33ABB9" strokeWidth="0.5" strokeOpacity="0.3" />
    </svg>
)

const WorkshopEventCard: React.FC<EventCardProps> = ({ showExploreButton = true, title, slug, date, prize, delay = 0, image }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="relative group min-h-[350px] w-full max-w-[350px] mx-auto"
        >
            {/* Background Shape */}
            <div
                className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-[0px] border-white/5 shadow-xl transition-all duration-300 group-hover:bg-[#2a1f3a]/40"
                style={{
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)'
                }}
            />

            {/* Decorative Overlays - Cyan Theme */}
            <TechDecorationTopLeft />
            <TechDecorationTopRight />
            <TechDecorationBottomRight />
            <TechDecorationBottomLeft />

            <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
            <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
            <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-gradient-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
            <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />


            {/* Internal Content */}
            <div className="relative z-10 p-4 flex flex-col h-full">
                {/* Header */}
                <div className="mb-3 pl-2 border-l-2 border-[#33ABB9]/50">
                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-[#33ABB9] transition-colors uppercase font-['Orbitron']">
                        {title}
                    </h3>
                    <div className="mt-2 flex items-center space-x-2">
                        <div className="h-1 w-1 bg-[#33ABB9] rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-[#33ABB9]/80 bg-[#184344]/30 px-2 py-0.5 rounded border border-[#33ABB9]/30">
                            {date}
                        </span>
                    </div>
                </div>

                {/* Image Placeholder */}
                <div className="relative w-full h-60 mb-3 rounded-sm overflow-hidden border border-white/10 bg-black/50 group-hover:border-[#33ABB9]/30 transition-colors">
                    <Image
                        src={image || IMAGES.workshopImg}
                        alt={title}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    {/* Image Overlay Texture */}
                    <div className="absolute inset-0 bg-[url('/grid-pixel.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                </div>

                {/* Footer */}
                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-[#33ABB9] mb-1">Entry Fee</span>
                        <span className="text-lg font-bold text-[#33ABB9] font-mono">{prize}</span>
                    </div>

                    {showExploreButton &&
                    <Link href={slug} className="block">
                        <button className="group/btn relative px-5 py-2 bg-[#184344]/40 hover:bg-[#33ABB9]/20 border border-[#33ABB9]/50 text-[#33ABB9] text-xs font-bold tracking-wider uppercase transition-all overflow-hidden cursor-pointer">
                            <span className="relative z-10">Explore</span>
                            <div className="absolute inset-0 bg-[#33ABB9]/20 transform -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-full transition-transform duration-500" />
                        </button>
                    </Link>
                    }
                </div>
            </div>
        </motion.div>
    );
};

export default WorkshopEventCard;
