"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { eventTeamApi } from "@/lib/eventTeam"
import RegisteredTeamModal from "../events/RegisteredTeamModal"
import { DetailedTeam } from "@/types"

type TeamsTabProps = {
  teams: DetailedTeam[]
  loading: boolean
  error: string
  onAcceptRejectInvite?: (teamId: string, action: 'accept' | 'reject') => void
  userEmail?: string
}

export default function TeamsTab({ teams, loading, error, onAcceptRejectInvite, userEmail }: TeamsTabProps) {
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
        return (
          <div key={team._id}>
            <RegisteredTeamModal
              team={team}
              isLeader={team.isLeader ? team.isLeader : false}
              eventId={team.eventId._id}
              eventName={team.eventId.name}
              isFullView={false}
              userEmail={userEmail}
              onAcceptRejectInvite={onAcceptRejectInvite}
            />
          </div>
        );
      })}
    </div>
  );
}
