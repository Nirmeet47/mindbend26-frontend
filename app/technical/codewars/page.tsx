"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Calendar, MapPin, Trophy, ExternalLink } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
import InfoCard from "@/components/events/InfoCard";
import EventCard from "@/components/EventCard";
import EventsHeader from "@/components/events/EventsHeader";
import Navbar from "@/components/layoutComp/Navbar";
import CodeWarsRegistration from "@/components/events/CodeWarsRegistration";

// Lazy load the background scene
const BackgroundScene = dynamic(
  () => import("@/components/events/BackgroundScene"),
  {
    ssr: false,
  },
);

// ─── Hardcoded CodeWars Round Tab Component ─────────────────────────────────
type TabType = "about" | "round1" | "round2" | "prizes";

function CodeWarsTabs() {
  const [activeTab, setActiveTab] = useState<TabType>("about");

  const tabs = [
    { id: "about", label: "About" },
    { id: "round1", label: "Round 1" },
    { id: "round2", label: "Round 2" },
    { id: "prizes", label: "Prizes" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 pb-12">
      <div className="border-b border-white/10 mb-8 relative">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-[#00F0FF]/50 to-transparent" />
        <div className="flex flex-wrap gap-2 md:gap-8 overflow-x-auto pb-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`pb-4 px-4 font-orbitron font-bold tracking-wider text-sm relative transition-all whitespace-nowrap ${activeTab === tab.id
                  ? "text-[#00F0FF]"
                  : "text-gray-500 hover:text-gray-300"
                }`}
            >
              <span className="relative z-10 px-2">
                {activeTab === tab.id && (
                  <span className="text-[#00F0FF] mr-2">&gt;</span>
                )}
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="codewarsActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.7)]"
                  transition={{ duration: 0.3 }}
                />
              )}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-[#00F0FF]/5 transform -skew-x-12 z-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ duration: 0.3 }}
        className="min-h-[300px]"
      >
        {/* About Tab */}
        {activeTab === "about" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <p className="text-xl md:text-2xl font-rajdhani font-medium leading-relaxed text-gray-300 tracking-wide text-justify">
                  Mindbend × GeeksforGeeks CodeWars is a DSA + Competitive
                  Programming based Coding Contest organized by SVNIT Surat in
                  collaboration with GeeksforGeeks. The contest features two
                  rounds — an online qualifying round and an on-campus final
                  round at SVNIT. Teams compete in challenging problem-solving
                  across varying difficulty levels. Registration is
                  individual-based on the GeeksforGeeks platform but
                  participation is team-based (teams submit using team
                  leader&apos;s account).
                </p>
              </div>

              {/* Important Note */}
              <div className="bg-[#00F0FF]/5 border-l-2 border-[#00F0FF] p-6 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(0,240,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-[#00F0FF] animate-pulse" />
                    <p className="font-bold text-[#00F0FF] font-orbitron tracking-wider">
                      IMPORTANT
                    </p>
                  </div>
                  <p className="text-gray-300 font-rajdhani text-lg">
                    Each team member must individually register on GeeksforGeeks
                    to be eligible. The team will submit using the team
                    leader&apos;s GFG account.
                  </p>
                </div>
              </div>
            </div>

            {/* GFG Registration Format - Critical Note */}
            <div className="mt-12 border-2 border-[#FF4D00] bg-[#FF4D00]/5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(255,77,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
              <div className="relative z-10 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 bg-[#FF4D00] animate-pulse" />
                  <h3 className="font-bold text-[#FF4D00] font-orbitron tracking-wider text-lg sm:text-xl uppercase">
                    📝 GeeksforGeeks Registration Format
                  </h3>
                </div>
                <div className="space-y-6">
                  <p className="text-gray-200 font-rajdhani text-base sm:text-lg leading-relaxed">
                    After creating your team on Mindbend website, each member
                    must register individually on GeeksforGeeks with their name
                    in the following format:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Team Leader Format */}
                    <div className="bg-black/30 border border-[#00F0FF]/30 p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#00F0FF] text-xl sm:text-2xl">
                          👑
                        </span>
                        <h4 className="font-bold text-[#00F0FF] font-orbitron text-base sm:text-lg">
                          TEAM LEADER
                        </h4>
                      </div>
                      <p className="text-gray-300 font-rajdhani text-sm sm:text-base mb-3">
                        Format:
                      </p>
                      <div className="bg-[#00F0FF]/10 border-l-4 border-[#00F0FF] p-3 sm:p-4">
                        <code className="text-white font-mono text-xs sm:text-base break-all">
                          &lt;Your Name on Mindbend website&gt; &lt;Team Name on
                          Mindbend website&gt; TL
                        </code>
                      </div>
                      <p className="text-gray-400 font-rajdhani text-xs sm:text-sm mt-3 italic">
                        Example: Jeet Tandel CodeWarriors TL
                      </p>

                      {/* Screenshot demonstration */}
                      <div className="mt-4">
                        <p className="text-[#00F0FF]/70 font-share-tech-mono text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                          How it looks on GFG:
                        </p>
                        <div className="relative w-full border border-[#00F0FF]/20 rounded overflow-hidden bg-white">
                          <Image
                            src="/gfg-name-leader.png"
                            alt="GFG Name field format for Team Leader — Name - TeamName - TL"
                            width={600}
                            height={80}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Team Member Format */}
                    <div className="bg-black/30 border border-[#2F8D46]/30 p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[#2F8D46] text-xl sm:text-2xl">
                          👤
                        </span>
                        <h4 className="font-bold text-[#2F8D46] font-orbitron text-base sm:text-lg">
                          TEAM MEMBERS
                        </h4>
                      </div>
                      <p className="text-gray-300 font-rajdhani text-sm sm:text-base mb-3">
                        Format:
                      </p>
                      <div className="bg-[#2F8D46]/10 border-l-4 border-[#2F8D46] p-3 sm:p-4">
                        <code className="text-white font-mono text-xs sm:text-base break-all">
                          &lt;Your Name on Mindbend website&gt; &lt;Team Name on
                          Mindbend website&gt;
                        </code>
                      </div>
                      <p className="text-gray-400 font-rajdhani text-xs sm:text-sm mt-3 italic">
                        Example: Nirmeet Parmar CodeWarriors
                      </p>

                      {/* Screenshot demonstration */}
                      <div className="mt-4">
                        <p className="text-[#2F8D46]/70 font-share-tech-mono text-[10px] sm:text-xs uppercase tracking-widest mb-2">
                          How it looks on GFG:
                        </p>
                        <div className="relative w-full border border-[#2F8D46]/20 rounded overflow-hidden bg-white">
                          <Image
                            src="/gfg-name-member.png"
                            alt="GFG Name field format for Team Member — Name - TeamName"
                            width={600}
                            height={80}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warning: exact name match */}
                  <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 sm:p-5 mt-6">
                    <p className="text-yellow-200 font-rajdhani text-sm sm:text-base">
                      ⚠️ <strong className="font-bold">Important:</strong> Use
                      the exact same name as registered on Mindbend website.
                      This is crucial for verification and team identification
                      during the contest.
                    </p>
                  </div>

                  {/* Warning: elimination */}
                  <div className="bg-red-500/10 border-2 border-red-500/60 p-4 sm:p-5 mt-2 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(239,68,68,0.04)_50%)] bg-[length:100%_4px] pointer-events-none" />
                    <div className="relative z-10 flex items-start gap-3">
                      <span className="text-red-400 text-xl sm:text-2xl mt-0.5">
                        🚫
                      </span>
                      <div>
                        <p className="text-red-200 font-rajdhani text-sm sm:text-base leading-relaxed">
                          Not following the above naming format may lead to{" "}
                          <strong className="font-bold text-red-300">
                            elimination
                          </strong>{" "}
                          of your team from the contest. Ensure every team
                          member registers on GFG with the correct format before
                          the contest begins.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-4 sm:p-5 mt-6">
                    <p className="text-yellow-200 font-rajdhani text-sm sm:text-base">
                      ⚠️ <strong className="font-bold">Note :</strong> if
                      individual registration on GFG platform are below 1000 no
                      goodies (bag, diary, pen) to winners from gfg side will be
                      provided.
                    </p>
                    <p className="text-yellow-200 font-rajdhani text-sm sm:text-base">
                      &#9;&#9;Only Price money from Mindbend side will be
                      provided.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Round 1 Tab */}
        {activeTab === "round1" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Section Heading */}
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-[#00F0FF] font-orbitron tracking-wider uppercase">
                  Round 1 — Qualifying Round (Online)
                </h3>
                <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mx-auto mt-3"></div>
              </div>

              {/* Round Details */}
              <div className="space-y-4">
                {[
                  "📅 Date & Time: 21st February, 8:00 PM – 9:30 PM",
                  "💻 Platform: GeeksforGeeks (Online)",
                ].map((content, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 border border-white/10 p-6 hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="text-gray-300 font-rajdhani text-lg leading-relaxed whitespace-pre-line">
                      {content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Round 2 Tab */}
        {activeTab === "round2" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Section Heading */}
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-[#00F0FF] font-orbitron tracking-wider uppercase">
                  Round 2 — Final Round (On-Campus at SVNIT)
                </h3>
                <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mx-auto mt-3"></div>
              </div>

              {/* Round Details */}
              <div className="space-y-4">
                {[
                  "📅 Date & Time: 28th February, 2:00 PM – 6:00 PM",
                  "📍 Venue: SVNIT Campus, Surat",
                  "💻 Platform: GeeksforGeeks",
                  "👥 Participants: Top 25 teams shortlisted from Round 1",
                ].map((content, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 border border-white/10 p-6 hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="text-gray-300 font-rajdhani text-lg leading-relaxed whitespace-pre-line">
                      {content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* How it works note */}
              <div className="bg-[#FF4D00]/5 border-l-2 border-[#FF4D00] p-6 relative overflow-hidden backdrop-blur-sm mt-6">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,_rgba(255,77,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-[#FF4D00] animate-pulse" />
                    <p className="font-bold text-[#FF4D00] font-orbitron tracking-wider">
                      HOW IT WORKS
                    </p>
                  </div>
                  <p className="text-gray-300 font-rajdhani text-lg leading-relaxed">
                    Round 1 will be conducted on GeeksforGeeks. Each member of
                    the team needs to register individually on GFG and appear
                    for Round 1. The top 30 shortlisted teams will qualify for
                    the offline final round held during Mindbend at SVNIT.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Prizes Tab */}
        {activeTab === "prizes" && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-[#00F0FF] font-orbitron tracking-wider uppercase">
                  Prizes & Merchandise
                </h3>
                <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent mx-auto mt-3"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top 3 teams */}
                {[
                  { place: '🥇 1st Place', items: ['₹8000'] },
                  { place: '🥈 2nd Place', items: ['₹5000'] },
                  { place: '🥉 3rd Place', items: ['₹2500'] },
                ].map((prize, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-6 hover:bg-white/[0.08] transition-all text-center"
                  >
                    <h4 className="text-xl font-bold text-[#E8823A] font-orbitron mb-4">
                      {prize.place}
                    </h4>
                    <ul className="space-y-2">
                      {prize.items.map((item, j) => (
                        <li
                          key={j}
                          className="text-gray-300 font-rajdhani text-lg"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </section>
  );
}

// ─── Main CodeWars Page ─────────────────────────────────────────────────────
export default function CodeWarsPage() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  const handleBack = () => {
    router.push("/technical");
  };

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-[#FF4D00] selection:text-white font-rajdhani tracking-wide relative"
      >
        {/* Background 3D Scene - Reduced opacity */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
          <BackgroundScene />
        </div>

        {/* Cyberpunk Grid Overlay */}
        <div
          className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at center, black 40%, transparent 100%)",
          }}
        />

        <div className="relative z-10">
          {/* Event Header */}
          <section className="max-w-7xl mx-auto px-4 pt-16 pb-12">
            <EventsHeader
              eventName="Mindbend × GFG CodeWars"
              eventType="technical"
              isTeamEvent={true}
              eventStatus="OPEN"
              breadcrumbType="TECHNICAL"
            />

            {/* Event Image */}
            <div className="relative w-full mb-12 font-rajdhani">
              <EventCard
                showExploreButton={false}
                slug="#"
                title="Mindbend × GeeksforGeeks CodeWars"
                aboutEvent="DSA + Competitive Programming based Coding Contest in collaboration with GeeksforGeeks..."
                date="Feb 21st"
                prize="₹15000"
                image="/codewars-banner.png"
                prizeLabel="Prizes"
              />
            </div>
          </section>

          {/* Quick Info Cards */}
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <InfoCard
                icon={Calendar}
                label="ROUND 1"
                value="Feb 21, 8 PM"
                sub="ONLINE ON GFG"
                color="text-[#00F0FF]"
                delay={0.3}
              />
              <InfoCard
                icon={Calendar}
                label="ROUND 2"
                value="Feb 28, 2 PM"
                sub="OFFLINE AT SVNIT"
                color="text-[#00F0FF]"
                delay={0.4}
              />
              <InfoCard
                icon={MapPin}
                label="VENUE"
                value="SVNIT, Surat"
                color="text-[#FF4D00]"
                delay={0.5}
              />
              <InfoCard
                icon={Users}
                label="TEAM SIZE"
                value="3 Members"
                color="text-[#00F0FF]"
                delay={0.6}
              />
            </div>
          </section>

          {/* Merchandise / Prize Section */}
          <section className="max-w-7xl mx-auto px-4 pb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="relative p-px bg-linear-to-r from-transparent via-[#2F8D46] to-transparent"
            >
              <div className="bg-[#050505] p-8 md:p-12 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(#2F8D46 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 border-l-2 border-[#2F8D46] pl-3 mb-3">
                      <span className="text-[#2F8D46] font-share-tech-mono text-xs uppercase tracking-[0.2em]">
                        Powered by
                      </span>
                    </div>
                    <div className="text-4xl md:text-5xl font-black font-orbitron text-white tracking-tight">
                      GeeksforGeeks
                    </div>
                  </div>

                  <div className="flex-1 w-full lg:w-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden">
                      {[
                        { label: '🥇 1st Place', value: '₹8000', color: 'text-amber-400' },
                        { label: '🥈 2nd Place', value: '₹5000', color: 'text-slate-300' },
                        { label: '🥉 3rd Place', value: '₹2500', color: 'text-orange-600' },
                      ].map((prize, i) => (
                        <div
                          key={i}
                          className="bg-[#050505] p-4 md:p-6 text-center group hover:bg-white/5 transition-colors relative"
                        >
                          <div
                            className={`text-xs md:text-sm font-share-tech-mono ${prize.color} mb-1 uppercase tracking-wider`}
                          >
                            {prize.label}
                          </div>
                          <div className="text-sm md:text-lg font-bold font-orbitron text-white">
                            {prize.value}
                          </div>
                          <div
                            className={`absolute bottom-0 left-0 w-full h-0.5 bg-current opacity-0 group-hover:opacity-100 transition-opacity ${prize.color}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* CodeWars Tabs (About / Round 1 / Round 2 / Prizes) */}
          <CodeWarsTabs />

          {/* Registration CTA */}
          <CodeWarsRegistration />
        </div>
      </motion.div>
    </>
  );
}
