import type React from 'react';
import dynamic from 'next/dynamic';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
}

// Lazy load the background scene
const BackgroundScene = dynamic(() => import('@/components/events/BackgroundScene'), {
    ssr: false,
});

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen bg-[#030303] flex items-center justify-center p-4 overflow-hidden selection:bg-[#33ABB9] selection:text-white font-rajdhani tracking-wide">
            {/* Background Video - Increased visibility */}
            <video
                className="fixed inset-0 w-full h-full object-cover opacity-30 pointer-events-none mix-blend-screen z-0"
                src="/videos/auth.mp4"
                autoPlay
                muted
                loop
                playsInline
            />

            {/* Background 3D Scene - Reduced opacity */}
            <div className="fixed inset-0 z-0 opacity-10 pointer-events-none mix-blend-screen">
                <BackgroundScene />
            </div>

            {/* Cyberpunk Grid Overlay */}
            <div
                className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(51, 171, 185, 0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(51, 171, 185, 0.4) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                }}
            />

            {/* Vignette Overlay */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] pointer-events-none z-0" />

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-lg animate-in fade-in duration-700">
                {/* Auth Card */}
                <div className="relative">
                    {/* Background Shape - No hover effect */}
                    <div className="absolute inset-0 bg-white/5 border border-white/10 backdrop-blur-xl" />

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#33ABB9]" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#33ABB9]" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

                    {/* Content */}
                    <div className="relative p-8 md:p-12 z-10">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl text-white font-bold tracking-[0.2em] uppercase mb-4 animate-in slide-in-from-top duration-500">
                                {title}
                            </h1>
                            <div className="h-[2px] w-20 mx-auto bg-gradient-to-r from-transparent via-[#33ABB9] to-transparent animate-in fade-in duration-700 delay-200" />
                        </div>

                        {/* Children content (The Form) */}
                        <div className="relative animate-in fade-in slide-in-from-bottom duration-500 delay-300">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
