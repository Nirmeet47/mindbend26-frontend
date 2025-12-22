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

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 border border-[#FF4D00] px-3 py-1 text-xs text-[#FF4D00] font-share-tech-mono uppercase tracking-widest mb-4">
                <span className="w-2 h-2 bg-[#FF4D00] animate-pulse rounded-full" />
                Prize_Distribution
              </div>
              <div className="text-6xl md:text-8xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                ₹{prizeMoney.toLocaleString()}
              </div>
              <p className="text-gray-500 font-rajdhani tracking-[0.3em] uppercase mt-2">Total Prize Pool Allocated</p>
            </div>

            <div className="flex-1 w-full md:w-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: '1ST_PLACE', value: prizeDistribution.first, color: 'from-amber-300 to-amber-600' },
                  { label: '2ND_PLACE', value: prizeDistribution.second, color: 'from-slate-300 to-slate-500' },
                  { label: '3RD_PLACE', value: prizeDistribution.third, color: 'from-orange-700 to-orange-900' }
                ].map((prize, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 relative group hover:border-[#FF4D00]/50 transition-colors">
                    <p className="text-[10px] text-gray-500 font-share-tech-mono mb-2">{prize.label}</p>
                    <p className="text-2xl font-bold font-orbitron">₹{prize.value.toLocaleString()}</p>
                    <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${prize.color} opacity-50 group-hover:opacity-100 transition-opacity`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default PrizePoolSection;
