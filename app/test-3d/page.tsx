'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { AbstractModel } from '@/components/abstract-model';

export default function Test3DPage() {
    return (
        <div className="w-full h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header Info */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/50 to-transparent">
                <h1 className="text-3xl font-bold text-white mb-2">Abstract 3D Model Test</h1>
                <p className="text-gray-300 text-sm">
                    🖱️ Click and drag to rotate • Scroll to zoom • Watch the disc spin
                </p>
            </div>

            {/* 3D Canvas */}
            <Canvas shadows>
                <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
                <pointLight position={[10, -10, -5]} intensity={0.5} color="#3b82f6" />

                {/* Environment for reflections */}
                <Environment preset="city" />

                {/* 3D Model with Suspense for loading */}
                <Suspense fallback={null}>
                    <AbstractModel
                        position={[0, 0, 0]}
                        scale={1}
                        rotationSpeed={0.01}
                    />
                </Suspense>

                {/* Camera Controls */}
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={3}
                    maxDistance={20}
                    autoRotate={false}
                />
            </Canvas>

            {/* Loading Indicator */}
            <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm">Model: Abstract 3D</p>
            </div>
        </div>
    );
}
