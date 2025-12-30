"use client"

import { motion } from "framer-motion"
import { User, Mail, Phone } from "lucide-react"

type PersonalDetailsCardProps = {
  userData: {
    fullName: string
    email: string
    contactNumber: string
  }
}

export default function PersonalDetailsCard({ userData }: PersonalDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative"
    >
      {/* Background Shape */}
      <div className="absolute inset-0 bg-white/5 border border-white/10 transition-colors hover:border-[#33ABB9]/30" />
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-1 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
      <div className="absolute bottom-0 right-1 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

      <div className="relative p-6 z-10">
        <h3 className="text-[10px] text-gray-500 font-mono tracking-[0.2em] mb-4 uppercase">Personal Details</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-[#33ABB9] mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Full Name</p>
              <p className="text-white font-semibold">{userData.fullName || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-[#33ABB9] mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Email</p>
              <p className="text-white font-semibold">{userData.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-[#33ABB9] mt-0.5" />
            <div>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Contact</p>
              <p className="text-white font-semibold">{userData.contactNumber || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
