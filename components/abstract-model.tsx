'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AbstractModelProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

export function AbstractModel({
  position = [0, 0, 0],
  scale = 1,
  rotationSpeed = 0.01
}: AbstractModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Load the GLB model
  const { scene } = useGLTF('/models/abstract-3d-model.glb');

  // Animate the model rotation
  useFrame(() => {
    if (groupRef.current) {
      // Rotate the entire model on Y-axis for a spinning effect
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/abstract-3d-model.glb');
