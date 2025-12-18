"use client";

import React, { Suspense, useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

function RisingParticles() {
  const count = 1500;
  const mesh = useRef<THREE.Points>(null);

  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        speed: 0.01 + Math.random() * 0.03,
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 20,
      });
    }
    return temp;
  });

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame(() => {
    particles.forEach((particle, i) => {
      particle.y += particle.speed;
      if (particle.y > 20) {
        particle.y = -20;
        particle.x = (Math.random() - 0.5) * 40;
      }
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;
    });
    if (mesh.current) {
      mesh.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#00d2ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export default function HomeBg() {
  return (
    <div className="fixed inset-0 z-0 bg-[#020205]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#00ffff" />
        <Suspense fallback={null}>
          <RisingParticles />
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
}