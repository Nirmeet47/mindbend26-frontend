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
      className="relative min-h-screen bg-black overflow-hidden"
    >
      {/* Top dotted line with shine animation (mirrors countdown divider styling) */}
      <div className="relative z-10 pt-10 px-10">
        <div className="h-[0.3px] w-full relative overflow-hidden">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(to_right,rgba(255,255,255,0.9),rgba(255,255,255,0.9)_3px,transparent_0px,transparent_7px)] opacity-30"></div>
          <div className="absolute top-0 -left-40 w-32 h-full bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.7),white,rgba(255,255,255,0.7),transparent)] blur-sm animate-shine-horizontal"></div>
        </div>
      </div>

      {/* VIDEO BACKGROUND */}
      {/* Mobile: limit video to heading area */}
      <div className="absolute inset-x-0 top-30 z-0 h-[55vh] overflow-hidden md:hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/Home_theme.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
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

      {/* CONTENT CONTAINER */}
      <div className="relative z-20 md:h-screen flex flex-col justify-between px-4 sm:px-8 md:px-16 py-8 sm:py-10 md:py-0">
        {/* HEADING - TOP */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="shrink-0 px-6 sm:px-12 md:px-20 pt-6 sm:pt-10 md:pt-16 z-1"
        >
          <h2
            className="text-3xl sm:text-5xl md:text-7xl font-bold text-white uppercase tracking-wide"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            The Theme
          </h2>
          <div className="h-0.5 w-[30%] bg-linear-to-r from-cyan-500 to-transparent my-3 md:my-4 opacity-50"></div>

          <div
            className="pt-1 text-white max-w-md mt-auto"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-widest drop-shadow-[0_0_25px_rgba(0,242,255,0.8)]"
              style={{
                fontFamily: "Barlow Condensed, sans-serif",
                background: 'linear-gradient(135deg, #00f2ff 0%, #00d4ff 50%, #00b8ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              SYMBIONT
            </h2>
            <p className="text-base sm:text-xl md:text-2xl font-semibold tracking-wider text-cyan-300 mt-2 uppercase drop-shadow-[0_0_10px_rgba(0,242,255,0.4)]">
              The Cognitive Genesis
            </p>
          </div>
        </motion.div>

        {/* PARAGRAPHS - RIGHT SIDE WITH SCROLL-TRIGGERED CHANGES */}
        <div
          ref={contentRef}
          className="flex-1 flex items-center justify-center md:justify-end pr-0 md:pr-30 pt-4 sm:pt-6 min-h-[40vh]"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <div className="w-full md:w-[30vw] max-w-[90vw] sm:max-w-[70vw] md:max-w-[40vw] relative min-h-60 sm:min-h-80 md:min-h-96 px-2">
            {paragraphs.map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={
                  activeIndex === index
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: 30 }
                }
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <p className="text-white text-lg md:text-2xl leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {paragraph.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
