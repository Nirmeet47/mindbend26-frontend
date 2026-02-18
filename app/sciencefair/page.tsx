'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Navbar from '@/components/layoutComp/Navbar';
import EventsHeader from '@/components/events/EventsHeader';
import {
    TechDecorationBottomLeft,
    TechDecorationBottomRight,
    TechDecorationTopLeft,
    TechDecorationTopRight,
} from '@/components/ui/TechDecorations';

// Lazy load the background scene
const BackgroundScene = dynamic(() => import('@/components/events/BackgroundScene'), {
    ssr: false,
});

export default function ScienceFairPage() {
    const router = useRouter();

    return (
        <>
            <Navbar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-[#00F0FF] selection:text-black font-rajdhani tracking-wide relative"
            >
                {/* Background 3D Scene */}
                <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
                    <BackgroundScene />
                </div>

                {/* Cyberpunk Grid Overlay */}
                <div
                    className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)',
                    }}
                />

                <div className="relative z-10">
                    {/* ── Header ────────────────────────────────────────────── */}
                    <section className="max-w-7xl mx-auto px-4 pt-16 pb-4">
                        <EventsHeader
                            eventName="Science Fair"
                            eventType="Exhibition"
                            eventStatus="OPEN"
                            breadcrumbType="TECHNICAL"
                        />
                    </section>

                    {/* ── Poster Card ─────────────────────────────────────────── */}
                    <section className="max-w-7xl mx-auto px-4 pb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group max-w-sm mx-auto"
                        >
                            {/* Card background with clip-path */}
                            <div
                                className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-0 border-white/5 shadow-xl transition-all duration-300 group-hover:bg-[#184344]/40"
                                style={{
                                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)',
                                }}
                            />

                            {/* Tech corner decorations */}
                            <TechDecorationTopLeft />
                            <TechDecorationTopRight />
                            <TechDecorationBottomRight />
                            <TechDecorationBottomLeft />

                            {/* Border lines */}
                            <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-gradient-to-r from-[#00F0FF]/50 to-[#00F0FF]/20" />
                            <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-gradient-to-b from-[#00F0FF]/20 to-[#00F0FF]/50" />
                            <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-gradient-to-r from-[#00F0FF]/50 to-[#00F0FF]/20" />
                            <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-[#00F0FF]/20 to-[#00F0FF]/50" />

                            {/* Card content */}
                            <div className="relative z-10 p-4 flex flex-col h-full">
                                {/* Header label */}
                                <div className="mb-3 pl-2 border-l-2 border-[#00F0FF]/50">
                                    <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-[#00F0FF] transition-colors uppercase font-orbitron">
                                        Science Exhibition
                                    </h3>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <div className="h-1 w-1 bg-[#00F0FF] rounded-full animate-pulse" />
                                        <span className="text-xs font-semibold text-[#00F0FF]/80 bg-[#184344]/30 px-2 py-0.5 rounded border border-[#00F0FF]/30">
                                            Mindbend 2026
                                        </span>
                                    </div>
                                </div>

                                {/* Poster Image */}
                                <div className="relative w-full aspect-[4/5] mb-3 rounded-sm overflow-hidden border border-white/10 bg-black/50 group-hover:border-[#00F0FF]/30 transition-colors">
                                    <Image
                                        src="/images/science_exhb.png"
                                        alt="Science Fair – Mindbend 2026"
                                        fill
                                        className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                    {/* Image overlay texture */}
                                    <div className="absolute inset-0 bg-[url('/grid-pixel.png')] opacity-20 pointer-events-none mix-blend-overlay" />
                                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                                </div>

                                {/* Footer */}
                                <div className="flex items-end justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] uppercase tracking-widest text-[#00F0FF] mb-1">Category</span>
                                        <span className="text-lg font-bold text-[#E8823A] font-mono">Innovation</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#00F0FF] animate-pulse" />
                                        <span className="text-[10px] font-mono text-[#00F0FF]/60 uppercase tracking-wider">Live</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* ── About Section ───────────────────────────────────────── */}
                    <section className="max-w-7xl mx-auto px-4 pb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="space-y-8"
                        >
                            {/* Description */}
                            <div className="space-y-4">
                                <p className="text-xl md:text-2xl font-rajdhani font-medium leading-relaxed text-gray-300 tracking-wide">
                                    Science Fair is where curiosity turns into creation.
                                </p>
                                <p className="text-xl md:text-2xl font-rajdhani font-medium leading-relaxed text-gray-300 tracking-wide">
                                    It&apos;s a space filled with ideas, experiments, and innovation — where students transform their concepts into creative projects and working models.
                                </p>
                                <p className="text-xl md:text-2xl font-rajdhani font-medium leading-relaxed text-gray-300 tracking-wide">
                                    Whether you enjoy building, exploring, or discovering something new, this is your opportunity to be a part of it.
                                </p>
                                <p className="text-lg font-rajdhani text-gray-400 leading-relaxed">
                                    Come showcase your ideas, share your creativity, and experience the excitement of real innovation.
                                </p>
                            </div>

                            {/* Highlights — code-block style */}
                            <div className="bg-white/5 border border-white/10 overflow-hidden">
                                {/* Terminal header bar */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border-b border-white/10">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                    <span className="ml-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">highlights.sh</span>
                                </div>
                                <div className="p-6 space-y-3">
                                    {[
                                        { icon: '🔬', label: 'Creative Projects & Working Models' },
                                        { icon: '💡', label: 'Innovation Showcase' },
                                        { icon: '🚀', label: 'Real-world Experiments' },
                                        { icon: '🏆', label: 'Mindbend 2026 Platform' },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + i * 0.07 }}
                                            className="flex items-center gap-3 group"
                                        >
                                            <span className="text-[#00F0FF]/50 font-mono text-sm select-none">$</span>
                                            <span className="text-sm font-mono text-[#00F0FF]/40 select-none">echo</span>
                                            <span className="text-base font-rajdhani text-gray-300 group-hover:text-white transition-colors">
                                                {item.icon} {item.label}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* ── Register CTA ─────────────────────────────────────────── */}
                    <section className="max-w-7xl mx-auto px-4 pb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex justify-center"
                        >
                            <button
                                onClick={() => router.push('/register')}
                                className="group/btn relative px-10 py-4 bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/60 hover:border-[#00F0FF] text-[#00F0FF] font-bold tracking-wider uppercase transition-all overflow-hidden flex items-center gap-3 text-lg font-orbitron"
                            >
                                <span className="relative z-10">Register Now</span>
                                <div className="absolute inset-0 bg-[#00F0FF]/20 transform -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-full transition-transform duration-500" />
                            </button>
                        </motion.div>
                    </section>
                </div>
            </motion.div>
        </>
    );
}
