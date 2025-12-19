"use client";

import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Text, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

function HeroScene() {
  const { scene } = useGLTF("/models/ralph_-_detroit_become_human.glb");
  const modelRef = useRef<THREE.Group>(null);
  const titleGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const { x, y } = state.mouse;
    if (modelRef.current) {
      modelRef.current.rotation.y = THREE.MathUtils.lerp(
        modelRef.current.rotation.y,
        x * 0.4,
        0.05
      );
      modelRef.current.rotation.x = THREE.MathUtils.lerp(
        modelRef.current.rotation.x,
        -y * 0.1,
        0.05
      );
    }
    if (titleGroupRef.current) {
      titleGroupRef.current.position.x = THREE.MathUtils.lerp(
        titleGroupRef.current.position.x,
        -x * 1.2,
        0.05
      );
      titleGroupRef.current.position.y = THREE.MathUtils.lerp(
        titleGroupRef.current.position.y,
        -y * 0.5,
        0.05
      );
    }
  });

  return (
    <>
      <group ref={titleGroupRef}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[0, 4, -10]}>
            <Text fontSize={5} color="#ffffff" textAlign="center">
              MINDBEND
              <meshStandardMaterial
                emissive="#00ffff"
                emissiveIntensity={2}
                toneMapped={false}
              />
            </Text>
            <Text
              fontSize={1.5}
              color="#00ffff"
              position={[10, -3, 0.5]}
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
        scale={6}
        position={[0, -14, 9]}
      />
    </>
  );
}

export default function Hero() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(
          0,
          Math.min(1, 1 - -rect.top / window.innerHeight)
        );
        setScrollOpacity(scrollProgress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full"
      style={{ opacity: scrollOpacity }}
    >
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <Suspense fallback={null}>
          <HeroScene />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* SYMBIONT Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-12 pointer-events-none z-20">
        <div className="self-end text-right text-white max-w-md mt-auto">
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            SYMBIONT
          </h2>
          <p className="text-xl font-medium tracking-widest text-blue-200 mt-1 uppercase">
            The Cognitive Genesis
          </p>
          <div className="h-[1px] w-full bg-gradient-to-l from-cyan-500 to-transparent my-4 opacity-50"></div>
          <p className="text-sm opacity-60 leading-relaxed italic">
            Forging the Future of Indian Intelligence
          </p>
        </div>
      </div>

      {/* Gradient overlay for smooth transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020205] to-transparent pointer-events-none z-10" />
    </section>
  );
}
