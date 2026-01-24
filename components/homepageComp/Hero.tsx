"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import gsap from "gsap";
import PreloaderText from "./PreloaderText";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vw, setVw] = useState(1200); // fallback to avoid zero on first render
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [viewportHeight, setViewportHeight] = useState(0);
  const lastScrollY = useRef(0);
  const [showContent, setShowContent] = useState(false);
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  // Force scroll to top on page load/reload (important for preloader + hero video sync)
  useEffect(() => {
    // Immediately scroll to top
    window.scrollTo(0, 0);

    // Also handle browser's scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // Fallback: scroll again after a brief delay to ensure it takes effect
    const timeout = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // Preloader animation using GSAP
  useEffect(() => {
    if (!containerRef.current) return;

    // Get viewport dimensions for final video position calculation
    const vh = window.innerHeight;
    const vw = window.innerWidth;

    const isLarge = vw >= 1024;
    const isMedium = vw >= 768;

    const finalWidth = isLarge ? vw * 0.88 : vw;
    const finalHeight = isLarge ? vh : isMedium ? vh * 0.5 : vh * 0.4;
    const finalScale = isLarge ? 0.6 : 1;
    const finalY = isLarge ? 8 : 0;

    const ctx = gsap.context(() => {
      // Check session storage
      const hasSeenPreloader = sessionStorage.getItem("mindbend_preloader_seen");

      if (hasSeenPreloader) {
        // FAST PATH: Skip animation, set final state immediately
        setPreloaderComplete(true);
        setShowContent(true);

        // Hide preloader elements
        gsap.set(".preloader-text-container, .preloader-bg, .video-curtain", { autoAlpha: 0, display: "none" });

        // Set video to final hero state
        gsap.set(".video-container", {
          width: finalWidth,
          height: finalHeight,
          scale: finalScale,
          y: finalY,
          opacity: 1,
          visibility: "visible"
        });

        // Remove preloader overlay from flow
        gsap.set(".preloader-overlay", { position: "absolute" });

      } else {
        // RUN ANIMATION

        // Set initial states
        const initialHeight = vw >= 768 ? 100 : 75;
        gsap.set(".video-container", {
          width: 0,
          height: initialHeight,
          opacity: 0,
          scale: 1,
          y: 0,
          visibility: "hidden",
        });
        gsap.set(".video-curtain", { y: "0%" });

        // Create timeline
        const tl = gsap.timeline({
          delay: 1,
          defaults: { ease: "power3.out" },
          onComplete: () => {
            setPreloaderComplete(true);
            setShowContent(true);
            sessionStorage.setItem("mindbend_preloader_seen", "true");
          },
        });

        // Phase 1: Erase IND and END letters
        tl.to(".letter-ind .letter-inner, .letter-end .letter-inner", {
          y: "+110%",
          duration: 0.6,
          ease: "power2.inOut",
        })
          // Phase 2: Collapse width
          .to(
            ".letter-ind, .letter-end",
            { width: 0, duration: 0.6, ease: "power2.inOut" },
            "+=0.1"
          )
          // Phase 3: M and B separate, video appears
          .to(".letter-m", { x: -90, duration: 0.5, ease: "power2.inOut" }, "+=0.1")
          .to(".letter-b", { x: 90, duration: 0.5, ease: "power2.inOut" }, "<")
          .to(
            ".video-container",
            {
              width: 140,
              opacity: 1,
              visibility: "visible",
              duration: 0.8,
              ease: "power2.out",
            },
            "<"
          )
          // Phase 4: Reveal video
          .to(".video-curtain", {
            y: "-100%",
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
              const curtain = document.querySelector(".video-curtain") as HTMLElement;
              if (curtain) curtain.style.display = "none";
            },
          })
          // Phase 5: Fade out text, expand video
          .to(".letter-m, .letter-b", { opacity: 0, duration: 0.4, ease: "power2.out" })
          .to(
            ".video-container",
            {
              width: finalWidth,
              height: finalHeight,
              scale: finalScale,
              y: finalY,
              duration: 0.8,
              ease: "power3.inOut",
            },
            "<"
          )
          .to(".preloader-text-container", { opacity: 0, duration: 0.3 }, "<")
          // Phase 6: Fade out bg
          .to(".preloader-bg", { opacity: 0, duration: 0.5, ease: "power2.out" })
          .set(".preloader-overlay", {
            position: "absolute",
            onComplete: () => {
              const preloaderBg = document.querySelector(".preloader-bg") as HTMLElement;
              if (preloaderBg) preloaderBg.style.display = "none";
            },
          });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Capture viewport width safely
  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Track scroll position and direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      // Mobile: Adjusted y to -170 to shift logo up slightly for better centering between navbar and video
      return { x: -vw / 2 + halfFinal + leftPad, y: -170 };
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
  const END_SCALE = useMemo(() => (vw < 640 ? 0.3 : 0.2), [vw]);

  // Move from center → top-left navbar
  const x = useTransform(progress, [0, 0.3], [0, target.x]);
  const y = useTransform(progress, [0, 0.3], [0, target.y]);

  // Keep final scale consistent across breakpoints
  const scaleX = useTransform(progress, [0, 0.3], [1.25, END_SCALE]);
  const scaleY = useTransform(progress, [0, 0.3], [1, END_SCALE]);
  const fadeOutOpacity = useTransform(progress, [0.8, 1], [1, 0]);



  // Handle scroll direction for logo visibility (hide on scroll down like navbar)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    // Initial set
    setViewportHeight(window.innerHeight);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      {/* SINGLE LOGO (ANIMATES → STICKS IN NAV) - MOVED OUTSIDE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={
          scrollDirection === "down"
            ? { opacity: 0, y: -200 }
            : showContent
              ? { opacity: 1, y: -20 }
              : { opacity: 0, y: -100 }
        }
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{
          scaleX,
          scaleY,
          x,
          y,
          pointerEvents: linkEnabled ? "auto" : "none",
          display: scrollY > (viewportHeight * 0.7) ? "none" : "block", // Hide earlier to avoid text overlap // use 0.7 if this fails
        }}
        className="
      fixed
      top-40
      left-1/2
      -translate-x-1/2
      z-[100]
      origin-center
      "
      >
        <motion.div style={{ opacity: fadeOutOpacity }}>
          <Link href="/">
            <img
              src="/images/mb_font.png"
              alt="MINDBEND"
              className="w-[80vw] scale-160 lg:scale-100 md:w-[70vw] h-auto object-contain cursor-pointer opacity-95 z-[100]"
            />
          </Link>
        </motion.div>
      </motion.div>


      {/* HERO SECTION */}
      <section className="relative h-screen overflow-hidden">
        {/* PRELOADER - Contains the video that transforms into hero video */}
        {/* Added 'invisible' to hide by default to prevent flash on returning visits */}
        {/* GSAP will toggle autoAlpha to visible if needed */}
        <div
          ref={preloaderRef}
          className="preloader-overlay fixed inset-0 z-50 flex items-center justify-center invisible"
        >
          {/* Black background - fades out at end */}
          <div className="preloader-bg absolute inset-0 bg-black" />

          {/* Video Container - starts between M&B, expands to hero size */}
          <div
            className="video-container absolute overflow-hidden"
            style={{
              height: 90,
              opacity: 0,
              width: 0,
              visibility: "hidden",
            }}
          >
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
            </video>
            {/* White curtain that reveals video */}
            <div className="video-curtain absolute inset-0 bg-white z-10" />
          </div>

          {/* MINDBEND Text Animation */}
          <PreloaderText />
        </div>

        {/* BOTTOM LEFT TEXT (ALWAYS VISIBLE) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="hidden md:block absolute bottom-5 left-6 sm:left-10 z-30 max-w-md"
        >
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
        </motion.div>

        {/* BOTTOM RIGHT CALLOUT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
          className="hidden md:block absolute bottom-5 right-6 sm:right-10 z-30 text-right"
        >
          <p
            className="text-[10px] tracking-[0.2em] uppercase mb-4 opacity-70"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Join Us On
          </p>
          <h2
            className="text-3xl md:text-3xl font-light leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            27th - 28th February <br />& 1st March 2026
          </h2>
        </motion.div>

        {/* MOBILE ONLY: Centered bottom text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={showContent ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="md:hidden absolute text-center bottom-15 sm:bottom-10 z-30 px-10"
        >
          <p
            className="text-sm sm:text-md opacity-80"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            The 2026 edition of
          </p>
          <p
            className="text-[24px] sm:text-4xl leading-snug"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Gujarat&apos;s largest Techno-Managerial fest
          </p>
          <p
            className="mt-1 text-[24px] sm:text-4xl opacity-80"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            27,28 feb &amp; 1 march
          </p>
        </motion.div>
      </section>

      {/* BLUR GRADIENT OVERLAY - MOVED OUTSIDE SECTION */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-[#020205] to-transparent pointer-events-none z-0" />
    </div >
  );
};

export default Hero;
