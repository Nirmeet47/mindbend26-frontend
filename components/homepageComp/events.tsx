"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface EventCardProps {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  direction: "left" | "right";
}

const events: EventCardProps[] = [
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
    <section className="w-full py-16 px-4 md:px-10 relative overflow-hidden">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />

      <div className="max-w-6xl mx-auto space-y-8 flex flex-col items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center w-full"
        >
          <h2
            className="text-4xl md:text-6xl font-bold text-white uppercase tracking-widest"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            Our Events
          </h2>
          <div className="h-0.5 w-32 md:w-64 bg-cyan-500 mx-auto mt-4 opacity-50"></div>
        </motion.div>

        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: EventCardProps }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    if (isVisible) return "opacity-100 translate-x-0";
    // Smaller translation for mobile (10) vs Desktop (32)
    const offset =
      typeof window !== "undefined" && window.innerWidth < 768
        ? "translate-x-10"
        : "translate-x-32";
    return event.direction === "right"
      ? `opacity-0 ${offset}`
      : `opacity-0 -${offset}`;
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
          className="relative h-48 md:h-64 overflow-hidden transition-all duration-500 border-2 border-cyan-900/30"
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% 85%, 95% 100%, 5% 100%, 0 85%)",
          }}
        >
          {/* Background */}
          <Image
            src={event.image}
            alt={event.title}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

          {/* Glowing Border */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isHovered ? "opacity-100" : "opacity-40"
            } border-cyan-400 shadow-[inset_0_0_20px_rgba(0,255,255,0.2)]`}
          />

          {/* Text Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
            <p
              className="text-[10px] md:text-sm text-cyan-400 uppercase tracking-[0.3em] mb-1"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {event.subtitle}
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-7xl font-bold text-white uppercase tracking-tighter md:tracking-widest italic"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              {event.title}
            </h2>
          </div>

          {/* Shimmer on Hover */}
          <div
            className={`absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ${
              isHovered ? "translate-x-full" : "-translate-x-full"
            }`}
          />
        </div>
      </Link>
    </div>
  );
}
