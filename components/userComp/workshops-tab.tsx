"use client"

import { ChevronRight } from "lucide-react"

type Workshop = {
  id: number
  name: string
  instructor: string
  date: string
  status: string
}

type WorkshopsTabProps = {
  workshops: Workshop[]
}

export default function WorkshopsTab({ workshops }: WorkshopsTabProps) {
  return (
    <div className="space-y-4">
      {workshops.map((workshop) => (
        <div
          key={workshop.id}
          className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all flex items-center justify-between"
          style={{
            clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          <div>
            <h4 className="text-white font-bold text-lg mb-1">{workshop.name}</h4>
            <div className="flex gap-4 text-cyan-300/70 text-sm">
              <span className="text-cyan-400">By {workshop.instructor}</span>
              <span>{workshop.date}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] bg-cyan-600/30 text-cyan-300 border border-cyan-500/60">
              Registered
            </span>
            <ChevronRight className="text-cyan-400" size={20} />
          </div>
        </div>
      ))}
    </div>
  )
}
