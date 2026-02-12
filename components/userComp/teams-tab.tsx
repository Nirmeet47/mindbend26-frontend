"use client";

import { Users } from "lucide-react";
import { motion } from "framer-motion";
import RegisteredTeamModal from "../events/RegisteredTeamModal";
import { DetailedTeam } from "@/types";

type TeamsTabProps = {
  teams: DetailedTeam[];
  loading: boolean;
  error: string;
  onAcceptRejectInvite?: (
    team: DetailedTeam,
    action: "accept" | "reject",
  ) => void;
  userEmail?: string;
};

export default function TeamsTab({
  teams,
  loading,
  error,
  onAcceptRejectInvite,
  userEmail,
}: TeamsTabProps) {
  if (loading) {
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
          <div className="w-8 h-8 border-2 border-[#33ABB9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#33ABB9] font-mono text-sm">
            Loading your teams...
          </p>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-red-500/10 border border-red-500/30" />
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-500" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-500" />
        <div className="relative p-6 text-center">
          <p className="text-red-400 font-mono text-sm">{error}</p>
        </div>
      </motion.div>
    );
  }

  if (teams.length === 0) {
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
          <Users className="w-12 h-12 text-[#33ABB9]/40 mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-sm">
            You haven't joined any teams yet.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#33ABB9]/30 scrollbar-track-transparent">
      {teams.map((team, index) => {
        return (
          <motion.div
            key={team._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RegisteredTeamModal
              team={team}
              isLeader={team.isLeader ? team.isLeader : false}
              eventId={team.eventId._id}
              eventName={team.eventId.name}
              isFullView={false}
              userEmail={userEmail}
              onAcceptRejectInvite={onAcceptRejectInvite}
              isTeamEvent={team.eventId.isTeamEvent}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
