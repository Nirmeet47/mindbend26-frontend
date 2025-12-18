"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const About = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-03-01T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full py-20 px-12 md:px-32 lg:px-48 z-10 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h3 className="text-white text-5xl md:text-7xl font-black">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">MINDBEND</span>
          </h3>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          
          {/* Main Description Box */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="md:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl flex flex-col justify-between"
          >
            <div>
              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
                Mindbend is the annual <span className="text-white font-semibold">Techno-Managerial festival</span> of SVNIT Surat. 
                It stands as a grand stage where intelligence meets innovation, pushing the boundaries of what's possible 
                in the realms of technology, management, and sustainable growth.
              </p>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
                Since its inception, Mindbend has been a beacon for aspiring engineers, managers, designers, and innovators 
                across the nation. We unite minds from diverse backgrounds to collaborate, compete, and create solutions 
                that shape tomorrow's world.
              </p>
              <p className="text-gray-400 text-base md:text-lg leading-relaxed">
                This year's theme, <span className="text-cyan-300 font-semibold">SYMBIONT: The Cognitive Genesis</span>, explores 
                the harmonious relationship between human intelligence and artificial intelligence—celebrating India's journey 
                in redefining what it means to think, innovate, and lead in the age of cognitive revolution.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-mono">
                #CognitiveGenesis
              </div>
              <div className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-mono">
                #SVNITSurat
              </div>
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-mono">
                #SYMBIONT
              </div>
            </div>
          </motion.div>

          {/* Stats Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="md:col-span-4 grid grid-cols-1 gap-6"
          >
            <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white">50+</span>
              <span className="text-blue-300 text-sm uppercase tracking-tighter mt-1">High-Octane Events</span>
            </div>
            <div className="bg-cyan-600/10 border border-cyan-500/30 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white">10K+</span>
              <span className="text-cyan-300 text-sm uppercase tracking-tighter mt-1">Footfall Expected</span>
            </div>
            <div className="bg-purple-600/10 border border-purple-500/30 p-6 rounded-3xl flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-black text-white">3</span>
              <span className="text-purple-300 text-sm uppercase tracking-tighter mt-1">Days of Innovation</span>
            </div>
          </motion.div>

          {/* Bottom Banner Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="md:col-span-12 bg-gradient-to-r from-blue-900/20 to-transparent border border-white/5 p-8 rounded-3xl"
          >
            <h4 className="text-white font-bold text-2xl mb-4 italic">"Where Ideas Evolve"</h4>
            <p className="text-gray-400 max-w-3xl">
              From robotics to case studies, and from coding marathons to design challenges, we provide 
              an ecosystem for thinkers and creators to forge the future of Indian Intelligence. Join us in March 2026 
              as we embark on this cognitive journey, exploring the intersection of humanity and technology.
            </p>
          </motion.div>

        </div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <h4 className="text-center text-white text-2xl md:text-3xl font-bold mb-8">
            Event Starts In
          </h4>
          <div className="grid grid-cols-4 gap-4 md:gap-6">
            {/* Days */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/20 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-6xl font-black text-white mb-2">{timeLeft.days}</span>
              <span className="text-blue-300 text-xs md:text-sm uppercase tracking-wider">Days</span>
            </div>
            
            {/* Hours */}
            <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-6xl font-black text-white mb-2">{timeLeft.hours}</span>
              <span className="text-cyan-300 text-xs md:text-sm uppercase tracking-wider">Hours</span>
            </div>
            
            {/* Minutes */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-6xl font-black text-white mb-2">{timeLeft.minutes}</span>
              <span className="text-purple-300 text-xs md:text-sm uppercase tracking-wider">Minutes</span>
            </div>
            
            {/* Seconds */}
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-900/20 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-6 flex flex-col items-center justify-center">
              <span className="text-4xl md:text-6xl font-black text-white mb-2">{timeLeft.seconds}</span>
              <span className="text-pink-300 text-xs md:text-sm uppercase tracking-wider">Seconds</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;