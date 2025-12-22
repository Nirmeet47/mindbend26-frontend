'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { EventStatus } from '@/types';

interface RegistrationCTAProps {
  eventStatus: EventStatus;
  registrationDeadline: string;
  unstopLink?: string;
  psLink?: string;
  formatDate: (date: string) => string;
}

const RegistrationCTA: React.FC<RegistrationCTAProps> = ({
  eventStatus,
  registrationDeadline,
  unstopLink,
  psLink,
  formatDate
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-y border-white/10 bg-white/5 p-12 md:p-16 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4D00]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4D00]" />

        {/* Background pulse */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF4D00]/5 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

        <h3 className="text-4xl md:text-6xl font-black uppercase mb-8 font-orbitron tracking-tighter">
          Ready to <span className="text-[#FF4D00] inline-block transform hover:skew-x-12 transition-transform">Dominate?</span>
        </h3>

        {eventStatus === 'OPEN' ? (
          <div className="space-y-8 relative z-10">
            <p className="text-gray-400 max-w-2xl mx-auto font-rajdhani text-lg">
              Portal closes on <span className="text-white font-bold">{formatDate(registrationDeadline)}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              {unstopLink && (
                <a
                  href={unstopLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/register relative px-8 py-4 bg-[#FF4D00] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                  <span className="relative z-10 flex items-center gap-2">
                    REGISTER_NOW <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              )}
              {psLink && (
                <a
                  href={psLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/ps relative px-8 py-4 border border-white text-white font-bold font-orbitron tracking-wider text-lg overflow-hidden transition-colors duration-300 hover:text-black"
                >
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover/ps:translate-x-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center gap-2">
                    READ_PROBLEM_STATEMENT <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 text-2xl font-bold font-orbitron tracking-widest border border-red-500/50 inline-block px-6 py-2 bg-red-500/10">REGISTRATION_CLOSED</p>
            <p className="text-gray-500 font-share-tech-mono">
              Access denied. Max capacity reached or deadline exceeded.
            </p>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default RegistrationCTA;
