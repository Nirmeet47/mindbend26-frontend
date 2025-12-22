import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem: React.FC = () => {
  const count = 400;
  const mesh = useRef<THREE.Points>(null);

  // Generate random positions and speeds
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    const speeds = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread wide and deep
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 30 - 5;

      temp[i * 3] = x;
      temp[i * 3 + 1] = y;
      temp[i * 3 + 2] = z;

      // Random drift speed
      speeds[i] = Math.random() * 0.02 + 0.01;
    }

    return { positions: temp, speeds };
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;

    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const { mouse } = state;

    for (let i = 0; i < count; i++) {
      // Move particles towards camera (positive Z)
      positions[i * 3 + 2] += particles.speeds[i];

      // Reset if passed camera or too close
      if (positions[i * 3 + 2] > 8) {
        positions[i * 3 + 2] = -20; // Send to back
        positions[i * 3] = (Math.random() - 0.5) * 40; // Randomize X
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // Randomize Y
      }
    }

    mesh.current.geometry.attributes.position.needsUpdate = true;

    // Parallax effect based on mouse
    const rotationX = -mouse.y * 0.05;
    const rotationY = mouse.x * 0.05;

    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, rotationX, 0.1);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, rotationY, 0.1);
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#ffaa33" // Gold/Orange
        transparent
        opacity={0.6}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleSystem;