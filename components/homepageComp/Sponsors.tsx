"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const sponsors = [
  "Stripe",
  "Shield AI",
  "PsiQuantum",
  "ByteDance",
  "OpenAI",
  "Microsoft",
  "Google",
  "Amazon",
  "Meta",
  "Tesla",
  "SpaceX",
  "Apple",
];

export default function Sponsors() {
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);
  const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full py-20 bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-extrabold text-white text-center mb-4">
          Our Sponsors
        </h2>
        <p className="text-cyan-200/70 text-center max-w-2xl mx-auto">
          Powered by industry leaders who believe in innovation
        </p>
      </motion.div>

      {/* Single scrolling row */}
      <div className="relative">
        <div
          className="flex gap-6 animate-scroll"
          style={{
            animationDirection:
              scrollDirection === "down" ? "normal" : "reverse",
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <SponsorBox key={index} name={sponsor} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

function SponsorBox({ name }: { name: string }) {
  return (
    <div
      className="relative flex-shrink-0 w-64 h-32 bg-black border-2 border-gray-500/40
                 flex items-center justify-center overflow-hidden
                 shadow-[0_0_20px_rgba(156,163,175,0.15)]"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-black to-gray-800/30 opacity-70" />

      {/* Sponsor name */}
      <h3
        className="relative z-10 text-xl font-bold text-white uppercase tracking-wider"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {name}
      </h3>

      {/* Scanline effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(156,163,175,0.1) 2px, rgba(156,163,175,0.1) 4px)",
        }}
      />
    </div>
  );
}
