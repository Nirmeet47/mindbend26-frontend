"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  User,
  Zap,
  Calendar,
  Trophy,
  Mic2,
  Hexagon,
  Mail,
  Box,
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utils ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Types & Data ---
type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  color: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "EVENTS", href: "/events", icon: <Calendar />, color: "#06b6d4" }, // Cyan
  { label: "WORKSHOPS", href: "/workshops", icon: <Zap />, color: "#8b5cf6" }, // Violet
  { label: "SPEAKERS", href: "/speakers", icon: <Mic2 />, color: "#ec4899" }, // Pink
  { label: "EXHIBITS", href: "/exhibits", icon: <Box />, color: "#10b981" }, // Emerald
  {
    label: "COMPETITIONS",
    href: "/competitions",
    icon: <Trophy />,
    color: "#f59e0b",
  }, // Amber
  { label: "CONTACT", href: "/contact", icon: <Mail />, color: "#3b82f6" }, // Blue
];

// --- Background Particle Component ---
type ParticleConfig = {
  x: string;
  y: string;
  scale: number;
  targetY: string;
  duration: number;
  size: number;
};

const ParticleBackground = () => {
  // Precompute random values once to keep render idempotent
  const [particles] = useState<ParticleConfig[]>(() =>
    Array.from({ length: 20 }, () => ({
      x: `${Math.floor(Math.random() * 100)}vw`,
      y: `${Math.floor(Math.random() * 100)}vh`,
      scale: Math.random() * 0.5 + 0.5,
      targetY: `${-Math.floor(Math.random() * 100)}vh`,
      duration: Math.random() * 10 + 10,
      size: Math.random() * 4 + 1,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-cyan-500/20 rounded-full"
          initial={{ x: p.x, y: p.y, scale: p.scale }}
          animate={{ y: [null, p.targetY], opacity: [0, 0.8, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ width: `${p.size}px`, height: `${p.size}px` }}
        />
      ))}
    </div>
  );
};

export default function NeuralNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const pathname = usePathname();

  // Update dimensions for centering logic
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Initial set
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  // Responsive radius calculation
  const radius = dimensions.width < 768 ? 140 : 250;

  return (
    <>
      {/* =======================
          1. TOP NAVIGATION BAR 
         ======================= */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 w-full z-50 h-20 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
            <Hexagon
              className="text-cyan-400 relative z-10 w-full h-full"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-xl font-bold text-white tracking-[0.2em]">
              TECHFEST
            </span>
            <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">
              Neural Interface v2.0
            </span>
          </div>
        </Link>

        {/* Right Side Controls */}
        <div className="flex items-center gap-6">
          <Link
            href="/login"
            className="hidden md:flex items-center gap-2 group"
          >
            <span className="text-gray-400 font-mono text-sm group-hover:text-cyan-400 transition-colors">
              /LOGIN
            </span>
            <div className="p-2 border border-white/20 rounded bg-white/5 group-hover:border-cyan-500/50 transition-colors">
              <User size={18} className="text-white" />
            </div>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative group w-12 h-12 flex items-center justify-center z-50"
          >
            <div
              className={cn(
                "absolute inset-0 rounded-full border border-white/10 group-hover:border-cyan-500/50 transition-colors duration-300",
                isOpen &&
                  "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              )}
            />
            {isOpen ? (
              <X className="text-white" />
            ) : (
              <Menu className="text-white" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* =======================
          2. FULL SCREEN OVERLAY 
         ======================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.3 } }}
            className="fixed inset-0 z-40 bg-black flex items-center justify-center overflow-hidden"
          >
            {/* 2a. Background Aesthetics */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            <ParticleBackground />

            {/* 2b. Connecting Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {NAV_ITEMS.map((item, i) => {
                const angle =
                  (i * (360 / NAV_ITEMS.length) - 90) * (Math.PI / 180);
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);

                return (
                  <g key={`line-${i}`}>
                    {/* The glowing line */}
                    <motion.line
                      x1={centerX}
                      y1={centerY}
                      x2={x}
                      y2={y}
                      stroke={item.color}
                      strokeWidth="2"
                      strokeOpacity="0.3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                    {/* The travelling pulse */}
                    <motion.circle r="3" fill={item.color}>
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={`M${centerX},${centerY} L${x},${y}`}
                      />
                    </motion.circle>
                  </g>
                );
              })}
            </svg>

            {/* 2c. Central Hub */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="absolute z-20"
              style={{ left: centerX, top: centerY, x: "-50%", y: "-50%" }}
            >
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="relative w-32 h-32 flex items-center justify-center group"
              >
                {/* Glowing Orbs around center */}
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-2 border border-cyan-500/50 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />

                <Hexagon
                  size={48}
                  className="text-cyan-400 relative z-10 fill-black/50"
                />
                <span className="absolute mt-16 text-[10px] text-cyan-300 font-mono tracking-widest">
                  HOME
                </span>
              </Link>
            </motion.div>

            {/* 2d. Satellite Nodes (Menu Items) */}
            {NAV_ITEMS.map((item, i) => {
              const angle =
                (i * (360 / NAV_ITEMS.length) - 90) * (Math.PI / 180);
              // Calculate explicit positions for style
              const xPos = centerX + radius * Math.cos(angle);
              const yPos = centerY + radius * Math.sin(angle);

              return (
                <motion.div
                  key={item.label}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring" }}
                  className="absolute z-20"
                  style={{ left: xPos, top: yPos, x: "-50%", y: "-50%" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group relative flex flex-col items-center justify-center w-24 h-24"
                  >
                    {/* Hexagon Shape Container */}
                    <div
                      className="absolute inset-0 bg-black border-2 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_var(--glow-color)]"
                      style={{
                        borderColor: item.color,
                        clipPath:
                          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                        // @ts-expect-error custom variable
                        "--glow-color": item.color,
                      }}
                    />

                    {/* Inner Content */}
                    <div className="relative z-10 text-white group-hover:text-white transition-colors duration-300">
                      {React.cloneElement(
                        item.icon as React.ReactElement<any>,
                        {
                          size: 28,
                        }
                      )}
                    </div>

                    {/* Label */}
                    <div className="absolute -bottom-8 bg-black/80 px-2 py-1 rounded border border-white/10 backdrop-blur-sm">
                      <span
                        className="text-[10px] font-bold font-mono tracking-widest block whitespace-nowrap"
                        style={{ color: item.color }}
                      >
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
