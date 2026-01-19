"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";

const paragraphs = [
  {
    content:
      "The Cognitive Genesis marks the birth of a future where humans and artificial intelligence grow together as partners, blending human insight with machine precision.",
  },
  {
    content:
      "Rooted in India’s values and innovation, the theme envisions an indigenous, ethical intelligence shaped by purpose, responsibility, and self-reliance.",
  },
  {
    content:
      "It is not about machines replacing people, but about India redefining intelligence through collaboration, balance, and visionary progress.",
  },
];

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      // Evenly distribute 3 paragraphs across the full section
      // 0-0.33: paragraph 0, 0.33-0.66: paragraph 1, 0.66-1: paragraph 2
      let index = 0;
      if (progress > 0.66) {
        index = 2;
      } else if (progress > 0.33) {
        index = 1;
      }
      setActiveIndex(index);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative h-[250vh] bg-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Top dotted line with shine animation (mirrors countdown divider styling) */}
        <div className="relative z-10 pt-10 px-10">
          <div className="h-[0.3px] w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.9),rgba(255,255,255,0.9)_3px,transparent_0px,transparent_7px)] opacity-30"></div>
            <div className="absolute top-0 -left-40 w-32 h-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.7),white,rgba(255,255,255,0.7),transparent)] blur-sm animate-shine-horizontal"></div>
          </div>
        </div>

        {/* VIDEO BACKGROUND */}
        {/* Mobile: limit video to heading area */}
        <div className="absolute inset-0 z-0 overflow-hidden md:hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          >
            <source src="/videos/theme_video.mp4" type="video/mp4" />
          </video>
          {/* Gradient Mask for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/80 to-black pointer-events-none"></div>
        </div>
        {/* Desktop: keep full-section video */}
        <div className="absolute inset-0 z-0 top-70 overflow-hidden hidden md:block">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full sm:w-[90%] md:w-[70%] scale-180 md:scale-100 h-auto object-cover"
          >
            <source src="/videos/Home_theme.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col md:flex-row justify-between items-start pt-24 md:pt-32 px-6 md:px-16 pb-12 gap-10 md:gap-0">
          {/* Left Side: THE THEME Only */}
          <div>
            <h2
              className="text-white text-6xl md:text-8xl font-black tracking-tighter uppercase mb-2"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              THE THEME
            </h2>
            <div className="h-1 w-24 bg-cyan-400/50 rounded-full"></div>
          </div>

          {/* Right Side: Title + Content */}
          <div className="w-full md:w-[45%] ml-auto pr-0 md:pr-[5%] flex flex-col gap-6 text-left items-start">

            {/* Moved Title Block */}
            <div>
              <h1
                className="text-5xl md:text-6xl font-bold uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "#00FFFF",
                  textShadow: "0 0 20px rgba(0, 255, 255, 0.4)"
                }}
              >
                SYMBIONT
              </h1>
              <p
                className="text-xl md:text-2xl font-medium tracking-wider text-cyan-200 uppercase"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                THE COGNITIVE GENESIS
              </p>
            </div>

            {/* Paragraphs with Accent Border */}
            <div className="flex flex-col gap-8 w-full">
              {paragraphs.map((paragraph, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={
                    activeIndex === index
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0.3, x: 0 }
                  }
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="pl-6 border-l-2 border-[#00FFFF]"
                >
                  <p
                    className="text-[#E0E0E0] text-lg md:text-xl leading-[1.7] font-light"
                    style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  >
                    {paragraph.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
