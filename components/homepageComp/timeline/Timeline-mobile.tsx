'use client'
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Brain, ChessRook, Eye, Link, Users } from 'lucide-react';

// --- DATA ---
const DATA = [
  { year: "1956", title: "Dartmouth Conference", desc: "AI field founded; machines targeted for language, abstraction, and self-improvement as human collaborators.", icon: Brain },
  { year: "1997", title: "Deep Blue Victory", desc: "IBM's Deep Blue defeats Kasparov with 200M positions/sec, blending AI tactics with human strategy.", icon: ChessRook },
  { year: "2012", title: "AlexNet Revolution", desc: "AlexNet wins ImageNet via CNNs and GPUs, igniting deep learning for visual human augmentation.", icon: Eye },
  { year: "2017", title: "Transformer Debut", desc: "Google's self-attention Transformers enable scalable NLP for natural human-AI conversations.", icon: Link },
  { year: "2026", title: "Agentic Symbiosis", desc: "Agentic AI hits enterprise inflection with 50/50 human-AI teams realizing cognitive genesis.", icon: Users }
];

// --- CONSTANTS ---
const ANGLE_STEP = 20; 
const RADIUS_YEAR = 275; 
const RADIUS_DOT = 360;  

// --- SCRAMBLE COMPONENT ---
const CHARS = "-_~`!@#$%^&*()+=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const ScrambleText = ({ text, isActive, className, speed = 30 }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isActive) {
        setDisplayText(text);
        return;
    }
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );
      if (iteration >= text.length) clearInterval(intervalRef.current);
      iteration += 1 / 2;
    }, speed);

    return () => clearInterval(intervalRef.current);
  }, [isActive, text, speed]);

  return <span className={className}>{displayText}</span>;
};

// --- GLITCH ICON COMPONENT ---
const GlitchIcon = ({ Icon }) => {
  return (
    <div className="relative flex items-center justify-center w-16 h-16">
      {/* 1. Main Icon (Cyan) - Stable but glowing */}
      <div className="relative z-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.6)]">
        <Icon size={48} strokeWidth={1.2} />
      </div>

      {/* 2. Red Shift Layer - Low probability glitch */}
      <motion.div
        className="absolute top-0 left-0 text-red-500 opacity-60 mix-blend-screen z-0"
        animate={{ 
          x: [0, 2, -2, 0], 
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 0.2, 
          repeat: Infinity, 
          repeatDelay: Math.random() * 4 + 2,
          times: [0, 0.2, 0.4, 1] 
        }}
      >
        <Icon size={48} strokeWidth={1.2} />
      </motion.div>

      {/* 3. Blue Shift Layer - Different timing */}
      <motion.div
        className="absolute top-0 left-0 text-blue-500 opacity-60 mix-blend-screen z-0"
        animate={{ 
          x: [0, -2, 2, 0], 
          y: [0, 1, -1, 0],
          opacity: [0, 0.8, 0] 
        }}
        transition={{ 
          duration: 0.25, 
          repeat: Infinity, 
          repeatDelay: Math.random() * 5 + 3, 
          times: [0, 0.2, 0.4, 1] 
        }}
      >
        <Icon size={48} strokeWidth={1.2} />
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function MobileScrollTimeline() {
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

  const totalRotation = (DATA.length - 1) * ANGLE_STEP;
  const rotation = useTransform(smoothProgress, [0, 1], [90, 90 - totalRotation]);

  useEffect(() => {
    const unsubscribe = rotation.on("change", (latest) => {
      const diff = 90 - latest;
      const index = Math.round(Math.abs(diff / ANGLE_STEP));
      setActiveIndex((prev) => (prev !== index ? index : prev));
    });
    return () => unsubscribe();
  }, [rotation]);

  const activeItem = DATA[activeIndex] || DATA[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-black">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between text-white font-sans">
        
        {/* --- 1. ROTATING WHEEL SECTION --- */}
        <div className="relative h-[52%] w-full bg-gradient-to-b from-transparent to-[#050505]/20 z-0">
            
            {/* Wheel Anchor */}
            <motion.div 
              className="absolute left-1/2 top-[-160px] w-0 h-0"
              style={{ rotate: rotation }}
            >
              {/* Concentric Circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 w-[620px] h-[620px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 w-[520px] h-[520px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 w-[840px] h-[840px]" />

              {DATA.map((item, index) => {
                const isActive = index === activeIndex;
                
                return (
                  <div 
                    key={index}
                    className="absolute top-0 left-0 h-[2px] w-[500px] origin-left flex items-center"
                    style={{ 
                      transform: `rotate(${index * ANGLE_STEP}deg)`,
                    }}
                  >
                    {/* Year Text */}
                    <div 
                      className="absolute font-bold text-2xl transition-all duration-500 flex justify-end items-center"
                      style={{ 
                        left: `${RADIUS_YEAR}px`, 
                        opacity: isActive ? 1 : 0.3,
                        color: isActive ? '#fff' : '#444',
                        textShadow: isActive ? "0 0 20px rgba(103,232,249,0.5)" : "none",
                        transform: `rotate(0deg)` 
                      }}
                    >
                      {item.year}
                    </div>

                    {/* Passive Dot */}
                    <div 
                      className={`absolute w-1.5 h-1.5 bg-white rounded-full transition-all duration-500`}
                      style={{ 
                        left: `${RADIUS_DOT}px`, 
                        opacity: isActive ? 0 : 0.2, 
                      }} 
                    />
                  </div>
                );
              })}
            </motion.div>

            {/* Static Marker Elements (Fixed Alignment) */}
            <div className="absolute left-1/2 top-[-160px] w-0 h-0 flex items-center justify-center pointer-events-none z-20">
                 {/* The Vertical Line */}
                 <div 
                    className="absolute bg-cyan-300/30 w-[1px]" 
                    style={{ 
                        left: '50%', // Explicit horizontal centering
                        transform: 'translateX(-50%)', 
                        top: `${RADIUS_YEAR + 30}px`, 
                        height: '40px' 
                    }} 
                 />
                 
                 {/* The Diamond Pointer */}
                 <div 
                    className="absolute w-2 h-2 bg-cyan-300 shadow-[0_0_15px_#67e8f9]" 
                    style={{ 
                        left: '50%', // Explicit horizontal centering 
                        top: `${RADIUS_DOT}px`, 
                        transform: 'translateX(-50%) rotate(45deg)' 
                    }} 
                 />
            </div>
        </div>


        {/* --- 2. BOTTOM CONTENT SECTION --- */}
        <div className="relative flex-1 flex flex-col justify-start pt-4 pb-12 px-8 z-10">
           
           {/* Background Decoration Icon */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-[0.02] pointer-events-none text-cyan-300">
                 <ActiveIcon size={300} strokeWidth={1} />
            </div>

            <div className="flex flex-col items-center text-center">
                
                {/* ICON DISPLAY */}
                <div className="mb-6 h-20 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                      <motion.div 
                          key={`icon-${activeIndex}`}
                          initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                          exit={{ scale: 1.2, opacity: 0, filter: "blur(10px)" }}
                          transition={{ duration: 0.4 }}
                      >
                         <GlitchIcon Icon={ActiveIcon} />
                      </motion.div>
                  </AnimatePresence>
                </div>

                {/* TEXT CONTENT */}
                <div className="w-full">
                    <h3 className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/70 mb-3 font-bold">
                          Milestone
                    </h3>
                    
                    <h2 className="text-3xl font-medium mb-4 leading-tight min-h-[72px] flex items-center justify-center text-white">
                        <ScrambleText 
                            text={activeItem.title} 
                            isActive={true} 
                            key={activeIndex} 
                        />
                    </h2>
                    
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={activeIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-base text-gray-400 leading-relaxed max-w-xs mx-auto"
                        >
                            {activeItem.desc}
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}