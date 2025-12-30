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
      className="relative"
    >
      <div className="absolute inset-0 bg-white/5 transform skew-x-[-5deg] transition-colors border border-white/10" />
      
      {/* Corner borders positioned precisely to match the tilted card corners */}
      <div className="absolute top-0 left-1 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9] transform skew-x-[-5deg]" />
      <div className="absolute bottom-0 right-1 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9] transform skew-x-[-5deg]" />
      
      <div className="relative p-6 px-8 z-10 flex flex-col h-full min-h-35">
        <div className="flex justify-between items-start mb-4">
          <Icon className={`w-6 h-6 ${color}`} />
          <div className="w-2 h-2 bg-white/20" />
        </div>
        <div>
          <p className="text-[10px] text-gray-500 font-share-tech-mono tracking-[0.2em] mb-1">{label}</p>
          <p className="font-orbitron font-bold text-xl tracking-wide">{value}</p>
          {sub && (
            <p className={`text-[10px] mt-2 font-mono uppercase tracking-wider opacity-60 ${color === 'text-[#FF4D00]' ? 'text-[#33ABB9]' : 'text-[#33ABB9]'}`}>
              [{sub}]
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InfoCard;
