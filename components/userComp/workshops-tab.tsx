"use client"

import { ChevronRight, Calendar, MapPin, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

type Workshop = {
  _id: string;
  name: string;
  slug: string;
  workshopDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  instructor: {
    name: string;
    company: string;
    photo: string;
    linkedin: string;
  };
  registeredAt: string;
}

type WorkshopsTabProps = {
  workshops: Workshop[]
}

export default function WorkshopsTab({ workshops }: WorkshopsTabProps) {
  const router = useRouter()

  if (workshops.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/5 border border-white/10" />
        <div className="absolute top-0 left-1 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
        <div className="absolute bottom-0 right-1 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />
        <div className="relative p-12 text-center">
          <Calendar className="w-12 h-12 text-[#33ABB9]/40 mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">You haven't registered for any workshops yet.</p>
        </div>
      </motion.div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {workshops.map((workshop, index) => (
        <motion.div
          key={workshop._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group cursor-pointer"
          onClick={() => router.push(`/workshops/${workshop.slug}`)}
        >
          {/* Background Shape */}
          <div className="absolute inset-0 bg-white/5 border border-white/10 transition-all group-hover:border-[#33ABB9]/30 group-hover:bg-[#33ABB9]/5" />
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-1 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
          <div className="absolute bottom-0 right-1 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

          <div className="relative p-6 z-10 flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold text-lg mb-2 group-hover:text-[#33ABB9] transition-colors">{workshop.name}</h4>
              <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                <span className="text-[#33ABB9] font-mono text-xs flex items-center gap-1">
                  <span className="text-gray-500">By</span> {workshop.instructor.name}
                </span>
                <span className="font-mono text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(workshop.workshopDate)}
                </span>
                {workshop.startTime && (
                  <span className="font-mono text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workshop.startTime}
                  </span>
                )}
              </div>
              {workshop.venue && (
                <div className="text-gray-500 text-xs mt-2 flex items-center gap-1 font-mono">
                  <MapPin className="w-3 h-3" />
                  {workshop.venue}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1 text-xs font-bold uppercase tracking-widest font-mono bg-[#33ABB9]/20 text-[#33ABB9] border border-[#33ABB9]/30">
                Registered
              </span>
              <ChevronRight className="text-[#33ABB9] group-hover:translate-x-1 transition-transform" size={20} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
