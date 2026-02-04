'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { TechDecorationBottomLeft, TechDecorationBottomRight, TechDecorationTopLeft, TechDecorationTopRight } from './ui/TechDecorations';

interface EventCardProps {
    title: string;
    slug: string,
    aboutEvent: string;
    showExploreButton?: boolean;
    date: string;
    prize: string;
    delay?: number;
    image?: string;
    prizeLabel?: string;
    showImage?: boolean;
}

// Technical Theme Colors:
// Cyan: #33ABB9
// Dark Green: #184344
// Orange: #E8823A


const EventCard: React.FC<EventCardProps> = ({ showExploreButton = true, title, slug, date, prize, delay = 0, image, prizeLabel = "Prize Money", showImage = true }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="relative group min-h-min w-full max-w-87.5 mx-auto"
        >
            {/* Background Shape */}
            <div
                className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-0 border-white/5 shadow-xl transition-all duration-300 group-hover:bg-[#184344]/40"
                style={{
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)'
                }}
            />

            {/* Decorative Overlays - Recolor to Cyan (#33ABB9) */}
            <TechDecorationTopLeft />
            <TechDecorationTopRight />
            <TechDecorationBottomRight />
            <TechDecorationBottomLeft />

            <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-linear-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
            <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-linear-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />
            <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-linear-to-r from-[#33ABB9]/50 to-[#33ABB9]/20" />
            <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-linear-to-b from-[#33ABB9]/20 to-[#33ABB9]/50" />


            {/* InternalContent */}
            <div className="relative z-10 p-4 flex flex-col h-full">
                {/* Header */}
                <div className="mb-3 pl-2 border-l-2 border-[#33ABB9]/50">
                    {/* <span className="block text-[10px] font-mono text-[#33ABB9] mb-1 tracking-widest uppercase">
                        SYS.ID // 0{Math.floor(Math.random() * 99)}
                    </span> */}
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
                {showImage && (
                    <div className="relative w-full aspect-[4/5] mb-3 rounded-sm overflow-hidden border border-white/10 bg-black/50 group-hover:border-[#33ABB9]/30 transition-colors">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#33ABB9]/20 font-mono text-xs uppercase tracking-widest">
                                [ NO SIGNAL ]
                            </div>
                        )}

                        {/* Image Overlay Texture */}
                        <div className="absolute inset-0 bg-[url('/grid-pixel.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-black/80 to-transparent" />
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-[#33ABB9] mb-1">{prizeLabel}</span>
                        <span className="text-lg font-bold text-[#E8823A] font-mono">{prize}</span>
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

export default EventCard;
