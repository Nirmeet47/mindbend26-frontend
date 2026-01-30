"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Ticket, Award, Trophy, Phone, Mail, GraduationCap, Globe, Mic2, ShieldAlert, Newspaper, FileText } from "lucide-react";
import { TechDecorationBottomLeft, TechDecorationBottomRight, TechDecorationTopLeft, TechDecorationTopRight } from "@/components/ui/TechDecorations";
import Navbar from "@/components/layoutComp/Navbar";
import { IMAGES } from "@/constants/assets";

const InfoCard = ({ title, children, className = "", delay = 0, icon: Icon }: { title: string, children: React.ReactNode, className?: string, delay?: number, icon?: any }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`relative group w-full ${className}`}
        >
            {/* Background Shape - Glassmorphism */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(51,171,185,0.1)] transition-all duration-300 group-hover:bg-[#184344]/30 group-hover:border-[#33ABB9]/30"
                style={{
                    clipPath:
                        "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 32px) 100%, 0 100%, 0 20px)",
                }}
            />

            {/* Decorative Overlays */}
            <TechDecorationTopLeft />
            <TechDecorationTopRight />
            <TechDecorationBottomRight />
            <TechDecorationBottomLeft />

            <div className="absolute top-0 left-16 right-12 h-px bg-linear-to-r from-[#33ABB9]/0 via-[#33ABB9]/50 to-[#33ABB9]/0" />
            <div className="absolute bottom-0 left-12 right-32 h-px bg-linear-to-r from-[#33ABB9]/0 via-[#33ABB9]/50 to-[#33ABB9]/0" />

            {/* Internal Content */}
            <div className="relative z-10 p-8 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#33ABB9]/20">
                    {Icon && <Icon className="w-5 h-5 text-[#33ABB9]" />}
                    <h3 className="text-lg md:text-xl font-bold text-white tracking-wider group-hover:text-[#33ABB9] transition-colors uppercase font-['Orbitron']">
                        {title}
                    </h3>
                </div>
                <div className="text-gray-300 font-light leading-relaxed font-sans">
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
    >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 uppercase tracking-wider font-['Orbitron'] bg-clip-text bg-linear-to-b from-white to-gray-500">{title}</h2>
        {subtitle && <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-[#33ABB9]/50"></div>
            <p className="text-[#33ABB9] font-mono tracking-[0.2em] text-sm uppercase">{subtitle}</p>
            <div className="h-px w-12 bg-[#33ABB9]/50"></div>
        </div>}
    </motion.div>
);

// --- Data ---

const committees = [
    {
        name: "UNGA",
        fullName: "United Nations General Assembly",
        agenda: "Investigating and Ensuring Accountability for Violations of International Humanitarian Law Affecting Civilian Life and Property in the Occupied Palestinian Territory (OPT).",
        icon: Globe
    },
    {
        name: "AIPPM",
        fullName: "All India Political Parties Meet",
        agenda: "Ensuring Inclusivity and Transparency in the Electoral Roll Management System in India: Emphasizing on the role of ECI in voter addition and deletion process.",
        icon: Users
    },
    {
        name: "Lok Sabha",
        fullName: "Lower House of Protocol",
        agenda: "Evaluating the impact of the New Education Policy (NEP) 2020 with special emphasis on the “Collapse of the Indian Education System.",
        icon: Mic2
    },
    {
        name: "NATO",
        fullName: "North Atlantic Treaty Organization",
        agenda: "The Role of NATO in Space Security and Deterrence: Defining 'Attack' in the Orbital Domain and Establishing Rules of Engagement",
        icon: ShieldAlert
    },
    {
        name: "IP",
        fullName: "International Press",
        agenda: "Reporting on the proceedings of the committee sessions with journalistic integrity.",
        icon: Newspaper
    },
];

const prizes = [
    { title: "Best Delegate", reward: "₹4,000", type: "Cash" },
    { title: "High Commendation", reward: "₹2,500", type: "Cash" },
    { title: "Special Mention", reward: "Prize in kind", type: "Kind" },
    { title: "Honourable Mention", reward: "Prize in kind", type: "Kind" },
    { title: "Participation Certificate", reward: "Certificate", type: "Cert" },
];

declare global {
    interface Window {
        VANTA: any;
    }
}

function MBMUN() {
    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    const initVanta = () => {
        if (window.VANTA && window.VANTA.GLOBE && vantaRef.current && !vantaEffect) {
            setVantaEffect(
                window.VANTA.GLOBE({
                    el: vantaRef.current,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: 0x3b82f6,
                    backgroundColor: 0x000000,
                })
            );
        }
    };

    return (
        <>
            <Script
                src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"
                onLoad={() => {
                    // Three.js loaded
                }}
            />
            <Script
                src="https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.globe.min.js"
                onLoad={initVanta}
            />

            <Navbar />
            <div className="relative mt-12 lg:mt-16 min-h-screen w-full md:px-8 bg-black text-white selection:bg-[#33ABB9] selection:text-black font-sans">
                {/* Vanta Background Layer */}
                <div ref={vantaRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />

                {/* Content Layer */}
                <div className="relative z-10 w-full min-h-screen overflow-y-auto overflow-x-hidden pb-20">

                    {/* Hero Section */}
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative">
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>

                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative z-10"
                        >
                            {/* <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-linear-to-b from-white via-[#33ABB9] to-[#184344] font-['Orbitron'] drop-shadow-[0_0_35px_rgba(51,171,185,0.4)]">
                                MBMUN
                            </h1> */}
                        <div className="flex flex-col justify-center items-center w-full animate-fade-in gap-y-6">
                            <div className="flex flex-row gap-x-8 w-full justify-center items-center">

                            <Image src={IMAGES.mbmunLogoJpg} alt={"MBMUN"} width={160} height={160}/>
                            <h1
                                className="text-5xl sm:text-7xl md:text-8xl xl:text-10xl uppercase tracking-normal leading-[1.1] font-black mb-4"
                                style={{
                                    fontFamily: 'Barlow Condensed, sans-serif',
                                    color: '#e5e7eb', // off-white
                                    fontWeight: 900,
                                    textShadow: '0 2px 8px rgba(0,0,0,0.25)'
                                }}
                                >
                            MBMUN 2.0
                            </h1>
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="h-0.5 w-12 md:w-24 bg-[#33ABB9]"></div>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#33ABB9] font-mono tracking-[0.3em] uppercase">
                                    Mindbend Model UN 2026
                                </p>
                                <div className="h-0.5 w-12 md:w-24 bg-[#33ABB9]"></div>
                            </div>
                        </div>
                        </motion.div>

                        {/* Register Button */}
                        <motion.a
                            href="https://unstop.com/conferences/mindbend-model-united-nations-2026-mbmun-svnit-surat-1575461"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="group relative px-10 py-5 mb-16 bg-[#33ABB9]/10 backdrop-blur-md border border-[#33ABB9] text-[#33ABB9] font-bold uppercase tracking-widest overflow-hidden hover:bg-[#33ABB9] hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(51,171,185,0.2)] hover:shadow-[0_0_40px_rgba(51,171,185,0.6)]"
                            style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                        >
                            <span className="relative z-10 font-['Orbitron']">Register Now</span>
                        </motion.a>
                    </div>

                    <div className="container mx-auto px-4 space-y-24">

                        {/* Intro Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InfoCard title="Mission Details" delay={0.1} icon={FileText}>
                                <ul className="space-y-6">
                                    <li className="flex items-center group/item">
                                        <div className="p-2 bg-[#33ABB9]/10 rounded mr-4 border border-[#33ABB9]/20 group-hover/item:border-[#33ABB9] transition-colors">
                                            <Calendar className="w-5 h-5 text-[#33ABB9]" />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 font-mono uppercase tracking-wider">Dates</span>
                                            <span className="text-white font-semibold">17 - 18 Jan 2026</span>
                                        </div>
                                    </li>
                                    <li className="flex items-center group/item">
                                        <div className="p-2 bg-[#33ABB9]/10 rounded mr-4 border border-[#33ABB9]/20 group-hover/item:border-[#33ABB9] transition-colors">
                                            <MapPin className="w-5 h-5 text-[#33ABB9]" />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 font-mono uppercase tracking-wider">Coordinates</span>
                                            <span className="text-white font-semibold">SVNIT, Surat, Gujarat</span>
                                        </div>
                                    </li>
                                    <li className="flex items-center group/item">
                                        <div className="p-2 bg-[#33ABB9]/10 rounded mr-4 border border-[#33ABB9]/20 group-hover/item:border-[#33ABB9] transition-colors">
                                            <Users className="w-5 h-5 text-[#33ABB9]" />
                                        </div>
                                        <div>
                                            <span className="block text-xs text-gray-500 font-mono uppercase tracking-wider">Format</span>
                                            <span className="text-white font-semibold">Individual Participation</span>
                                        </div>
                                    </li>
                                </ul>
                            </InfoCard>

                            <InfoCard title="Delegate Stats" delay={0.2} icon={Users}>
                                <div className="flex flex-col h-full justify-center space-y-8 py-4">
                                    <div className="text-center relative">
                                        <div className="absolute inset-0 bg-[#33ABB9]/5 blur-3xl rounded-full"></div>
                                        <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Orbitron'] relative z-10">200+</span>
                                        <span className="text-xs text-[#33ABB9] font-mono uppercase tracking-[0.2em] border-t border-[#33ABB9]/30 pt-2 inline-block mt-2">Expected Units</span>
                                    </div>
                                    <div className="text-center relative">
                                        <div className="absolute inset-0 bg-[#33ABB9]/5 blur-3xl rounded-full"></div>
                                        <span className="block text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Orbitron'] relative z-10">5</span>
                                        <span className="text-xs text-[#33ABB9] font-mono uppercase tracking-[0.2em] border-t border-[#33ABB9]/30 pt-2 inline-block mt-2">Active Committees</span>
                                    </div>
                                </div>
                            </InfoCard>

                            <InfoCard title="Timeline" delay={0.3} icon={Calendar}>
                                <div className="relative pl-4 space-y-8 mt-2">
                                    <div className="absolute left-1.75 top-2 bottom-2 w-0.5 bg-linear-to-b from-[#33ABB9] to-transparent opacity-30"></div>

                                    <div className="relative pl-6">
                                        <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-[#33ABB9]/50"></div>
                                        <span className="block text-[#33ABB9] text-xs font-mono mb-1">05 JAN 2026</span>
                                        <span className="text-white font-bold block">Registration Deadline</span>
                                        <span className="text-xs text-gray-500">Secure your clearance</span>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-[#33ABB9]/50"></div>
                                        <span className="block text-[#33ABB9] text-xs font-mono mb-1">17 JAN 2026 // 09:30 IST</span>
                                        <span className="text-white font-bold block">Session Alpha</span>
                                        <span className="text-xs text-gray-500">Commencement</span>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute left-1 top-1.5 w-2 h-2 rounded-full bg-[#33ABB9]/50"></div>
                                        <span className="block text-[#33ABB9] text-xs font-mono mb-1">18 JAN 2026 // 18:30 IST</span>
                                        <span className="text-white font-bold block">Session Omega</span>
                                        <span className="text-xs text-gray-500">Conclusion</span>
                                    </div>
                                </div>
                            </InfoCard>
                        </div>

                        {/* About Section */}
                        <div className="max-w-4xl mx-auto">
                            <InfoCard title="Briefing" className="w-full" icon={Globe}>
                                <div className="space-y-6 text-base md:text-lg">
                                    <p>
                                        <strong className="text-[#33ABB9] font-['Orbitron']">Model United Nations (MUN)</strong> conferences are academic simulations where students assume the roles of delegates. Through diplomatic discourse, they deliberate on pressing real-world issues by adopting the policies of their designated nations.
                                    </p>
                                    <p>
                                        We are deploying the second edition of the <strong className="text-white">Mindbend Model United Nations</strong>. As the maiden chapter of Mindbend 2026, this operation aims to establish new protocols for intellectual rigor with five distinguished committees.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-[#33ABB9]/5 rounded-sm border border-[#33ABB9]/10">
                                        <div>
                                            <h4 className="flex items-center gap-2 text-[#33ABB9] font-bold text-sm uppercase mb-4 font-['Orbitron']">
                                                <Ticket className="w-4 h-4" /> Participation Inclusions
                                            </h4>
                                            <ul className="text-xs sm:text-sm space-y-2 text-gray-400 font-mono">
                                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#33ABB9]"></div> 2-Day Conference Access</li>
                                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#33ABB9]"></div> Delegate Kit & Rations</li>
                                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#33ABB9]"></div> Certification of Service</li>
                                                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-[#33ABB9]"></div> Strategic Training</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </InfoCard>
                        </div>

                        {/* Committees Section */}
                        <div className="relative">
                            <SectionHeader title="Committees" subtitle="Diplomatic Theaters" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {committees.map((committee, idx) => (
                                    <InfoCard key={idx} title={committee.name} delay={idx * 0.1} className="min-h-55" icon={committee.icon}>
                                        <h4 className="text-[#33ABB9] text-xs font-mono mb-3 uppercase tracking-wider">{committee.fullName}</h4>
                                        <p className="text-xs sm:text-sm border-t border-[#33ABB9]/20 pt-4 mt-2 leading-relaxed text-gray-400">
                                            {committee.agenda}
                                        </p>
                                    </InfoCard>
                                ))}
                            </div>
                        </div>

                        {/* Rewards Section */}
                        <div className="max-w-6xl mx-auto">
                            <SectionHeader title="Bounties" subtitle="Total Prize Pool: INR 13,500+" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                                {prizes.map((prize, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative group bg-[#0a0a0a]/40 backdrop-blur-md border border-[#33ABB9]/20 p-6 text-center hover:bg-[#33ABB9]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#33ABB9]/50"
                                    >
                                        <div className="absolute inset-0 bg-linear-to-b from-[#33ABB9]/0 to-[#33ABB9]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="text-3xl mb-4 text-[#33ABB9] flex justify-center">
                                            {prize.type === "Cash" ? <Trophy strokeWidth={1.5} /> : <Award strokeWidth={1.5} />}
                                        </div>
                                        <h3 className="text-white font-bold text-xs sm:text-sm mb-2 uppercase tracking-wider">{prize.title}</h3>
                                        <p className="text-[#33ABB9] font-['Orbitron'] text-base sm:text-lg font-bold">{prize.reward}</p>
                                        <span className="text-[10px] uppercase text-gray-500 block mt-3 font-mono border-t border-white/5 pt-3">
                                            + Certificate
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="max-w-2xl mx-auto text-center pb-20">
                            <SectionHeader title="Comms Channel" subtitle="Establish Contact" />
                            <InfoCard title="Lead Organiser" className="text-center" icon={Phone}>
                                <div className="flex flex-col items-center space-y-4 py-4">
                                    <div className="w-20 h-20 bg-[#33ABB9]/10 rounded-full flex items-center justify-center text-[#33ABB9] border border-[#33ABB9]/30 shadow-[0_0_15px_rgba(51,171,185,0.2)]">
                                        <Users className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-white font-['Orbitron']">Lakshit Vedant</h3>
                                        <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-widest mt-1">Secretary General</p>
                                    </div>
                                    <div className="flex flex-col gap-3 w-full max-w-xs pt-4 border-t border-white/10">
                                        <a href="mailto:u23ai015@coed.svnit.ac.in" className="flex items-center justify-center gap-3 text-gray-300 hover:text-[#33ABB9] transition-colors group">
                                            <Mail className="w-4 h-4 text-[#33ABB9] group-hover:animate-pulse" />
                                            <span className="font-mono text-xs sm:text-sm">u23ai015@coed.svnit.ac.in</span>
                                        </a>
                                        <a href="tel:+919898058074" className="flex items-center justify-center gap-3 text-gray-300 hover:text-[#33ABB9] transition-colors group">
                                            <Phone className="w-4 h-4 text-[#33ABB9] group-hover:animate-pulse" />
                                            <span className="font-mono text-sm sm:text-base">+91 98980 58074</span>
                                        </a>
                                    </div>
                                </div>
                            </InfoCard>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default MBMUN;
