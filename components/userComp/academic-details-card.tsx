"use client"

import { motion } from "framer-motion"
import { GraduationCap, Building } from "lucide-react"

type AcademicDetailsCardProps = {
  userData: {
    collegeName: string
    yearOfStudy: string
  }
}

export default function AcademicDetailsCard({ userData }: AcademicDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      {/* Background Shape */}
      <div className="absolute inset-0 bg-white/5 border border-white/10 transition-colors hover:border-[#33ABB9]/30" />

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]" />

      <div className="relative p-6 z-10">
        <h3 className="text-[10px] text-gray-500 font-mono tracking-[0.2em] mb-4 uppercase">Academic Details</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Building className="w-4 h-4 text-[#33ABB9] mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">College</p>
              <p className="text-white font-semibold">{userData.collegeName || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <GraduationCap className="w-4 h-4 text-[#33ABB9] mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Year of Study</p>
              <p className="text-white font-semibold">{userData.yearOfStudy ? `Year ${userData.yearOfStudy}` : "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
