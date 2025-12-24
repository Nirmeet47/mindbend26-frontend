'use client';

import { motion } from 'framer-motion';
import { PrizeDistribution } from '@/types';

interface PrizePoolSectionProps {
  prizeMoney: number;
  prizeDistribution: PrizeDistribution;
}

const PrizePoolSection: React.FC<PrizePoolSectionProps> = ({ prizeMoney, prizeDistribution }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="relative p-[1px] bg-gradient-to-r from-transparent via-[#FF4D00] to-transparent"
      >
        <div className="bg-[#050505] p-8 md:p-12 relative overflow-hidden">
          {/* Background Grid */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(#FF4D00 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />
            <div className={`relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20 ${(prizeDistribution?.first > 0 || prizeDistribution?.second > 0 || prizeDistribution?.third > 0) ? '' : 'justify-center'}`}>
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 border-l-2 border-[#FF4D00] pl-3 mb-3">
              <span className="text-[#FF4D00] font-share-tech-mono text-xs uppercase tracking-[0.2em]">Total Prize Pool</span>
              </div>
              <div className="text-5xl md:text-6xl font-black font-orbitron text-white tracking-tight">
              ₹{prizeMoney.toLocaleString()}  
              </div>
            </div>

            {(prizeDistribution?.first > 0 || prizeDistribution?.second > 0 || prizeDistribution?.third > 0) && (
              <div className="flex-1 w-full lg:w-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden">
              {[
                { label: '1st Place', value: prizeDistribution.first, color: 'text-amber-400' },
                { label: '2nd Place', value: prizeDistribution.second, color: 'text-slate-300' },
                { label: '3rd Place', value: prizeDistribution.third, color: 'text-orange-600' }
              ].filter(prize => prize.value > 0).map((prize, i) => (
                <div key={i} className="bg-[#050505] p-4 md:p-6 text-center group hover:bg-white/5 transition-colors relative">
                <div className={`text-xs md:text-sm font-share-tech-mono ${prize.color} mb-1 uppercase tracking-wider`}>{prize.label}</div>
                <div className="text-lg md:text-2xl font-bold font-orbitron text-white">₹{prize.value.toLocaleString()}</div>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-current opacity-0 group-hover:opacity-100 transition-opacity ${prize.color}`} />
                </div>
              ))}
              </div>
              </div>
            )}
            </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PrizePoolSection;
