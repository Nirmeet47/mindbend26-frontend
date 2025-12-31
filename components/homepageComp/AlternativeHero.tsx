"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Drone configurations based on screen size
  const getDroneConfigs = () => {
    if (screenSize === "mobile") {
      // 2 drones for mobile
      return [
        {
          position: "left",
          top: "sm:top-40 top-32",
          left: "sm:left-[10%] left-[5%]",
          tilt: 1.8,
          cameraZ: 5.5,
        },
        {
          position: "right",
          top: "sm:top-40 top-32",
          right: "sm:right-[10%] right-[5%]",
          tilt: -1.8,
          cameraZ: 5.5,
        },
      ];
    } else if (screenSize === "tablet") {
      // 3 drones for tablet
      return [
        {
          position: "center-top",
          top: "top-[-5%]",
          left: "left-[50%] -translate-x-[50%]",
          tilt: 0,
          cameraZ: 6,
        },
        {
          position: "left",
          top: "top-40",
          left: "left-[12%]",
          tilt: 1.8,
          cameraZ: 5.5,
        },
        {
          position: "right",
          top: "top-40",
          right: "right-[12%]",
          tilt: -1.8,
          cameraZ: 5.5,
        },
      ];
    } else {
      // 6 drones for desktop (current layout)
      return [
        {
          position: "center-top",
          top: "top-[-2%]",
          left: "left-[40%]",
          tilt: 0,
          cameraZ: 6,
        },
        {
          position: "left-mid",
          top: "top-45",
          left: "left-[15%]",
          tilt: 1.8,
          cameraZ: 5.5,
        },
        {
          position: "right-mid",
          top: "top-45",
          right: "right-[15%]",
          tilt: -1.8,
          cameraZ: 5.5,
        },
        {
          position: "left-corner",
          top: "top-[-5]",
          left: "left-[1%]",
          tilt: 1.6,
          cameraZ: 6,
        },
        {
          position: "right-corner",
          top: "top-[-5]",
          right: "right-[1%]",
          tilt: -1.6,
          cameraZ: 6,
        },
        {
          position: "left-bottom",
          top: "top-15",
          left: "left-[23%]",
          tilt: 1.2,
          cameraZ: 8,
        },
        {
          position: "right-bottom",
          top: "top-15",
          right: "right-[23%]",
          tilt: -1.2,
          cameraZ: 8,
        },
      ];
    }
  };

  const droneConfigs = getDroneConfigs();

  const DroneCanvas = ({ config }: any) => (
    <Canvas camera={{ position: [0, 0, config.cameraZ], fov: 50 }}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} />
      <pointLight position={[0, 2, 3]} intensity={0.8} color="#00d9ff" />
      <Suspense fallback={null}>
        <DroneModel tiltDirection={config.tilt} />
      </Suspense>
    </Canvas>
  );

  return (
    <section className="relative w-full h-screen overflow-hidden pt-50">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center translate-y-20"
        style={{ backgroundImage: "url('/images/hero_bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Render drones based on screen size */}
      {droneConfigs.map((config, idx) => (
        <div
          key={idx}
          className={`absolute w-64 h-64 sm:w-80 sm:h-80 z-20 pointer-events-none ${
            config.top
          } ${config.left || ""} ${config.right || ""}`}
        >
          <DroneCanvas config={config} />
        </div>
      ))}

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
