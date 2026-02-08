'use client'
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Brain, ChessRook, Eye, Link, Users, Shield, Globe, Lock, Layers, Zap, Radio, Server, Cpu } from 'lucide-react';

// --- DATA ---
const DATA = [
  { year: "1956", title: "Dartmouth Conference", desc: "AI field founded; machines targeted for language, abstraction, and self-improvement as human collaborators.", icon: Brain },
  { year: "1997", title: "Deep Blue Victory", desc: "IBM's Deep Blue defeats Kasparov with 200M positions/sec, blending AI tactics with human strategy.", icon: ChessRook },
  { year: "2012", title: "AlexNet Revolution", desc: "AlexNet wins ImageNet via CNNs and GPUs, igniting deep learning for visual human augmentation.", icon: Eye },
  { year: "2017", title: "Transformer Debut", desc: "Google's self-attention Transformers enable scalable NLP for natural human-AI conversations.", icon: Link },
  { year: "2026", title: "Agentic Symbiosis", desc: "Agentic AI hits enterprise inflection with 50/50 human-AI teams realizing cognitive genesis.", icon: Users }
];

const ANGLE_STEP = 23; 
const RADIUS_YEAR = 380; 
const RADIUS_DOT = 450; 
const RADIUS_CONTENT = 650; 
const CYAN_300 = "#67e8f9"; 

// --- SCRAMBLE COMPONENT ---
const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleText = ({ text, isActive, className, speed = 30 }: { text: string; isActive: boolean; className?: string; speed?: number }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
        setDisplayText(text);
        return;
    }
    let iteration = 0;
    clearInterval(intervalRef.current!);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter: string, index: number) => {
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(intervalRef.current!);
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(intervalRef.current!);
  }, [isActive, text, speed]);

  return <span className={className}>{displayText}</span>;
};

// --- GLITCH ICON COMPONENT (INTENSIFIED) ---
const GlitchIcon = ({ Icon }: { Icon: any }) => {
  return (
    <div className="relative flex items-center justify-center">
      {/* 1. Red Ghost Layer (More aggressive offset & frequency) */}
      <motion.div
        className="absolute text-red-500/80 mix-blend-screen"
        initial={{ x: 0, opacity: 0 }}
        animate={{ 
          x: [-8, 8, -4, 4, 0], 
          y: [4, -4, 2, -2, 0], 
          opacity: [0, 0.9, 0, 0.5, 0] 
        }}
        transition={{ 
          duration: 0.15, 
          repeat: Infinity, 
          repeatDelay: Math.random() * 1.5 + 0.5 // Glitches more often
        }}
      >
        <Icon size={120} strokeWidth={1} />
      </motion.div>

      {/* 2. Blue Ghost Layer */}
      <motion.div
        className="absolute text-blue-500/80 mix-blend-screen"
        initial={{ x: 0, opacity: 0 }}
        animate={{ 
          x: [8, -8, 4, -4, 0], 
          y: [-4, 4, -2, 2, 0],
          opacity: [0, 0.9, 0, 0.5, 0] 
        }}
        transition={{ 
          duration: 0.2, 
          repeat: Infinity, 
          repeatDelay: Math.random() * 1.5 + 0.5 
        }}
      >
        <Icon size={120} strokeWidth={1} />
      </motion.div>

      {/* 3. Main Cyan Icon (Stable but glowing) */}
      <motion.div
        className="relative z-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.8)]"
        initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        exit={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
        transition={{ duration: 0.4, ease: "backOut" }}
      >
        <Icon size={120} strokeWidth={0.8} />
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function ScrollTimeline() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  const totalRotation = -(DATA.length - 1) * ANGLE_STEP;
  const rotation = useTransform(smoothProgress, [0, 1], [0, totalRotation]);

  useEffect(() => {
    const unsubscribe = rotation.on("change", (latest) => {
      const index = Math.round(Math.abs(latest / ANGLE_STEP));
      setActiveIndex((prev) => (prev !== index ? index : prev));
    });
    return () => unsubscribe();
  }, [rotation]);

  const ActiveIcon = DATA[activeIndex].icon;

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-black">
      
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center text-white font-sans">

        {/* --- ROTATING CONTAINER --- */}
        <motion.div 
          className="absolute left-[-200px] top-1/2 w-0 h-0"
          style={{ rotate: rotation }}
        >
          {/* Background Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 w-[1400px] h-[1400px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 w-[900px] h-[900px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 w-[760px] h-[760px]" />

          {DATA.map((item, index) => {
            const isActive = index === activeIndex;
            
            return (
              <div 
                key={index}
                className="absolute top-0 left-0 h-[2px] w-[1000px] origin-left flex items-center"
                style={{ 
                  transform: `rotate(${index * ANGLE_STEP}deg)`,
                }}
              >
                
                {/* 1. Year */}
                <div 
                  className="absolute text-right font-bold text-3xl transition-all duration-500 w-[100px]"
                  style={{ 
                    left: `${RADIUS_YEAR}px`, 
                    opacity: isActive ? 1 : 0.15,
                    color: isActive ? '#fff' : '#666',
                    textShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                  }}
                >
                  {item.year}
                </div>

                {/* 2. Dot */}
                <div 
                  className={`absolute w-2 h-2 rounded-full transition-all duration-500`}
                  style={{ 
                    left: `${RADIUS_DOT + 42}px`, 
                    backgroundColor: isActive ? CYAN_300 : '#fff',
                    opacity: isActive ? 1 : 0.3,
                    transform: isActive ? 'scale(1.5)' : 'scale(1)',
                    boxShadow: isActive ? `0 0 15px ${CYAN_300}` : 'none'
                  }} 
                />

                {/* 3. Content Area */}
                <div 
                  className="absolute text-left w-[500px] origin-left transition-all duration-500"
                  style={{ 
                    left: `${RADIUS_CONTENT - 42}px`,
                    opacity: isActive ? 1 : 0.05,
                  }}
                >
                   <h3 className="text-sm uppercase tracking-widest text-cyan-300/70 mb-1 font-semibold h-[20px]">
                      {isActive && "Milestone"} 
                   </h3>
                   
                   <h2 className="text-4xl font-medium mb-3 leading-tight min-h-[48px]">
                      <ScrambleText 
                        text={item.title} 
                        isActive={isActive} 
                        className="block" 
                      />
                   </h2>
                   
                   <p className="text-lg text-gray-400 leading-relaxed max-w-md">
                      {item.desc}
                   </p>
                </div>

              </div>
            );
          })}
        </motion.div>

        {/* --- STATIC CENTER LINE --- */}
        <div className="absolute left-[200px] top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          <div className="relative">
              {/* Line */}
              <div className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-cyan-300 absolute left-[260px] opacity-50" />
              {/* Square Indicator */}
              <div className="w-4 h-4 bg-cyan-300 absolute left-[380px] -top-2 shadow-[0_0_20px_rgba(103,232,249,0.8)]" />
          </div>
        </div>

        {/* --- DYNAMIC ICON (Right Side - Sleek & Glitched) --- */}
        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 z-40 pointer-events-none">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeIndex}
               className="relative"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
             >
                <GlitchIcon Icon={ActiveIcon} />
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="absolute bottom-10 left-10 text-white/30 animate-pulse text-sm tracking-widest uppercase">
           Scroll to explore ↓
        </div>

      </div>
    </div>
  );
}