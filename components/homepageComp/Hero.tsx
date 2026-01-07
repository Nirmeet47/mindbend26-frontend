"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const Hero = () => {
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

  // Responsive target positions for logo lock point (size stays constant up to 1500px)
  const target = useMemo(() => {
    // Use a reference vw so final navbar logo pixel-size remains the same
    // for all screens at and below 1500px (use 1500 as the max reference).
    const refVW = Math.min(vw, 1500);
    const END_SCALE = vw < 640 ? 0.35 : 0.2; // responsive scale: 0.35 below 640px, 0.20 otherwise
    // small screens use ~80vw, medium/large use ~70vw.
    if (vw < 640) {
      const halfFinal = ((0.8 * END_SCALE) / 2) * refVW; // use refVW to freeze final size <=1500
      const leftPad = 15; // px desired left padding inside navbar (reduced)
      return { x: -vw / 2 + halfFinal + leftPad, y: -150 };
    }
    if (vw < 1024) {
      const halfFinal = ((0.7 * END_SCALE) / 2) * refVW; // medium
      const leftPad = 30; // px (reduced)
      return { x: -vw / 2 + halfFinal + leftPad, y: -160 };
    }
    // large (desktop)
    const halfFinal = ((0.7 * END_SCALE) / 2) * refVW;
    const leftPad = 12;
    return { x: -vw / 2 + halfFinal + leftPad, y: -180 };
  }, [vw]);

  // Responsive END_SCALE
  const END_SCALE = useMemo(() => (vw < 640 ? 0.30 : 0.2 ), [vw]);

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
      className="relative h-[100vh] bg-transparent text-white "
    >
      {/* HERO SECTION */}
      <section className="relative h-screen overflow-hidden">
        {/* BACKGROUND VIDEO (NOT STICKY, ZOOMED-OUT) */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute lg:top-0 top-1/2 lg:translate-y-8 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full lg:w-[88%] h-[40%] lg:h-full md:h-1/2 object-cover scale-100 lg:scale-60 opacity-70 z-0"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
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
            top-40
            left-1/2
            -translate-x-1/2
            z-100
            origin-center
          "
        >
          <Link href="/">
            <img
              src="/images/mb_font.png"
              alt="MINDBEND"
              className="w-[80vw] scale-160 lg:scale-100 md:w-[70vw] h-auto object-contain cursor-pointer opacity-95"
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
            className="text-3xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Gujarat&apos;s largest Techno-Managerial fest
          </h2>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#020205] to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default Hero;
