import type React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen bg-[#02040a] flex items-center justify-center p-4 overflow-hidden">
            {/* Background Video */}
            <video
                className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none mix-blend-screen"
                src="/videos/auth.mp4"
                autoPlay
                muted
                loop
                playsInline
            />

            {/* Vignette & Texture Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none" />

            {/* Main HUD Container */}
            <div className="relative z-10 w-full max-w-lg">

                {/* Stepped Frame Construction */}
                <div className="relative w-full aspect-auto">

                    {/* SVG Border Layer */}
                    <div className="absolute -inset-[2px] pointer-events-none z-20 filter drop-shadow-[0_0_2px_rgba(6,182,212,0.5)]">
                        <svg className="w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#22d3ee" />
                                    <stop offset="100%" stopColor="#0891b2" />
                                </linearGradient>
                            </defs>

                            {/* Main Outer Border */}
                            <path
                                d="
                   M 2 2 
                   H 80 L 100 20 H 300 L 320 2 H 398
                   V 598
                   H 320 L 300 578 H 100 L 80 598 H 2
                   Z
                 "
                                fill="none"
                                stroke="url(#neonGradient)"
                                strokeWidth="2"
                                vectorEffect="non-scaling-stroke"
                            />

                            {/* Inner Border (Double Line Effect) */}
                            <path
                                d="
                   M 8 8 
                   H 76 L 96 26 H 304 L 324 8 H 392
                   V 592
                   H 324 L 304 572 H 96 L 76 592 H 8
                   Z
                 "
                                fill="none"
                                stroke="url(#neonGradient)"
                                strokeWidth="1"
                                opacity="0.5"
                                vectorEffect="non-scaling-stroke"
                            />

                        </svg>
                    </div>

                    {/* Inner Content Box (Clipped) - Adjusted opacity for sync */}
                    <div
                        className="relative bg-[#02040a]/85 backdrop-blur-xl p-8 md:p-12"
                        style={{
                            clipPath: 'polygon(0% 0%, 20% 0%, 25% 20px, 75% 20px, 80% 0%, 100% 0%, 100% 100%, 80% 100%, 75% calc(100% - 20px), 25% calc(100% - 20px), 20% 100%, 0% 100%)'
                        }}
                    >
                        {/* Header */}
                        <div className="text-center mb-10 mt-4 relative group">
                            <h1
                                className="text-5xl md:text-6xl text-white font-bold tracking-[0.2em] uppercase font-circuit"
                                style={{
                                    textShadow: '0 0 5px rgba(34,211,238,0.3)'
                                }}
                            >
                                {title}
                            </h1>
                            {/* Reduced glow on underline */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-cyan-500/80 shadow-[0_0_5px_rgba(6,182,212,0.4)]" />
                        </div>

                        {/* Children content (The Form) */}
                        <div className="relative z-20">
                            {children}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
