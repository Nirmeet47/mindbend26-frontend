'use client';

export default function ComingSoon({
  pageName = 'Page',
}: {
  pageName?: string;
}) {

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gray-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-gray-700 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gray-800 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Page Name */}
          <p 
            className="text-4xl sm:text-5xl lg:text-6xl tracking-widest uppercase mb-4"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              color: '#e5e7eb',
              textShadow: '0 2px 8px rgba(0,0,0,0.25)',
              letterSpacing: '0.15em'
            }}
          >
            {pageName}
          </p>

          {/* Main heading */}
          <h1 
            className="text-6xl sm:text-7xl lg:text-8xl mb-0 bg-linear-to-r from-white via-gray-300 to-gray-400 bg-clip-text uppercase"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 900,
              textShadow: '0 2px 8px rgba(0,0,0,0.25)',
              lineHeight: '1',
            }}
          >
            Coming Soon
          </h1>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
