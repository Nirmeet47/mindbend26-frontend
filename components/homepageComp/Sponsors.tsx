"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import Image from "next/image";

// Custom wrap function to replace @motionone/utils
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const sponsorLogos = Array.from({ length: 31 }, (_, i) => `/images/sponsors/${i + 1}.png`);

export default function Sponsors() {
  return (
    <section className="relative w-full py-16 md:py-24 bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 mb-12 md:mb-16"
      >
        <h2
          className="text-4xl md:text-7xl font-extrabold text-white text-center mb-4 tracking-wide uppercase"
          style={{ fontFamily: "Barlow Condensed, sans-serif" }}
        >
          Past Year Sponsors
        </h2>
        <div className="h-0.5 w-20 md:w-48 bg-cyan-500 mx-auto mb-6 opacity-50"></div>

        <p
          className="text-cyan-200/60 text-center max-w-xl mx-auto text-sm md:text-base"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Powered by industry leaders who believe in innovation
        </p>
      </motion.div>

      <div className="relative flex flex-nowrap overflow-hidden">
        <ParallaxText baseVelocity={-2}>
          {sponsorLogos.map((src, index) => (
            <SponsorBox key={index} src={src} />
          ))}
        </ParallaxText>
      </div>
    </section>
  );
}

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  // We wrap between -25% and -50% to keep the marquee seamless
  // This assumes we have enough children to fill the screen
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex flex-nowrap whitespace-nowrap">
      <motion.div
        className="flex flex-nowrap whitespace-nowrap gap-4 md:gap-8"
        style={{ x }}
      >
        <span className="flex gap-4 md:gap-8">{children}</span>
        <span className="flex gap-4 md:gap-8">{children}</span>
        <span className="flex gap-4 md:gap-8">{children}</span>
        <span className="flex gap-4 md:gap-8">{children}</span>
      </motion.div>
    </div>
  );
}

function SponsorBox({ src }: { src: string }) {
  return (
    <div
      className="relative shrink-0 w-40 h-24 md:w-64 md:h-32 bg-zinc-900 border border-zinc-800 
                    flex items-center justify-center overflow-hidden group"
    >
      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Image
        src={src}
        alt="Sponsor logo"
        fill
        sizes="(max-width: 768px) 160px, 256px"
        className="relative z-10 object-contain p-6"
        priority
      />

      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_4px)]" />
    </div>
  );
}
