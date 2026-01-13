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

type SponsorLogoItem = { src: string; darkOnBlack: boolean };

// Mark ONLY the logos that disappear on black (1-based index: 1..31).
const DARK_LOGO_INDEXES = new Set<number>([4, 8, 17, 29]);

const sponsorLogos: SponsorLogoItem[] = Array.from({ length: 31 }, (_, i) => {
  const idx = i + 1;
  return {
    src: `/images/sponsors/${idx}.png`,
    darkOnBlack: DARK_LOGO_INDEXES.has(idx),
  };
});

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
        <ParallaxText baseVelocity={-0.8}>
          {sponsorLogos.map(({ src, darkOnBlack }, index) => (
            <SponsorLogo key={index} src={src} darkOnBlack={darkOnBlack} />
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

function SponsorLogo({ src, darkOnBlack }: { src: string; darkOnBlack: boolean }) {
  return (
    <div className="relative shrink-0 w-36 h-16 md:w-56 md:h-24">
      <Image
        src={src}
        alt="Sponsor logo"
        fill
        sizes="(max-width: 768px) 144px, 224px"
        className={`object-contain opacity-90 hover:opacity-100 transition-opacity duration-300 ${darkOnBlack ? '[filter:drop-shadow(0_2px_10px_rgba(255,255,255,0.3))_drop-shadow(0_0_1px_rgba(255,255,255,0.7))]' : ''}`}
      />
    </div>
  );
}
