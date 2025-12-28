"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Text, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function HeroScene({ isMobile }: { isMobile: boolean }) {
  const { scene } = useGLTF("/models/ralph_-_detroit_become_human.glb");
  const { viewport } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const titleGroupRef = useRef<THREE.Group>(null);

  // 1. Dynamic Scaling Logic
  // Mobile uses viewport-relative units, Desktop uses fixed units
  const mainTitleSize = isMobile ? viewport.width * 0.18 : 6; 
  const subTitleSize = isMobile ? viewport.width * 0.06 : 2;
  const modelScale = isMobile ? viewport.width * 0.6 : 7;
  
  // 2. Position Adjustments
  // Mobile needs the model higher (-6) vs Desktop (-12)
  const modelPositionY = isMobile ? -8.1 : -16.5; 
  const titleZ = isMobile ? -1 : -10; // Desktop depth vs Mobile flatness
  const titleY = isMobile ? 3 : 4;

  useFrame((state) => {
    const { x, y } = state.mouse;
    
    // Smooth Model Rotation
    if (modelRef.current) {
      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, x * 0.4, 0.05);
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, -y * 0.1, 0.05);
    }
    
    // Mouse Parallax (Only active/visible on Desktop layout)
    if (titleGroupRef.current && !isMobile) {
      titleGroupRef.current.position.x = THREE.MathUtils.lerp(titleGroupRef.current.position.x, -x * 1.2, 0.05);
      titleGroupRef.current.position.y = THREE.MathUtils.lerp(titleGroupRef.current.position.y, -y * 0.5, 0.05);
    }
  });

  return (
    <>
      <group ref={titleGroupRef}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, titleY, titleZ]}>
            <Text fontSize={mainTitleSize} color="#ffffff" textAlign="center">
              MINDBEND
              <meshStandardMaterial emissive="#00ffff" emissiveIntensity={2} toneMapped={false} />
            </Text>
            <Text
              fontSize={subTitleSize}
              color="#00ffff"
              // Offset to the right on Desktop, centered on Mobile
              position={isMobile ? [2, -1, 0.5] : [10, -3.5, 0.5]}
              fontStyle="italic"
            >
              2026
            </Text>
          </group>
        </Float>
      </group>

      <primitive
        ref={modelRef}
        object={scene}
        scale={modelScale}
        position={[0, modelPositionY, 9]}
      />
    </>
  );
}

export default function Hero() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Handle Responsive Detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, 1 - -rect.top / window.innerHeight));
        setScrollOpacity(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="relative h-screen w-full bg-[#020205]" 
      style={{ opacity: scrollOpacity }}
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <Suspense fallback={null}>
          <HeroScene isMobile={isMobile} />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* SYMBIONT Overlay */}
      <div className={`absolute inset-0 flex flex-col p-8 md:p-12 pointer-events-none z-20 
        ${isMobile ? "justify-end items-center text-center" : "justify-between items-end text-right"}`}>
        
        <div className={`text-white mt-auto max-w-md ${isMobile ? "mb-10" : ""}`}>
          <h2 className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)] tracking-wide animate-fadeIn
            ${isMobile ? "text-5xl" : "text-6xl lg:text-7xl"}`} 
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
            SYMBIONT
          </h2>
          
          <p className="text-sm md:text-xl font-medium tracking-widest text-blue-200 mt-2 uppercase animate-slideUp" 
             style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            The Cognitive Genesis
          </p>
          
          <div className={`h-[1px] bg-gradient-to-r from-cyan-500 to-transparent my-4 opacity-50 animate-slideUp 
            ${isMobile ? "w-32 mx-auto via-cyan-500 to-transparent" : "w-full ml-auto"}`}></div>
          
          <p className="text-xs md:text-sm opacity-60 leading-relaxed italic animate-slideUp" 
             style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Forging the Future of Indian Intelligence
          </p>
        </div>
      </div>

      {/* Smooth Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020205] to-transparent pointer-events-none z-10" />

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out forwards; }
        .animate-slideUp { opacity: 0; animation: slideUp 0.8s ease-out forwards; }
        .animate-slideUp:nth-child(2) { animation-delay: 0.2s; }
        .animate-slideUp:nth-child(3) { animation-delay: 0.4s; }
        .animate-slideUp:nth-child(4) { animation-delay: 0.6s; }
      `}</style>
    </section>
  );
}