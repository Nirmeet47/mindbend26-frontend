"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { eventTeamApi } from "@/lib/eventTeam"

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
      {teams.map((team) => {
        const [inviteEmail, setInviteEmail] = useState("");
        const [inviteStatus, setInviteStatus] = useState<string | null>(null);
        const [inviteLoading, setInviteLoading] = useState(false);
        const [inviteError, setInviteError] = useState<string | null>(null);
        // Assume current user is leader if their email matches
        const isLeader = typeof window !== "undefined" && localStorage.getItem("mb_admin_token") && team.leader.email === JSON.parse(atob(localStorage.getItem("mb_admin_token")!.split(".")[1])).email;
        return (
          <div
            key={team._id}
            className="p-6 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all flex flex-col gap-4"
            style={{
              clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
            }}
          >
            <div className="flex items-center justify-between">
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
            {/* Invite UI for leader */}
            {isLeader && (
              <div className="flex flex-col md:flex-row gap-2 items-center mt-2">
                <input
                  type="email"
                  className="px-3 py-2 rounded border border-cyan-700 bg-black text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Invite member by email"
                  value={inviteEmail}
                  onChange={e => { setInviteEmail(e.target.value); setInviteStatus(null); setInviteError(null); }}
                  disabled={inviteLoading}
                />
                <button
                  className="px-4 py-2 bg-cyan-700 text-white rounded font-bold hover:bg-cyan-600 disabled:opacity-60"
                  disabled={inviteLoading || !inviteEmail}
                  onClick={async () => {
                    setInviteLoading(true);
                    setInviteStatus(null);
                    setInviteError(null);
                    try {
                      await eventTeamApi.inviteMemberByEmail(team._id, inviteEmail);
                      setInviteStatus("Invite sent!");
                      setInviteEmail("");
                    } catch (err: any) {
                      setInviteError(err?.response?.data?.message || "Failed to send invite");
                    } finally {
                      setInviteLoading(false);
                    }
                  }}
                >
                  {inviteLoading ? "Inviting..." : "Invite"}
                </button>
                {inviteStatus && <span className="text-green-400 ml-2">{inviteStatus}</span>}
                {inviteError && <span className="text-red-400 ml-2">{inviteError}</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
