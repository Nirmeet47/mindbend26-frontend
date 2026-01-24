import type React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen bg-[#02040a] flex items-center justify-center p-4 overflow-hidden font-sans">
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

            {/* Main Card Container */}
            <div className="relative z-10 w-full max-w-md bg-[#050A10] border border-[#1e293b]/50 rounded-[2rem] p-8 md:p-10 shadow-2xl overflow-hidden backdrop-blur-md">

                {/* Greenish Glow Effect (Top Left, Shining Down) */}
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 blur-[90px] rounded-full pointer-events-none mix-blend-screen" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-500/20 via-transparent to-transparent opacity-50" />

                {/* Grid Pattern Decoration (Top Right) */}
                <div className="absolute top-8 right-8 opacity-20 pointer-events-none">
                    <div className="grid grid-cols-5 gap-1.5">
                        {[...Array(25)].map((_, i) => (
                            <div key={i} className="w-[3px] h-[3px] bg-cyan-500 rounded-full" />
                        ))}
                    </div>
                </div>

                {/* Header */}
                <div className="mb-10 relative z-20">
                    <h1 className="text-3xl md:text-4xl text-white font-bold tracking-tight mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-gray-400 text-sm font-medium tracking-wide">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Children content (The Form) */}
                <div className="relative z-20">
                    {children}
                </div>

            </div>
        </div>
    );
}
