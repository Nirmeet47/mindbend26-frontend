'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface EventCardProps {
    title: string;
    slug: string,
    showExploreButton?: boolean;
    date: string;
    entryFee: string;
    delay?: number;
    image?: string;
}

// Workshop Theme Colors:
// Primary: Cyan (#33ABB9)
// Secondary: Amber (#F59E0B)
// Background: Deep Slate

const DecorationTopLeft = () => (
    <svg className="absolute -top-px -left-px w-12 h-12 pointer-events-none" viewBox="0 0 48 48" fill="none">
        <path d="M0 48V12C0 5.37258 5.37258 0 12 0H48" stroke="#33ABB9" strokeWidth="2" />
        <circle cx="6" cy="6" r="3" fill="#33ABB9" />
        <path d="M12 12L24 24" stroke="#33ABB9" strokeWidth="1" strokeDasharray="2 2" />
    </svg>
);

const DecorationBottomRight = () => (
    <svg className="absolute -bottom-px -right-px w-16 h-16 pointer-events-none" viewBox="0 0 64 64" fill="none">
        <path d="M0 64H52C58.6274 64 64 58.6274 64 52V0" stroke="#33ABB9" strokeWidth="2" strokeOpacity="1" />
        <path d="M64 48L48 64" stroke="#F59E0B" strokeWidth="2" /> {/* Amber accent */}
        <rect x="54" y="54" width="6" height="6" fill="#33ABB9" fillOpacity="0.5" />
    </svg>
);

const WorkshopEventCard: React.FC<EventCardProps> = ({ title, slug, date, entryFee, delay = 0, image, showExploreButton = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="relative group min-h-95 w-full max-w-87.5 mx-auto"
        >
            {/* Card Content Container */}
            <div className="relative h-full bg-[#1e1b29]/80 backdrop-blur-md border border-[#33ABB9]/30 overflow-hidden rounded-xl transition-all duration-300 group-hover:border-[#33ABB9]/80 group-hover:bg-[#2a2438]/90 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]">

                {/* Decorative Elements */}
                <DecorationTopLeft />
                <DecorationBottomRight />

                {/* Top Glowing Edge */}
                <div className="absolute top-0 left-12 right-12 h-px bg-linear-to-r from-transparent via-[#F59E0B] to-transparent opacity-50" />

                <div className="p-5 flex flex-col h-full z-10 relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-mono text-[#33ABB9] tracking-widest border border-[#33ABB9]/30 px-2 py-0.5 rounded-full bg-[#33ABB9]/10">
                            WORKSHOP
                        </span>
                        <div className="flex items-center space-x-1">
                            <span className="block h-2 w-2 rounded-full bg-[#F59E0B] animate-pulse" />
                            <span className="text-[10px] text-gray-400 font-mono">LIVE</span>
                        </div>
                    </div>

                    {/* Image Area */}
                    <div className="relative w-full h-60 mb-4 rounded-lg overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 border border-white/5">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <Image fill src={image} alt={title} className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-linear-to-br from-[#2a2438] to-[#1e1b29] flex items-center justify-center">
                                <span className="text-[#33ABB9]/40 font-mono text-sm">[ LOADING_DATA ]</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-[#1e1b29] to-transparent opacity-60" />
                    </div>

                    {/* name & Info */}
                    <h3 className="text-xl font-bold text-white font-['Outfit'] uppercase tracking-wide group-hover:text-[#33ABB9] transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center space-x-4 mb-auto text-sm text-gray-400 font-mono">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-[#33ABB9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {date}
                        </span>
                    </div>

                    {/* Footer Action */}
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between">
                        <div className="text-center">
                            <span className="block text-[10px] text-gray-500 uppercase tracking-wider">Fees</span>
                            <span className="text-lg font-bold text-[#F59E0B] font-mono">{entryFee}</span>
                        </div>
                    
                    { showExploreButton &&
                    <Link href={slug} className="block">
                        <button className="relative overflow-hidden px-6 py-2 bg-[#33ABB9] text-white font-bold text-xs rounded hover:bg-[#7c3aed] transition-colors group/btn cursor-pointer">
                            <span className="relative z-10 tracking-widest uppercase">EXPLORE</span>
                            <div className="absolute inset-0 bg-white/20 transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                        </button>
                    </Link>
                    }

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default WorkshopEventCard;
