"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

/* ===================== DRONE MODEL ===================== */

const DroneModel = ({ tiltDirection }: { tiltDirection: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  const { scene, animations } = useGLTF("/models/drone_concept.glb");

  // ✅ CORRECT way to clone Sketchfab animated models
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Bind animations to the SAME hierarchy
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    if (!actions) return;

    // ▶️ CONTINUOUS animation (NO hover triggers)
    Object.values(actions).forEach((action) => {
      if (!action) return;
      action.reset();
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.timeScale = 1.5;
      action.play();
    });

    return () => {
      Object.values(actions).forEach((action) => {
        if (!action) return;
        action.stop();
      });
    };
  }, [actions]);

  return (
    <group
      ref={groupRef}
      rotation={[
        Math.PI * -0.08,
        tiltDirection * Math.PI * 0.1,
        tiltDirection * Math.PI * -0.02,
      ]}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

/* ===================== HERO SECTION ===================== */

const AlternativeHero: React.FC = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden pt-50">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center translate-y-20"
        style={{ backgroundImage: "url('/images/hero_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-[-2%] left-[40%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={0} />
          </Suspense>
        </Canvas>
      </div>
      {/* Left Drone */}
      <div className="absolute top-45 left-[15%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={1.8} />
          </Suspense>
        </Canvas>
      </div>
      
      <div className="absolute top-45 right-[15%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5.5], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={-1.8} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-[-5] left-[1%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={1.6} />
          </Suspense>
        </Canvas>
      </div>

      
      <div className="absolute top-[-5] right-[1%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={-1.6} />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute top-15 left-[23%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={1.2} />
          </Suspense>
        </Canvas>
      </div>{" "}
      <div className="absolute top-15 right-[23%] w-80 h-80 z-20 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
          <Suspense fallback={null}>
            <DroneModel tiltDirection={-1.2} />
          </Suspense>
        </Canvas>
      </div>
      {/* Right Drone */}
      
      {/* Title */}
      <div className="relative z-[-10] text-center">
        <h1
          className="text-white"
          style={{
            fontSize: "clamp(3rem, 15vw, 11rem)",
            fontWeight: 900,
            letterSpacing: "0.2em",
            fontFamily: "Barlow Condensed, sans-serif",
            textShadow: `
              0 0 20px rgba(0, 217, 255, 0.8),
              0 0 40px rgba(0, 217, 255, 0.5)
            `,
          }}
        >
          MINDBEND
        </h1>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-[#020205] to-transparent z-10" />
    </section>
  );
};

export default AlternativeHero;

/* ===================== PRELOAD ===================== */
useGLTF.preload("/models/drone_concept.glb");
