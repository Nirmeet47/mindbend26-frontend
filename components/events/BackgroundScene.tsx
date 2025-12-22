'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleSystem from './Particles';

const BackgroundScene: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 35 }}
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: "high-performance"
                }}
                dpr={[1, 2]}
            >
                <color attach="background" args={['#000000']} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <ParticleSystem />
            </Canvas>
        </div>
    );
};

export default BackgroundScene;
