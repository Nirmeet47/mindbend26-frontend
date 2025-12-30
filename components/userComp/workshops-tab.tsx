"use client"

import { ChevronRight } from "lucide-react"

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
  if (workshops.length === 0) {
    return <div className="text-cyan-300/60 text-center py-8">You haven't registered for any workshops yet.</div>;
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
      {workshops.map((workshop) => (
        <div
          key={workshop._id}
          className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all flex items-center justify-between"
          style={{
            clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          <div>
            <h4 className="text-white font-bold text-lg mb-1">{workshop.name}</h4>
            <div className="flex gap-4 text-cyan-300/70 text-sm">
              <span className="text-cyan-400">By {workshop.instructor.name}</span>
              <span>{formatDate(workshop.workshopDate)}</span>
              {workshop.startTime && <span>{workshop.startTime}</span>}
            </div>
            {workshop.venue && (
              <div className="text-cyan-300/50 text-xs mt-1">
                📍 {workshop.venue}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 text-xs font-bold uppercase tracking-widest bg-cyan-600/30 text-cyan-300 border border-cyan-500/60">
              Registered
            </span>
            <ChevronRight className="text-cyan-400" size={20} />
          </div>
        </div>
      ))}
    </div>
  )
}
