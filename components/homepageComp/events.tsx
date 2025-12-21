"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface EventCard {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  direction: "left" | "right";
}

const events: EventCard[] = [
  {
    id: 1,
    title: "TECHNICAL",
    subtitle: "INNOVATE - BUILD - LEARN",
    image: "/images/tech_img.jpg",
    link: "/technical",
    direction: "left",
  },
  {
    id: 2,
    title: "MANAGERIAL",
    subtitle: "INNOVATE - COMPETE - CONQUER",
    image: "/images/mng_img.avif",
    link: "/managerial",
    direction: "right",
  },
  {
    id: 3,
    title: "WORKSHOPS",
    subtitle: "INNOVATE - BUILD - LEARN",
    image: "/images/workshop_img.png",
    link: "/workshops",
    direction: "left",
  },
  {
    id: 4,
    title: "GUEST LECTURES",
    subtitle: "INNOVATE - INSPIRE - TRANSFORM",
    image: "/images/gl_img.png",
    link: "/guest-lectures",
    direction: "right",
  },
];

export default function Events() {
  return (
    <section className="w-full py-20 px-4 flex items-center justify-center relative">
      {/* Top gradient to blend with section above */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

      {/* Bottom gradient to blend with section below */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

      <div className="max-w-6xl mx-auto space-y-6 flex flex-col items-center w-full relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-shrink-0 px-20 py-12 md:pb-16 z-1 flex flex-col items-center text-center"
        >
          <h2
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wider"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            Our Events
          </h2>
          <div className="h-[3px] w-[80%] bg-linear-to-t from-cyan-500 to-transparent my-4 mx-auto opacity-50"></div>
        </motion.div>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: EventCard }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const cardRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const getAnimationClass = () => {
    if (isVisible) {
      return "opacity-100 translate-x-0 translate-y-0";
    }

    if (scrollDirection === "down") {
      return event.direction === "right"
        ? "opacity-0 translate-x-32 translate-y-8"
        : "opacity-0 -translate-x-32 translate-y-8";
    } else {
      return event.direction === "right"
        ? "opacity-0 translate-x-32 -translate-y-8"
        : "opacity-0 -translate-x-32 -translate-y-8";
    }
  };

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-1000 w-full max-w-5xl ${getAnimationClass()}`}
    >
      <Link
        href={event.link}
        className="block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`relative overflow-hidden transition-all duration-500 ${
            isHovered ? "scale-[1.02]" : ""
          }`}
          style={{
            clipPath:
              event.direction === "right"
                ? "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)"
                : "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)",
          }}
        >
          {/* Background Image */}
          <div className="relative h-60 w-full overflow-hidden">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className={`object-cover transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
          </div>

          {/* Shiny Border Frame */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-500 ${
              isHovered ? "opacity-100" : "opacity-80"
            }`}
            style={{
              clipPath:
                event.direction === "right"
                  ? "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)"
                  : "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)",
            }}
          >
            {/* Outer Glow */}
            <div
              className={`absolute inset-0 transition-all duration-500 ${
                isHovered
                  ? "shadow-[0_0_40px_rgba(0,200,255,0.6),inset_0_0_40px_rgba(0,200,255,0.3)]"
                  : "shadow-[0_0_20px_rgba(0,150,255,0.4),inset_0_0_20px_rgba(0,150,255,0.2)]"
              }`}
              style={{
                border: "3px solid",
                borderImage:
                  "linear-gradient(135deg, #1e3a8a, #0ea5e9, #06b6d4, #1e3a8a) 1",
                clipPath:
                  event.direction === "right"
                    ? "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)"
                    : "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)",
              }}
            />

            {/* Diagonal Stripes Accent */}
            <div
              className="absolute top-0 right-0 h-12 w-64 opacity-60"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(6, 182, 212, 0.3) 5px, rgba(6, 182, 212, 0.3) 10px)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 h-12 w-64 opacity-60"
              style={{
                background:
                  "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(6, 182, 212, 0.3) 5px, rgba(6, 182, 212, 0.3) 10px)",
              }}
            />

            {/* Shimmer Effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent transition-transform duration-1000 ${
                isHovered ? "translate-x-full" : "-translate-x-full"
              }`}
              style={{
                transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-8">
            <div
              className={`flex items-end justify-between ${
                event.direction === "right" ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`${
                  event.direction === "right" ? "text-left" : "text-right"
                }`}
              >
                <p className="text-sm text-cyan-400 uppercase tracking-wider mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  {event.subtitle}
                </p>
                <h2
                  className="text-7xl font-bold text-white uppercase tracking-widest"
                  style={{
                    fontFamily: "Barlow Condensed, sans-serif",
                    fontStyle: "italic",
                    textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)",
                  }}
                >
                  {event.title}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
