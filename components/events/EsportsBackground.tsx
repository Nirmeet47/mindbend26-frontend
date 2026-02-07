'use client';
import React from 'react';

const EsportsBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Dark gradient base */}
            <div className="absolute inset-0 bg-linear-to-b from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a]" />
            
            {/* Gaming grid effect */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `
                        linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px'
                }} />
            </div>

            {/* Animated glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl animate-pulse delay-500" />
            
            {/* Neon accent lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-500/50 to-transparent" />
            
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-32 h-32">
                <div className="absolute top-4 left-0 w-16 h-0.5 bg-linear-to-r from-purple-500/80 to-transparent" />
                <div className="absolute top-0 left-4 w-0.5 h-16 bg-linear-to-b from-purple-500/80 to-transparent" />
            </div>
            <div className="absolute top-0 right-0 w-32 h-32">
                <div className="absolute top-4 right-0 w-16 h-0.5 bg-linear-to-l from-cyan-500/80 to-transparent" />
                <div className="absolute top-0 right-4 w-0.5 h-16 bg-linear-to-b from-cyan-500/80 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 w-32 h-32">
                <div className="absolute bottom-4 left-0 w-16 h-0.5 bg-linear-to-r from-cyan-500/80 to-transparent" />
                <div className="absolute bottom-0 left-4 w-0.5 h-16 bg-linear-to-t from-cyan-500/80 to-transparent" />
            </div>
            <div className="absolute bottom-0 right-0 w-32 h-32">
                <div className="absolute bottom-4 right-0 w-16 h-0.5 bg-linear-to-l from-purple-500/80 to-transparent" />
                <div className="absolute bottom-0 right-4 w-0.5 h-16 bg-linear-to-t from-purple-500/80 to-transparent" />
            </div>
        </div>
    );
};

export default EsportsBackground;
