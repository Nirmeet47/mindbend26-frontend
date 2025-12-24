"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import Link from "next/link";

// Expanded character set including alphabets
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#________";

const ScrambleText = ({ text, className = "", triggerOnMount = true }: { text: string; className?: string, triggerOnMount?: boolean }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    let iteration = 0;
    const stepIncrement = text.length / 25; 

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );

      if (iteration >= text.length) clearInterval(intervalRef.current!);
      iteration += stepIncrement;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (triggerOnMount) scramble();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [triggerOnMount, scramble]);

  return (
    <span onMouseEnter={scramble} className={className}>
      {displayText}
    </span>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuData = [
    {
      title: "About",
      isHyperlink: false,
      items: [
        { label: "HISTORY", id: "1.1", href: "/history" },
        { label: "THEME", id: "1.2", href: "/theme" },
        { label: "COMMITTEE", id: "1.3", href: "/committee" },
        { label: "MEDIA", id: "1.4", href: "/media" },
        { label: "TESTIMONIALS", id: "1.5", href: "/testimonials" },
      ],
    },
    {
      title: "Events",
      isHyperlink: false,
      items: [
        { label: "TECHNICAL", id: "2.1", href: "/technical" },
        { label: "MANAGERIAL", id: "2.2", href: "/managerial" },
        { label: "WORKSHOPS", id: "2.3", href: "/workshops" },
        { label: "GUEST LECTURES", id: "2.4", href: "/guest-lectures" },
        { label: "HACKATHON", id: "2.5", href: "/hackathon" },
        { label: "MUN", id: "2.6", href: "/mun" },
        { label: "ESPORTS", id: "2.7", href: "/esports" },
        { label: "CONFERENCE", id: "2.8", href: "/conference" },
      ],
    },
    { title: "Sponsors", isHyperlink: true, href: "/sponsors", items: [] },
    { title: "Accommodation", isHyperlink: true, href: "/accommodation", items: [] },
    { title: "Campus Ambassador", isHyperlink: true, href: "/ambassador", items: [] },
  ];

  return (
    <>
      {/* 1. Main Navbar */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-10 py-6 flex justify-between items-center mix-blend-difference text-white" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
        <Link href="/" className="text-3xl font-black tracking-wider hover:scale-110 transition-transform duration-300">
          MINDBEND
        </Link>
        <div className="flex items-center gap-10">
          <Link 
            href="/login" 
            className="hidden md:flex items-center gap-2 text-[15px] font-bold tracking-[0.2em] hover:scale-110 hover:text-zinc-400 transition-all duration-300"
          >
            LOGIN 
          </Link>
          <Link 
            href="/user/dashboard" 
            className="hidden md:flex items-center gap-2 text-[15px] font-bold tracking-[0.2em] hover:scale-110 hover:text-zinc-400 transition-all duration-300"
          >
            PROFILE
          </Link>
          <button 
            onClick={() => setIsOpen(true)} 
            className="text-[15px] font-bold tracking-[0.2em] uppercase hover:scale-110 hover:text-zinc-400 transition-all duration-300 cursor-pointer"
          >
            MENU [+]
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* 2. Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110]"
            />

            {/* 3. Half-Screen Menu */}
            <motion.div
              initial={{ scale: 0, opacity: 0, x: "20%", y: "-20%", borderRadius: "100px" }}
              animate={{ scale: 1, opacity: 1, x: 0, y: 0, borderRadius: "0px" }}
              exit={{ scale: 0, opacity: 0, x: "20%", y: "-20%", borderRadius: "100px" }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{ originX: 1, originY: 0 }} 
              className="fixed top-0 right-0 h-screen w-full md:w-1/2 bg-[#050505] z-[120] border-l border-white/5 flex flex-col text-white shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 md:p-12 flex justify-between items-center border-b border-white/5">
                <ScrambleText text="©MINDBEND_2025" className="text-xs font-mono text-zinc-600" />
                <button onClick={() => setIsOpen(false)} className="text-xs font-mono tracking-widest hover:text-red-500 transition-colors uppercase">
                  <ScrambleText text="CLOSE [X]" />
                </button>
              </div>

              {/* Menu Content - Hidden Scrollbar applied here */}
              <div className="flex-1 overflow-y-auto p-8 md:px-16 md:py-12 space-y-10 no-scrollbar">
                {menuData.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    
                    {/* Main Categories */}
                    {section.isHyperlink ? (
                      <Link 
                        href={section.href || "#"}
                        className="group flex w-full items-center px-4 py-3 transition-all duration-300 hover:bg-white hover:translate-x-6"
                      >
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight group-hover:text-black uppercase tracking-wide" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                          <ScrambleText text={section.title} />
                        </h2>
                      </Link>
                    ) : (
                      <div className="group flex w-full items-center px-4 py-3 transition-all duration-300 hover:bg-white hover:translate-x-6 cursor-default">
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight group-hover:text-black uppercase tracking-wide" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                          <ScrambleText text={section.title} />
                        </h2>
                      </div>
                    )}

                    {/* Sub-Items */}
                    {section.items.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 pl-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {section.items.map((sub, sIdx) => (
                          <Link 
                            key={sIdx} 
                            href={sub.href} 
                            className="group relative flex items-center gap-4 py-2 px-4 transition-all duration-300 hover:bg-white hover:translate-x-4"
                          >
                            <span className="font-mono text-[10px] text-zinc-600 group-hover:text-black">
                              {sub.id}
                            </span>
                            <span className="font-mono text-[10px] tracking-[0.2em] group-hover:text-black uppercase block">
                              <ScrambleText text={sub.label} />
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </>
  );
}