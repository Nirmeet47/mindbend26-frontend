"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Shri Bhupendrabhai Patel",
      designation: "Honourable Chief Minister of Gujarat",
      image: "/images/testimonials/cm-gujarat.jpg",
      quote: "In today's rapidly advancing world, acquiring practical skills is essential for enhancing productivity and achieving success. India's emergence as the third-largest startup hub globally reflects the strength of our talented youth and increasing access to technology. I extend my best wishes for the success of ",
      highlight: "Mindbend 2024",
      quoteEnd: " at SVNIT, Surat, under the theme ",
      theme: "TechVolution: Navigating the Evolution of Innovation",
      quoteEnd2: " which will further contribute to the progress of our nation."
    },
    {
      name: "Prof. (Dr.) Anupam Shukla",
      designation: "Director, SVNIT Surat",
      image: "/images/testimonials/director-svnit.jpg",
      quote: "Our students have been successfully organizing ",
      highlight: "MINDBEND, Gujarat's largest techno-managerial fest",
      quoteEnd: ", which has grown far beyond our expectations. The ",
      highlight2: "participation of international attendees",
      quoteEnd2: ", including from Russia last year, marks a great success for the event and a proud achievement for the college, showcasing its global reach and excellence."
    }
  ];

  return (
    <section className="relative min-h-screen w-full py-20 px-12 md:px-32 lg:px-48 z-10 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h3 className="text-white text-4xl md:text-6xl font-black tracking-wider">
            INSPIRING WORDS FOR{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300">
              MINDBEND
            </span>
          </h3>
        </motion.div>

        {/* Testimonials */}
        <div className="space-y-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Profile Image */}
              <div className="shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-cyan-500/30 shadow-[0_0_20px_rgba(0,255,255,0.3)]">
                  <div className="w-full h-full bg-linear-to-br from-blue-900 to-cyan-900 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">
                      {testimonial.name.split(' ')[testimonial.name.split(' ').length - 1][0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quote Content */}
              <div className="flex-1">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                  "{testimonial.quote}
                  <span className="text-cyan-300 font-semibold">{testimonial.highlight}</span>
                  {testimonial.quoteEnd}
                  {testimonial.theme && (
                    <span className="text-cyan-300 font-semibold italic">{testimonial.theme}</span>
                  )}
                  {testimonial.quoteEnd2}
                  {testimonial.highlight2 && (
                    <>
                      <span className="text-cyan-300 font-semibold">{testimonial.highlight2}</span>
                      {testimonial.quoteEnd2}
                    </>
                  )}
                  "
                </p>
                
                <div className="space-y-1">
                  <p className="text-green-400 text-xl md:text-2xl font-bold">
                    - {testimonial.name}
                  </p>
                  <p className="text-cyan-400 text-sm md:text-base font-medium">
                    {testimonial.designation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
