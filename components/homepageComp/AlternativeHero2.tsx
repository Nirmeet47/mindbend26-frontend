"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const AlternativeHero2 = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vw, setVw] = useState(1200); // fallback to avoid zero on first render

  // Capture viewport width safely
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Clamp scroll so animation locks
  const progress = useTransform(scrollYProgress, (v) => Math.min(v / 1.7, 1));

  /* ==============================
      LOGO MOTION
    ============================== */

  const END_SCALE = 0.16; // keep final logo size consistent across breakpoints

  // Responsive target positions for logo lock point (size stays constant)
  const target = useMemo(() => {
    if (vw < 640) {
      return { x: -vw / 2 + 70, y: -140 };
    }
    if (vw < 1024) {
      return { x: -vw / 2 + 90, y: -170 };
    }
    return { x: -vw / 2 + 100, y: -205 };
  }, [vw]);

  // Move from center → top-left navbar
  const x = useTransform(progress, [0, 0.3], [0, target.x]);
  const y = useTransform(progress, [0, 0.3], [0, target.y]);

  // Keep final scale consistent across breakpoints
  const scaleX = useTransform(progress, [0, 0.3], [1.25, END_SCALE]);
  const scaleY = useTransform(progress, [0, 0.3], [1, END_SCALE]);

  // Enable link only after logo finishes moving
  const [linkEnabled, setLinkEnabled] = useState(false);
  useMotionValueEvent(progress, "change", (v) => {
    setLinkEnabled(v >= 0.3);
  });

  return (
    <div
      ref={containerRef}
      className="relative h-[100vh] bg-transparent text-white"
    >
      {/* HERO SECTION */}
      <section className="relative h-[65vh] sm:h-screen overflow-hidden">
        {/* BACKGROUND VIDEO (NOT STICKY, ZOOMED-OUT) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-95 sm:scale-80 md:scale-65 lg:scale-50 translate-y-2 sm:translate-y-4 md:translate-y-8"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* SINGLE LOGO (ANIMATES → STICKS IN NAV) */}
        <motion.div
          style={{
            scaleX,
            scaleY,
            x,
            y,
            pointerEvents: linkEnabled ? "auto" : "none",
          }}
          className="
            fixed
            top-32 sm:top-36 md:top-40
            left-1/2
            -translate-x-1/2
            z-100
            origin-center
          "
        >
          <Link href="/">
            <img
              src="/images/logo_nav.png"
              alt="MINDBEND"
              className="w-[80vw] md:w-[60vw] h-auto object-contain cursor-pointer"
            />
          </Link>
        </motion.div>

        {/* BOTTOM LEFT TEXT (ALWAYS VISIBLE) */}
        <div className="absolute bottom-8 sm:bottom-10 left-6 sm:left-10 z-30 max-w-md">
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-4 opacity-70"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            The 2026 edition of
          </p>
          <h2
            className="text-3xl md:text-4xl font-light leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Gujarat's largest Techno-Managerial fest
          </h2>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#020205] to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default AlternativeHero2;
