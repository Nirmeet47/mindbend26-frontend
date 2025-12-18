"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";

// Sample Data - Replace 'img' with your actual image paths in /public folder or external URLs
const milestones = [
  { year: "1951", title: "Scientific Foundations", desc: "IITs, IISc, and national research institutions lay the groundwork for engineering and scientific excellence.", img: "https://images.unsplash.com/photo-1581093458791-9f302e6d8169?q=80&w=1000&auto=format&fit=crop" },
  { year: "1969", title: "Intelligence Beyond Earth", desc: "ISRO is founded, proving innovation can rise from human vision, not resources alone.", img: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1000&auto=format&fit=crop" },
  { year: "1984", title: "Digital Seeds", desc: "Computers enter governance and public systems, marking India’s first step toward machine-assisted intelligence.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" },
  { year: "1991", title: "Liberalization of Thought", desc: "Economic reforms open India to global technology and innovation ecosystems.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop" },
  { year: "2000", title: "Software Powerhouse", desc: "India emerges as a global IT leader, scaling human intellect through computation.", img: "https://images.unsplash.com/photo-1504384308090-c54be3855833?q=80&w=1000&auto=format&fit=crop" },
  { year: "2014", title: "Digital India", desc: "Technology becomes part of everyday life, governance, and national infrastructure.", img: "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=1000&auto=format&fit=crop" },
  { year: "2016", title: "Data as Identity", desc: "Aadhaar and digital public infrastructure redefine ethical, large-scale data intelligence.", img: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1000&auto=format&fit=crop" },
  { year: "2020", title: "AI for Society", desc: "Artificial intelligence begins solving real-world Indian challenges in healthcare, education, and governance.", img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop" },
  { year: "2023", title: "Generative Intelligence", desc: "Human creativity and machine intelligence start working together, not in competition.", img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop" },
  { year: "Future", title: "SYMBIONT Era", desc: "India leads the world in ethical, indigenous, symbiotic intelligence — redefining what it means to think.", img: "https://images.unsplash.com/photo-1625314887424-9f190599bd56?q=80&w=1000&auto=format&fit=crop" },
];

const Card = ({ children, align }: { children: React.ReactNode; align: 'left' | 'right' }) => (
  <div className={`
    relative p-6 md:p-8 
    bg-mindbend-darkBlue/20 border border-mindbend-neon/10 backdrop-blur-sm 
    rounded-2xl hover:border-mindbend-neon/50 transition-all duration-500 
    group shadow-[0_0_20px_rgba(0,0,0,0.3)]
    ${align === 'right' ? 'text-right items-end' : 'text-left items-start'}
  `}>
    {/* Glowing Corner Accents */}
    <div className={`absolute top-0 w-8 h-8 border-t-2 border-mindbend-neon/60 ${align === 'right' ? 'right-0 border-r-2 rounded-tr-xl' : 'left-0 border-l-2 rounded-tl-xl'}`}></div>
    <div className={`absolute bottom-0 w-8 h-8 border-b-2 border-mindbend-neon/60 ${align === 'right' ? 'right-0 border-r-2 rounded-br-xl' : 'left-0 border-l-2 rounded-bl-xl'}`}></div>
    
    {children}
  </div>
);

const TimelineImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-mindbend-neon/20 group">
    {/* Image with grayscale to color hover effect */}
    <img 
      src={src} 
      alt={alt} 
      className="object-cover w-full h-full grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
    />
    
    {/* Cyberpunk Overlay */}
    <div className="absolute inset-0 bg-mindbend-neon/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none mix-blend-overlay"></div>
    <div className="absolute inset-0 bg-gradient-to-t from-mindbend-black/80 to-transparent opacity-80 group-hover:opacity-50 transition-opacity"></div>
  </div>
);

export default function Theme() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll for the center line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 20%", "end 80%"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section ref={containerRef} id="theme" className="py-24 bg-mindbend-black relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-mindbend-accent/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-mindbend-neon/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        <div className="text-center mb-32">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight"
          >
            Evolution of <span className="text-mindbend-neon drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]">Intelligence</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Witness the timeline of India redefining the future.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* CENTER PROGRESS BAR */}
          <div className="absolute left-4 md:left-1/2 md:-ml-0.5 w-1 h-full bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div 
              style={{ scaleY, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-mindbend-neon via-blue-500 to-mindbend-neon shadow-[0_0_20px_#00f3ff]"
            />
          </div>

          <div className="space-y-24">
            {milestones.map((item, index) => {
              // LOGIC: Even index = Text Left, Image Right. Odd index = Image Left, Text Right.
              const isEven = index % 2 === 0;

              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative flex flex-col md:flex-row items-center justify-center md:gap-16 gap-8"
                >
                  
                  {/* --- LEFT SIDE --- */}
                  <div className={`flex-1 w-full md:w-auto pl-12 md:pl-0 ${isEven ? 'order-2 md:order-1' : 'order-2 md:order-1'}`}>
                    {/* If Even: Show Text (Aligned Right). If Odd: Show Image. */}
                    {isEven ? (
                      <div className="flex flex-col items-end">
                         <Card align="right">
                            <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-orbitron mb-2">{item.year}</h3>
                            <h4 className="text-xl text-mindbend-neon font-bold mb-4 uppercase tracking-wider">{item.title}</h4>
                            <p className="text-gray-300 leading-relaxed font-light">{item.desc}</p>
                         </Card>
                      </div>
                    ) : (
                       <TimelineImage src={item.img} alt={item.title} />
                    )}
                  </div>

                  {/* --- CENTER DOT --- */}
                  <div className="absolute left-4 md:left-1/2 md:-ml-2 top-0 md:top-1/2 md:-mt-2 flex items-center justify-center order-1 md:order-2">
                    <div className="w-4 h-4 bg-black border-2 border-mindbend-neon rounded-full z-20 shadow-[0_0_10px_#00f3ff] relative group cursor-pointer">
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 bg-mindbend-neon rounded-full animate-ping opacity-50"></div>
                        <div className="absolute inset-0 bg-mindbend-neon rounded-full opacity-20 blur-md"></div>
                    </div>
                  </div>

                  {/* --- RIGHT SIDE --- */}
                  <div className={`flex-1 w-full md:w-auto pl-12 md:pl-0 ${isEven ? 'order-3 md:order-3' : 'order-3 md:order-3'}`}>
                     {/* If Even: Show Image. If Odd: Show Text (Aligned Left). */}
                    {isEven ? (
                       <TimelineImage src={item.img} alt={item.title} />
                    ) : (
                      <div className="flex flex-col items-start">
                         <Card align="left">
                            <h3 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 font-orbitron mb-2">{item.year}</h3>
                            <h4 className="text-xl text-mindbend-neon font-bold mb-4 uppercase tracking-wider">{item.title}</h4>
                            <p className="text-gray-300 leading-relaxed font-light">{item.desc}</p>
                         </Card>
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}