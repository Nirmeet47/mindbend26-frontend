"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Users } from "lucide-react";
import { useState, useEffect } from "react";
import {
  TechDecorationBottomLeft,
  TechDecorationBottomRight,
  TechDecorationTopLeft,
  TechDecorationTopRight,
} from "../ui/TechDecorations";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { DetailedTeam } from "@/types";
import RegisteredTeamModal from "./RegisteredTeamModal";

const CodeWarsRegistration = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [eventTeam, setEventTeam] = useState<DetailedTeam | null>(null);
  const [isLeader, setIsLeader] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [regError, setRegError] = useState<string | null>(null);
  const [gfgLink] = useState(
    "https://practice.geeksforgeeks.org/contest/mindbend-geeksforgeeks-codewars-round-1",
  );
  const [hasTeam, setHasTeam] = useState(false);
  const [checkingTeam, setCheckingTeam] = useState(true);

  // Check if user already has a team
  useEffect(() => {
    const checkTeam = async () => {
      if (!isAuthenticated) {
        setCheckingTeam(false);
        return;
      }
      try {
        const response = await api.get("/codewars/my-team");
        const payload = response.data?.data ?? response.data;
        if (payload?.team) {
          setEventTeam(payload.team);
          setIsLeader(Boolean(payload.isLeader));
          setHasTeam(true);
        }
      } catch {
        // No team found, that's okay
        setEventTeam(null);
        setIsLeader(false);
        setHasTeam(false);
      } finally {
        setCheckingTeam(false);
      }
    };
    checkTeam();
  }, [isAuthenticated]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showErrorToast("Please login to register for CodeWars");
      router.push("/login");
      return;
    }

    if (!teamName.trim()) {
      setRegError("Please enter a team name");
      return;
    }

    setRegLoading(true);
    setRegError(null);

    try {
      await api.post("/codewars/register", { teamName: teamName.trim() });
      showSuccessToast(`Team "${teamName}" registered successfully!`);
      setRegSuccess(true);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error?.response?.data?.message || "Registration failed";
      setRegError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {checkingTeam ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <div className="bg-linear-to-r from-[#2F8D46]/10 via-[#2F8D46]/5 to-transparent border border-[#2F8D46]/30 p-8 md:p-12">
              <div className="px-8 py-4 bg-[#2F8D46]/10 border border-[#2F8D46]/30 text-[#2F8D46] font-bold tracking-wider uppercase flex items-center gap-3 text-lg w-fit">
                <div className="w-5 h-5 border-2 border-[#2F8D46] border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </div>
            </div>
          </motion.div>
        ) : hasTeam && eventTeam ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <div className="flex justify-end">
              <RegisteredTeamModal
                team={eventTeam}
                isLeader={isLeader}
                eventId={eventTeam.eventId?._id}
                eventName={eventTeam.eventId?.name || "CodeWars"}
                isTeamEvent={true}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="relative"
          >
            <div className="bg-linear-to-r from-[#2F8D46]/10 via-[#2F8D46]/5 to-transparent border border-[#2F8D46]/30 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-2">
                    Ready to Code?
                  </h3>
                  <p className="text-gray-400 font-rajdhani text-lg">
                    Create your team (max 3 members) and get the GFG contest link!
                  </p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        showErrorToast("Please login to register");
                        router.push("/login");
                      } else {
                        setShowModal(true);
                      }
                    }}
                    className="group/btn relative px-8 py-4 bg-[#2F8D46]/20 hover:bg-[#2F8D46]/40 border border-[#2F8D46]/60 text-[#2F8D46] font-bold tracking-wider uppercase transition-all overflow-hidden flex items-center gap-3 text-lg whitespace-nowrap"
                  >
                    <Users className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Register Team</span>
                    <div className="absolute inset-0 bg-[#2F8D46]/20 transform -skew-x-12 translate-x-[-150%] group-hover/btn:translate-x-full transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => !regLoading && setShowModal(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] flex flex-col"
            >
              {/* Frame Layer */}
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute inset-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-0 border-white/5 shadow-2xl"
                  style={{
                    clipPath:
                      "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)",
                  }}
                />
                <TechDecorationTopLeft />
                <TechDecorationTopRight />
                <TechDecorationBottomRight />
                <TechDecorationBottomLeft />
                <div className="absolute top-0 left-16 right-12 h-[1.5px] bg-linear-to-r from-[#2F8D46]/50 to-[#2F8D46]/20" />
                <div className="absolute top-12 bottom-16 right-0 w-[1.5px] bg-linear-to-b from-[#2F8D46]/20 to-[#2F8D46]/50" />
                <div className="absolute bottom-0 left-0 right-32 h-[1.5px] bg-linear-to-r from-[#2F8D46]/50 to-[#2F8D46]/20" />
                <div className="absolute top-16 bottom-0 left-0 w-[1.5px] bg-linear-to-b from-[#2F8D46]/20 to-[#2F8D46]/50" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setShowModal(false);
                  if (regSuccess) window.location.reload();
                }}
                disabled={regLoading}
                className="absolute top-6 right-6 z-30 w-10 h-10 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500/50 hover:border-red-500 flex items-center justify-center transition-all group pointer-events-auto"
              >
                <X className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Content */}
              <div
                className="relative z-10 flex-1 overflow-y-auto p-6 md:p-8 pointer-events-auto"
                style={{
                  clipPath:
                    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 32px) 100%, 0 100%, 0 16px)",
                }}
              >
                {!regSuccess ? (
                  <>
                    {/* Header */}
                    <div className="mb-6 pb-4 border-b border-white/10">
                      <span className="block text-[10px] font-mono text-[#2F8D46] mb-2 tracking-widest uppercase">
                        CODEWARS.REGISTRATION // CREATE_TEAM
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white font-orbitron tracking-tight uppercase mb-2">
                        Register Your Team
                      </h2>
                      <p className="text-gray-400 text-sm font-rajdhani">
                        Create a team name (max 3 members can join later)
                      </p>
                    </div>

                    {/* Input */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-sm font-mono text-[#2F8D46] mb-2 tracking-wider uppercase">
                          Team Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-slate-950/80 border-2 border-[#2F8D46]/50 focus:outline-none focus:ring-2 focus:ring-[#2F8D46] focus:border-[#2F8D46] text-white font-rajdhani text-lg transition-all"
                          placeholder="Enter your team name..."
                          value={teamName}
                          onChange={(e) => {
                            setTeamName(e.target.value);
                            setRegError(null);
                          }}
                          disabled={regLoading}
                          autoFocus
                        />
                        {regError && (
                          <div className="text-red-400 text-sm mt-2 font-rajdhani">
                            {regError}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleRegister}
                        disabled={regLoading || !teamName.trim()}
                        className="flex-1 px-6 py-3 bg-[#2F8D46] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden relative group disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300 opacity-30" />
                        <span className="relative z-10">
                          {regLoading ? "REGISTERING..." : "REGISTER TEAM"}
                        </span>
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        disabled={regLoading}
                        className="px-6 py-3 border-2 border-white/20 text-white font-bold font-orbitron tracking-wider text-lg hover:bg-white/10 transition-all disabled:opacity-60"
                      >
                        CANCEL
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Success Screen */}
                    <div className="mb-6 pb-4 border-b border-white/10">
                      <span className="block text-[10px] font-mono text-[#2F8D46] mb-2 tracking-widest uppercase">
                        SYS.STATUS // REGISTRATION CONFIRMED
                      </span>
                      <h2 className="text-2xl md:text-3xl font-black text-white font-orbitron tracking-tight uppercase mb-2">
                        {teamName}
                      </h2>
                      <div className="h-1 w-24 bg-linear-to-r from-[#2F8D46] to-transparent" />
                    </div>

                    {/* Success Message */}
                    <div className="mb-6 bg-linear-to-r from-[#2F8D46]/20 to-transparent border-l-2 border-[#2F8D46] p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 bg-[#2F8D46] rounded-full animate-pulse" />
                        <span className="text-lg font-bold text-[#2F8D46] font-orbitron uppercase">
                          TEAM REGISTERED SUCCESSFULLY
                        </span>
                      </div>
                    </div>

                    {/* GFG Link */}
                    <div className="mb-6 bg-linear-to-r from-green-900/20 to-transparent border-l-2 border-green-500 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <ExternalLink className="w-6 h-6 text-green-400" />
                        <h3 className="text-xl font-bold text-white font-orbitron uppercase tracking-wider">
                          GeeksforGeeks Contest
                        </h3>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 font-rajdhani">
                        Register individually on GeeksforGeeks and compete using
                        your team leader&apos;s account
                      </p>
                      <a
                        href={gfgLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-3 px-6 bg-green-600 hover:bg-green-500 border border-green-500 text-white font-bold font-orbitron tracking-wider text-center transition-all uppercase"
                      >
                        Register on GFG
                      </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setHasTeam(true);
                        }}
                        className="flex-1 px-6 py-3 bg-[#2F8D46] hover:bg-[#2F8D46]/80 text-black font-bold font-orbitron tracking-wider text-lg transition-all uppercase"
                      >
                        Done
                      </button>
                      <button
                        onClick={() => router.push("/user/dashboard")}
                        className="px-6 py-3 border-2 border-white/20 text-white font-bold font-orbitron tracking-wider text-lg hover:bg-white/10 transition-all uppercase"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CodeWarsRegistration;
