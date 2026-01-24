"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

// Animated counter that starts when it enters the viewport
function Counter({
  to,
  prefix = "",
  suffix = "",
  duration = 1,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => setDisplay(v as number));
    return () => unsub();
  }, [rounded]);

  useEffect(() => {
    if (isInView) {
      animate(count, to, { duration, ease: "easeOut" });
    }
  }, [isInView, to, duration, count]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const About = () => {
  return (
    <>
      {/* Hero Section - Elite Opportunities */}
      <section className="relative min-h-[55vh] md:min-h-[90vh] w-full z-10 flex items-center justify-center overflow-hidden py-20">

        {/* Decorative Grid Pattern - Hidden on small mobile */}
        <div className="absolute bottom-8 right-4 md:right-8 opacity-40 md:opacity-100">
          <img
            src="/images/image.png"
            alt="grid"
            className="w-16 h-16 md:w-25 md:h-25 object-contain"
          />
        </div>

        {/* Metadata Grid */}
        <div
          className="absolute top-10 md:top-30 left-0 w-full px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[10px] md:text-xs text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300 tracking-widest uppercase font-semibold"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <div className="space-y-1" style={{ color: '#00d3f2' }}>
            <p>SVNIT SURAT PRESENTS</p>
            <p>GLOBAL EVENT / 2026 EDITION</p>
          </div>

          <div
            className="hidden lg:block text-center text-sm md:text-md max-w-sm lowercase italic"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: '#00b9da' }}
          >
            <p>
              where tradition fuels progress, shaping a sustainable and dynamic
              future.
            </p>
          </div>

          <div
            className="text-right text-sm md:text-xl"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: '#00d3f2' }}
          >
            31ST EDITION
          </div>
        </div>

        {/* Main Heading */}
        <div className="z-10 px-4 sm:px-6 md:px-8">
          <h1
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight mb-2 sm:mb-4"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-white inline-block"
            >
              Elite Innovation
            </motion.span>
            <br />
            <motion.span
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white inline-block"
            >
              Opportunities.
            </motion.span>
            <motion.span
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300 ml-2 inline-block"
            >
              Symbiont.
            </motion.span>
          </h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-10 left-6 sm:left-10 max-w-70 md:max-w-md text-gray-400 text-[10px] md:text-sm tracking-wide leading-relaxed uppercase"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          WHERE CUTTING-EDGE INNOVATION MEETS THE VISION OF TOMORROW. WE EXPLORE
          NEXT-LEVEL IDEAS BEHIND CLOSED DOORS.
        </motion.p>
      </section>

      {/* About Section with Video Background */}
      <section className="relative min-h-[85vh] md:min-h-screen w-full overflow-hidden z-10 flex items-center">
        {/* Background Video - Adjusted for mobile */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-20 md:opacity-100 md:scale-90 md:translate-x-10"
        >
          <source src="/videos/Home_about.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/50 md:bg-black/40"></div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full pl-6 sm:pl-8 md:pl-10 pr-6 py-20"
        >
          <div className="max-w-3xl">
            <h3
              className="text-white text-5xl md:text-7xl font-black mb-12 tracking-wide uppercase leading-snug"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              ABOUT{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
                MINDBEND
              </span>
            </h3>
            <div className="h-0.5 w-32 md:w-64 bg-linear-to-r from-cyan-500 to-transparent mb-8 md:mb-12"></div>

            <p
              className="text-gray-200 text-md md:text-xl leading-relaxed font-light"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Mindbend is Gujarat's{" "}
              <span className="text-cyan-300 font-semibold">
                largest Techno-Managerial festival
              </span>
              , hosted annually by SVNIT, Surat. It stands as a grand stage
              where intelligence meets innovation, bringing together brilliant
              minds from across the nation to push the boundaries of technology
              and creativity.
              <br />
              <br />
              Attracting over 15,000 participants annually, it features
              cutting-edge workshops, high-stakes competitions, inspiring guest
              lectures, and engaging activities that shape the innovators of
              tomorrow.
            </p>

            {/* Metrics */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12 md:mt-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2
                  }
                }
              }}
            >
              {[
                { value: 15000, prefix: "", suffix: "+", label: "Participants" },
                { value: 7, prefix: "₹", suffix: " Lakh+", label: "Prize Pool" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        type: "spring",
                        damping: 12,
                        stiffness: 100
                      }
                    }
                  }}
                  whileHover={{
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className="relative group"
                >
                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />

                  <div className="relative">
                    <motion.div
                      className="text-white text-4xl md:text-5xl font-extrabold"
                      style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                      whileHover={{
                        color: "#00d3f2",
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Counter
                        to={item.value}
                        prefix={item.prefix}
                        suffix={item.suffix}
                      />
                    </motion.div>
                    <motion.div
                      className="text-gray-400 text-xs md:text-sm tracking-widest uppercase mt-2"
                      whileHover={{
                        color: "#00b9da",
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {item.label}
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* History Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-10 mb-8"
            >
              <a
                href="/history"
                className="relative inline-flex items-center gap-2 group px-6 py-3 border border-cyan-500/30 bg-cyan-950/10 hover:bg-cyan-900/20 text-cyan-400 text-sm md:text-base tracking-widest uppercase transition-all duration-300 transform hover:scale-105"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="relative z-10 w-2 h-2 bg-cyan-400 rounded-full group-hover:bg-white transition-colors duration-300"></span>
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">Explore Our History</span>
                <div className="absolute inset-0 bg-cyan-500/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 ease-out"></div>
              </a>
            </motion.div>
          </div>
        </motion.div >
      </section >
    </>
  );
};

export default About;
