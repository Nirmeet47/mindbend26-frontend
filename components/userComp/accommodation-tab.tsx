"use client"

import { motion } from "framer-motion"
import { Home, Building, DoorOpen, Calendar, Check } from "lucide-react"

type Accommodation = {
  id: number
  hostel: string
  room: string
  checkIn: string
  checkOut: string
  status: string
}

type AccommodationTabProps = {
  accommodations: Accommodation[]
}

export default function AccommodationTab({ accommodations }: AccommodationTabProps) {
  if (accommodations.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-white/5 border border-white/10" />
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]" />
        <div className="relative p-12 text-center">
          <Home className="w-12 h-12 text-[#33ABB9]/40 mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">You have no accommodation bookings yet.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {accommodations.map((booking, index) => (
        <motion.div
          key={booking.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative group"
        >
          {/* Background Shape */}
          <div className="absolute inset-0 bg-white/5 border border-white/10 transition-all group-hover:border-[#33ABB9]/30" />

          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]" />

          <div className="relative p-6 z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Building className="w-4 h-4 text-[#33ABB9] mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Hostel</p>
                  <p className="text-white font-bold text-lg">{booking.hostel}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DoorOpen className="w-4 h-4 text-[#33ABB9] mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Room</p>
                  <p className="text-white font-bold text-lg">{booking.room}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#33ABB9] mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Check-in</p>
                  <p className="text-white font-semibold">{booking.checkIn}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#33ABB9] mt-0.5" />
                <div>
                  <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase mb-1">Check-out</p>
                  <p className="text-white font-semibold">{booking.checkOut}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="px-4 py-1 text-xs font-bold uppercase tracking-widest font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                Booked
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
