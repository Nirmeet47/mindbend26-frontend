'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string | null;
  color: string;
  delay?: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, label, value, sub, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-white/5 transform skew-x-[-5deg] group-hover:bg-white/10 transition-colors border border-white/10 group-hover:border-[#00F0FF]/50" />
      <div className="relative p-6 px-8 z-10 flex flex-col h-full min-h-[140px]">
        <div className="flex justify-between items-start mb-4">
          <Icon className={`w-6 h-6 ${color}`} />
          <div className="w-2 h-2 bg-white/20 group-hover:bg-[#00F0FF] transition-colors" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-share-tech-mono tracking-[0.2em] mb-1">{label}</p>
          <p className="font-orbitron font-bold text-xl tracking-wide">{value}</p>
          {sub && (
            <p className={`text-[10px] mt-2 font-mono uppercase tracking-wider opacity-60 ${color === 'text-[#FF4D00]' ? 'text-[#FF4D00]' : 'text-[#00F0FF]'}`}>
              [{sub}]
            </p>
          )}
        </div>
      </div>
      {/* Corner details */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30 group-hover:border-[#00F0FF] transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30 group-hover:border-[#00F0FF] transition-colors" />
    </motion.div>
  );
};

export default InfoCard;
