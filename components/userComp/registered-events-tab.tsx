"use client"

import { ChevronRight, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

type Event = {
  id: string
  name: string
  category: string
  date: string
  status: "registered" | "completed"
}

type RegisteredEventsTabProps = {
  events: Event[]
}

export default function RegisteredEventsTab({ events }: RegisteredEventsTabProps) {
  const router = useRouter()

  const handleEventClick = (event: Event) => {
    router.push(`/${event.category.toLowerCase()}/${event.id}`)
  }

  if (events.length === 0) {
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
          <p className="text-gray-400 font-mono text-sm">You haven't registered for any events yet.</p>
        </div>
      </motion.div>
    )
  }
  
  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => handleEventClick(event)}
          className="relative group cursor-pointer"
        >
          {/* Background Shape */}
          <div className="absolute inset-0 bg-white/5 border border-white/10 transition-all group-hover:border-[#33ABB9]/30 group-hover:bg-[#33ABB9]/5" />
          
          {/* Corner Accents */}
          <div className="absolute top-0 left-1 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
          <div className="absolute bottom-0 right-1 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

          <div className="relative p-6 z-10 flex items-center justify-between">
            <div>
              <h4 className="text-white font-bold text-lg mb-1 group-hover:text-[#33ABB9] transition-colors">{event.name}</h4>
              <div className="flex gap-4 text-gray-400 text-sm">
                <span className="text-[#33ABB9] font-mono uppercase text-xs">{event.category}</span>
                <span className="font-mono text-xs">{event.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1 text-xs font-bold uppercase tracking-widest font-mono ${
                  event.status === "registered"
                    ? "bg-[#33ABB9]/20 text-[#33ABB9] border border-[#33ABB9]/30"
                    : "bg-green-500/20 text-green-400 border border-green-500/30"
                }`}
              >
                {event.status === "registered" ? "Registered" : "Completed"}
              </span>
              <ChevronRight className="text-[#33ABB9] group-hover:translate-x-1 transition-transform" size={20} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
