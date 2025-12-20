"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const About = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2026-03-01T00:00:00").getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Hero Section - Elite Opportunities */}
      <section className="relative h-[85vh] w-full bg-black z-10 flex items-center justify-center overflow-hidden">
        {/* Top gradient for smooth transition from Hero */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#020205] to-transparent pointer-events-none z-0" />
        {/* Grid Pattern Background */}

        <div className="absolute bottom-8 right-15">
          <img
            src="/images/image.png"
            alt="grid pattern"
            className="w-25 h-25 object-contain"
          />
        </div>

        {/* Metadata Text Top Left */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute top-18 left-12 text-xs text-gray-500 tracking-widest space-y-1"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <p>SVNIT SURAT PRESENTS</p>
          <p>GLOBAL EVENT</p>
          <p>2026 EDITION</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute top-18 left-[52vw] capitalize -translate-x-1/2 text-xs text-gray-500 tracking-widest space-y-1 text-center"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          <p>where tradition fuels progress, shaping a sustainable</p>
          <p>and dynamic future.</p>
        </motion.div>

        {/* Year Text Top Right */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-18 right-12 text-xl text-gray-600 font-light"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          31ST EDITION
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 px-6"
        >
          <h1 className="text-5xl md:text-7xl font-light tracking-tight leading-tight mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            <span className="text-white">Elite Innovation</span>
            <br />
            <span className="text-white">Opportunities.</span>
            <span className="text-gray-600 ml-2">Symbiont.</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute bottom-10 left-12 md:left-32 max-w-md text-gray-400 text-sm tracking-wide leading-relaxed"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          WHERE CUTTING-EDGE INNOVATION MEETS THE VISION OF TOMORROW. WE EXPLORE
          NEXT-LEVEL IDEAS BEHIND CLOSED DOORS.
        </motion.p>
      </section>

      {/* About Section with Video Background */}
      <section className="relative h-screen w-full overflow-hidden z-10 bg-black">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 left-35 w-full h-full object-cover scale-80"
        >
          <source src="/videos/Home_about.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-[15vh] left-12 md:left-32 lg:left-20 z-10 max-w-xl"
        >
          <h3
            className="text-white text-5xl md:text-7xl font-black mb-6 tracking-wide"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            ABOUT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              MINDBEND
            </span>
          </h3>
          <div className="h-[2px] w-[80%] bg-linear-to-r from-cyan-500 to-transparent my-4 opacity-50"></div>

          <p
            className="text-gray-200 text-base md:text-xl leading-relaxed mt-15"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Mindbend is Gujarat's{" "}
            <span className="text-cyan-300 font-semibold">
              Techno-Managerial festival
            </span>{" "}
            , hosted annually by SVNIT, Surat. It stands as a grand stage where
            intelligence meets innovation, pushing the boundaries of what's
            possible in the realms of technology, management, and sustainable
            growth.
            <br />
            <br /> Attracting over 15,000 participants, it features workshops,
            competitions, and engaging activities.
          </p>

          {/* Metrics: Footfall, Prize Pool, Teams */}
          <div className="flex w-full justify-between mt-15">
            <div>
              <div
                className="text-white text-4xl md:text-5xl font-extrabold"
                style={{ fontFamily: "Barlow Condensed, sans-serif" }}
              >
                15k+
              </div>
              <div
                className="text-white text-sm md:text-base tracking-wide"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Footfall
              </div>
            </div>
            <div>
              <div
                className="text-white text-4xl md:text-5xl font-extrabold"
                style={{ fontFamily: "Barlow Condensed, sans-serif" }}
              >
                ₹ 1300k+
              </div>
              <div
                className="text-white text-sm md:text-base tracking-wide"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Total Prize Pool
              </div>
            </div>
            <div>
              <div
                className="text-white text-4xl md:text-5xl font-extrabold"
                style={{ fontFamily: "Barlow Condensed, sans-serif" }}
              >
                4k+
              </div>
              <div
                className="text-white text-sm md:text-base tracking-wide"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Teams Participated
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
};

export default About;
