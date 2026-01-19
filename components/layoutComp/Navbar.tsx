"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "@/hooks/useAuth";

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!<>-_\\/[]{}—=+*^?#________";

const ScrambleText = ({
  text,
  className = "",
  triggerOnMount = true,
}: {
  text: string;
  className?: string;
  triggerOnMount?: boolean;
}) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const scramble = useCallback(() => {
    let iteration = 0;
    const stepIncrement = text.length / 25;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(intervalRef.current!);
      iteration += stepIncrement;
    }, 30);
  }, [text]);

  useEffect(() => {
    if (triggerOnMount) scramble();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [triggerOnMount, scramble]);

  return (
    <span onMouseEnter={scramble} className={className}>
      {displayText}
    </span>
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [hasScrolledPast50vh, setHasScrolledPast50vh] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { isAuthenticated, isLoading } = useAuth();
  const [showNavbar, setShowNavbar] = useState(!isHome);

  // Hide navbar for 5 seconds on homepage (preloader duration)
  useEffect(() => {
    if (isHome) {
      const timer = setTimeout(() => {
        setShowNavbar(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isHome]);

  // Track scroll position and direction
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentViewportHeight = window.innerHeight;
      const halfViewport = currentViewportHeight / 2;

      // Determine scroll direction
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      // Track if we've scrolled past 50vh
      if (currentScrollY > halfViewport) {
        setHasScrolledPast50vh(true);
      } else {
        setHasScrolledPast50vh(false);
      }

      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    };

    // Initial set
    setViewportHeight(window.innerHeight);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuData = [
    {
      title: "Events",
      isHyperlink: false,
      items: [
        { label: "TECHNICAL", id: "2.1", href: "/technical" },
        { label: "MANAGERIAL", id: "2.2", href: "/managerial" },
        { label: "WORKSHOPS", id: "2.3", href: "/workshops" },
        { label: "GUEST LECTURES", id: "2.4", href: "/guest-lectures" },
        { label: "HACKATHON", id: "2.5", href: "/hackathon" },
        { label: "MUN", id: "2.6", href: "/mun" },
        { label: "ESPORTS", id: "2.7", href: "/esports" },
        { label: "CONFERENCE", id: "2.8", href: "/conference" },
      ],
    },
    { title: "Sponsors", isHyperlink: true, href: "/sponsors", items: [] },
    {
      title: "Accommodation",
      isHyperlink: true,
      href: "/accommodation",
      items: [],
    },
    {
      title: "Campus Ambassador",
      isHyperlink: true,
      href: "/ambassador",
      items: [],
    }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: isHome ? -100 : 0, opacity: isHome ? 0 : 1 }}
        animate={{
          y: scrollDirection === "down" && scrollY > 50 ? -100 : (showNavbar ? 0 : -100),
          opacity: showNavbar ? 1 : 0
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed left-0 w-full z-40 px-6 md:px-8 py-2 md:py-4 flex justify-between items-center mix-blend-difference text-white transition-all duration-300 mt-2 sm:mt-0 ${hasScrolledPast50vh && scrollY > 100
          ? "bg-black/20"
          : ""
          }`}
        style={{ fontFamily: "Barlow Condensed, sans-serif", top: 0 }}
      >
        {isHome && scrollY < (viewportHeight * 0.7 || 800) ? (
          <div className="w-20 md:w-28 h-8" />
        ) : (
          <Link href="/" className="flex items-center">
            <img
              src="/images/mb_font.png"
              alt="MINDBEND"
              className="h-6 md:h-7 object-contain select-none"
            />
          </Link>
        )}
        <div className="flex items-center gap-4 md:gap-10">
          {/* Show LOGIN or PROFILE based on auth state, visible on all screens unless menu is open */}
          {!isOpen && !isLoading && (
            isAuthenticated ? (
              <Link
                href="/user/dashboard"
                className="hidden md:flex items-center gap-2 text-[15px] font-bold tracking-[0.2em] hover:scale-110 hover:text-zinc-400 transition-all duration-300"
              >
                PROFILE
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 text-[15px] font-bold tracking-[0.2em] hover:scale-110 hover:text-zinc-400 transition-all duration-300"
              >
                LOGIN
              </Link>
            )
          )}
          <button
            onClick={() => setIsOpen(true)}
            className="text-[15px] font-bold tracking-[0.2em] uppercase hover:scale-110 hover:text-zinc-400 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            MENU [+]
          </button>
        </div>
      </motion.nav >

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-110"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              className="fixed top-0 right-0 h-screen w-full md:w-125 lg:w-1/2 bg-[#050505] z-120 border-l border-white/5 flex flex-col text-white shadow-2xl"
            >
              <div className="p-6 md:p-10 flex justify-between items-center border-b border-white/5">
                <ScrambleText
                  text="©MINDBEND_2026"
                  className="text-[13px] font-mono text-zinc-600"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-[13px] font-mono tracking-widest hover:text-red-500 transition-colors uppercase"
                >
                  <ScrambleText text="CLOSE [X]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:px-16 md:py-12 space-y-8 md:space-y-10 no-scrollbar">
                {/* Mobile Profile/Login Button */}
                <div className="sm:hidden space-y-4 border-b border-white/10 pb-6">
                  {!isLoading && (
                    isAuthenticated ? (
                      <Link
                        href="/user/dashboard"
                        className="group flex w-full items-center px-2 md:px-4 py-2 md:py-3 transition-all duration-300 hover:bg-white hover:translate-x-4"
                        onClick={() => setIsOpen(false)}
                      >
                        <h2
                          className="text-2xl md:text-4xl font-light group-hover:text-black uppercase tracking-wide"
                          style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                        >
                          <ScrambleText text="PROFILE" />
                        </h2>
                      </Link>
                    ) : (
                      <Link
                        href="/login"
                        className="group flex w-full items-center px-2 md:px-4 py-2 md:py-3 transition-all duration-300 hover:bg-white hover:translate-x-4"
                        onClick={() => setIsOpen(false)}
                      >
                        <h2
                          className="text-2xl md:text-4xl font-light group-hover:text-black uppercase tracking-wide"
                          style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                        >
                          <ScrambleText text="LOGIN" />
                        </h2>
                      </Link>
                    )
                  )}
                </div>

                {menuData.map((section, idx) => (
                  <div key={idx} className="space-y-4">
                    {section.isHyperlink ? (
                      <Link
                        href={section.href || "#"}
                        className="group flex w-full items-center px-2 md:px-4 py-2 md:py-3 transition-all duration-300 hover:bg-white hover:translate-x-4"
                        onClick={() => setIsOpen(false)}
                      >
                        <h2
                          className="text-2xl md:text-4xl font-light group-hover:text-black uppercase tracking-wide"
                          style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                        >
                          <ScrambleText text={section.title} />
                        </h2>
                      </Link>
                    ) : (
                      <div className="group flex w-full items-center px-2 md:px-4 py-2 md:py-3 transition-all duration-300 hover:bg-white hover:translate-x-4 cursor-default">
                        <h2
                          className="text-2xl md:text-4xl font-light group-hover:text-black uppercase tracking-wide"
                          style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                        >
                          <ScrambleText text={section.title} />
                        </h2>
                      </div>
                    )}

                    {section.items.length > 0 && (
                      <div
                        className="grid grid-cols-1 gap-x-8 pl-4"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                      >
                        {section.items.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            className="group relative flex items-center gap-4 py-2 px-4 transition-all duration-300 hover:bg-white hover:translate-x-2"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="font-mono text-[12px] text-zinc-600 group-hover:text-black">
                              {sub.id}
                            </span>
                            <span className="font-mono text-[12px] tracking-[0.2em] group-hover:text-black uppercase block">
                              <ScrambleText text={sub.label} />
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
