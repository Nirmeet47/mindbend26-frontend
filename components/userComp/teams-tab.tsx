"use client"

import { ChevronRight } from "lucide-react"

type Team = {
  _id: string
  name: string
  eventId: {
    _id: string
    name: string
    type: string
    venue?: string
    eventDate?: string
  }
  leader: { name: string; email: string }
  members: { user: { name: string; email: string } }[]
}

type TeamsTabProps = {
  teams: Team[]
  loading: boolean
  error: string
}

export default function TeamsTab({ teams, loading, error }: TeamsTabProps) {
  if (loading) {
    return <div className="text-center text-cyan-400">Loading your teams...</div>
  }

  if (error) {
    return <div className="text-red-400 text-center">{error}</div>
  }

  if (teams.length === 0) {
    return <div className="text-cyan-300/60 text-center py-8">You haven't joined any teams yet.</div>
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => (
        <div
          key={team._id}
          className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all flex items-center justify-between"
          style={{
            clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          <div>
            <h4 className="text-white font-bold text-lg mb-1">{team.name}</h4>
            <div className="flex gap-4 text-cyan-300/70 text-sm">
              <span className="text-cyan-400">{team.eventId.name}</span>
              <span>{team.members.length} Members</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] bg-green-600/30 text-green-300 border border-green-500/60">
              Active
            </span>
            <ChevronRight className="text-cyan-400" size={20} />
          </div>
        </div>
      ))}
    </div>
  )
}
