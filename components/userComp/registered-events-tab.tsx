"use client"

import { ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"

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
    return <div className="text-cyan-300/60 text-center py-8">You haven't registered for any events yet.</div>;
  }
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => handleEventClick(event)}
          className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all flex items-center justify-between cursor-pointer"
          style={{
            clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          <div>
            <h4 className="text-white font-bold text-lg mb-1">{event.name}</h4>
            <div className="flex gap-4 text-cyan-300/70 text-sm">
              <span className="text-cyan-400">{event.category}</span>
              <span>{event.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1 text-xs font-bold uppercase tracking-widest ${
                event.status === "registered"
                  ? "bg-cyan-600/30 text-cyan-300 border border-cyan-500/60"
                  : "bg-green-600/30 text-green-300 border border-green-500/60"
              }`}
            >
              {event.status === "registered" ? "Registered" : "Completed"}
            </span>
            <ChevronRight className="text-cyan-400" size={20} />
          </div>
        </div>
      ))}
    </div>
  )
}
