"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll } from "framer-motion";


const paragraphs = [
  {
    content: "The Cognitive Genesis marks the birth of a future where humans and artificial intelligence grow together as partners, blending human insight with machine precision.",
  },
  {
    content: "Rooted in India’s values and innovation, the theme envisions an indigenous, ethical intelligence shaped by purpose, responsibility, and self-reliance.",
  },
  {
    content: "It is not about machines replacing people, but about India redefining intelligence through collaboration, balance, and visionary progress.",
  },
];

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((progress) => {
      // Calculate which paragraph to show based on scroll progress
      // 0 to 1 maps to 3 paragraphs
      const index = Math.min(Math.floor(progress * 3), 2);
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
      <div className="absolute inset-0 z-0 top-70 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-[70%] h-auto object-cover "
        >
          <source src="/videos/Home_theme.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="relative z-20 h-screen flex flex-col justify-between px-8 md:px-16">
        {/* HEADING - TOP */}
              <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 px-20 pt-12 md:pt-16 z-1"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tight">
            The Theme
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mt-4"></div>
          <div className="pt-1 text-white max-w-md mt-auto">
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            SYMBIONT
          </h2>
          <p className="text-xl font-medium tracking-widest text-blue-200 mt-1 uppercase">
            The Cognitive Genesis
          </p>
          
        </div>
        </motion.div>

        {/* PARAGRAPHS - RIGHT SIDE WITH SCROLL-TRIGGERED CHANGES */}
        <div
          ref={contentRef}
          className="flex-1 flex items-start justify-end pr-0 md:pr-30 pt-6"
        >
          <div className="w-full md:w-[30vw] max-w-[40vw] relative min-h-96">
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
                <p className="text-gray-200 text-base md:text-lg leading-relaxed font-light">
                  {paragraph.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      <div className="relative flex flex-col items-center justify-center mx-auto pt-20">
        <div className="divider ">
          <div className="shine" />

          <style jsx>{`
            .divider {
              position: relative;
              width: 0.5px;
              height: 250px;
              background: repeating-linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.25),
                rgba(255, 255, 255, 0.25) 1px,
                transparent 2px,
                transparent 6px
              );
              overflow: hidden;
            }

            .shine {
              position: absolute;
              top: -60%;
              left: -6px;
              width: 18px;
              height: 250px;
              background: linear-gradient(
                to bottom,
                transparent,
                rgba(255, 255, 255, 0.8),
                white,
                rgba(255, 255, 255, 0.8),
                transparent
              );
              filter: blur(4px);
              animation: shineMove 2s linear infinite;
            }

            @keyframes shineMove {
              from {
                top: -150px;
              }
              to {
                top: 300px;
              }
            }
          `}</style>
        </div>
        <div className="py-3 text-center tracking-wide">
          <h1 className="text-4xl">
            Artificial Intelligence
            <br />
            With Human Values
          </h1>
          <p className="text-md opacity-60 leading-relaxed italic justify-center">
            Forging the Future of Indian Intelligence
          </p>
        </div>
          <div className="divider ">
          <div className="shine" />

          <style jsx>{`
            .divider {
              position: relative;
              width: 0.5px;
              height: 250px;
              background: repeating-linear-gradient(
                to bottom,
                rgba(255, 255, 255, 0.25),
                rgba(255, 255, 255, 0.25) 1px,
                transparent 2px,
                transparent 6px
              );
              overflow: hidden;
            }

            .shine {
              position: absolute;
              top: -60%;
              left: -6px;
              width: 18px;
              height: 250px;
              background: linear-gradient(
                to bottom,
                transparent,
                rgba(255, 255, 255, 0.8),
                white,
                rgba(255, 255, 255, 0.8),
                transparent
              );
              filter: blur(4px);
              animation: shineMove 2s linear infinite;
            }

            @keyframes shineMove {
              from {
                top: -150px;
              }
              to {
                top: 300px;
              }
            }
          `}</style>
        </div>
      </div>    
      
    </section>
  );
}
