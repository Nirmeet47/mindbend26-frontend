"use client"

import { useState, useEffect } from "react"
import { User, Calendar, Users, Home } from "lucide-react"
import toast from 'react-hot-toast';
import api from "../../../lib/api"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import ProfileHeader from "../../../components/userComp/profile-header"
import { useMemo } from "react"
import RegisteredEventsTab from "../../../components/userComp/registered-events-tab"
import Navbar from "../../../components/layoutComp/Navbar"
import WorkshopsTab from "../../../components/userComp/workshops-tab"
import TeamsTab from "../../../components/userComp/teams-tab"
import AccommodationTab from "../../../components/userComp/accommodation-tab"
import PersonalDetailsCard from "@/components/userComp/personal-details-card"
import AcademicDetailsCard from "@/components/userComp/academic-details-card"

// Lazy load the background scene
const BackgroundScene = dynamic(() => import('@/components/events/BackgroundScene'), {
  ssr: false,
})

type EventType = "technical" | "managerial" | "esports"

import { DetailedTeam } from "@/types"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [teams, setTeams] = useState<DetailedTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()


  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    collegeName: "",
    yearOfStudy: "",
    contactNumber: "",
    joinedDate: "",
    isProfileCompleted: false,
  })
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([])
  const [pendingInvites, setPendingInvites] = useState<any[]>([])
  const [registeredWorkshops, setRegisteredWorkshops] = useState<any[]>([])
  const [accommodations, setAccommodations] = useState<any[]>([])

  // State to track fetched data to prevent duplicate calls
  const [fetchedData, setFetchedData] = useState({
    profile: false,
    teams: false,
    events: false,
    workshops: false,
    accommodation: false
  })

  // Redirect to /login if not authenticated (rely on API 401)
  useEffect(() => {
    if (fetchedData.profile) return

    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        // Server-side cookies implementation - no manual token management needed
        const profileRes = await api.get("/users/profile")
        const user = profileRes.data?.data?.user
        setUserData({
          fullName: user?.name || "",
          email: user?.email || "",
          collegeName: user?.college_name || "",
          yearOfStudy: user?.year_of_study ? `${user.year_of_study}` : "",
          contactNumber: user?.phoneNumber || "",
          joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
          isProfileCompleted: user?.isProfile_completed || false,
        })
        setFetchedData(prev => ({ ...prev, profile: true }))
      } catch (err: any) {
        if (err?.response?.status === 401) {
          router.replace("/login")
          return
        }
        setError(err?.response?.data?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [fetchedData.profile])

  // Fetch data for each tab only when selected and not already fetched
  useEffect(() => {
    if (!fetchedData.profile) return // Wait for profile to load first

    if (activeTab === "teams" && !fetchedData.teams) {
      setLoading(true)
      console.log("Fetching teams data...")
      api.get("/users/teams")
        .then((res) => {
          console.log("Teams API response:", res.data)
          setTeams(res.data?.data?.teams || [])
          setFetchedData(prev => ({ ...prev, teams: true }))
        })
        .catch((err) => {
          console.error("Teams API error:", err?.response?.data || err)
          setError(err?.response?.data?.message || "Failed to load teams")
        })
        .finally(() => setLoading(false))
    }

    if (activeTab === "events" && !fetchedData.events) {
      setLoading(true)
      api.get("/users/registered-events")
        .then((res) => {
          setRegisteredEvents(res.data?.data?.events || []);
          setPendingInvites(res.data?.data?.pendingInvites || []);
          setFetchedData(prev => ({ ...prev, events: true }))
        })
        .catch((err) => setError(err?.response?.data?.message || "Failed to load events"))
        .finally(() => setLoading(false))
    }

    if (activeTab === "workshops" && !fetchedData.workshops) {
      setLoading(true)
      api.get("/workshops/my-registrations")
        .then((res) => {
          setRegisteredWorkshops(res.data?.data?.workshops || [])
          setFetchedData(prev => ({ ...prev, workshops: true }))
        })
        .catch((err) => setError(err?.response?.data?.message || "Failed to load workshops"))
        .finally(() => setLoading(false))
    }

    if (activeTab === "accommodation" && !fetchedData.accommodation) {
      setLoading(true)
      api.get("/users/accommodation")
        .then((res) => {
          setAccommodations(res.data?.data?.accommodations || [])
          setFetchedData(prev => ({ ...prev, accommodation: true }))
        })
        .catch((err) => setError(err?.response?.data?.message || "Failed to load accommodation"))
        .finally(() => setLoading(false))
    }
  }, [activeTab, fetchedData])

  // Profile completion check
  const isProfileComplete = useMemo(() => {
    return userData.isProfileCompleted;
  }, [userData])

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-[#030303] text-white overflow-x-hidden selection:bg-[#33ABB9] selection:text-white font-rajdhani tracking-wide relative"
      >
        {/* Background 3D Scene - Reduced opacity */}
        <div className="fixed inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
          <BackgroundScene />
        </div>

        {/* Cyberpunk Grid Overlay */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `
            linear-gradient(rgba(51, 171, 185, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(51, 171, 185, 0.4) 1px, transparent 1px)
          `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
          }}
        />

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto mt-8 sm:mt-12 md:mt-8">
            {/* Show loading while profile is being fetched */}
            {loading && !fetchedData.profile ? (
              <div className="flex justify-center items-center min-h-[50vh]">
                <div className="text-center">
                  <div className="text-[#33ABB9] text-xl mb-4">Loading Profile...</div>
                  <div className="w-8 h-8 border-2 border-[#33ABB9] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Header with User Info */}
                <ProfileHeader
                  userData={userData}
                  onEditProfile={async (editData) => {
                    try {

                      // const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
                      // if (!token) return;

                      if (editData.fullName && editData.collegeName && editData.yearOfStudy && editData.contactNumber) {
                        const res = await api.put(
                          "/users/update-profile",
                          {
                            name: editData.fullName,
                            college_name: editData.collegeName,
                            year_of_study: editData.yearOfStudy,
                            phoneNumber: editData.contactNumber,
                          }
                        );

                        const user = res.data?.data?.user;
                        setUserData((prev) => ({
                          ...prev,
                          fullName: user?.name || prev.fullName,
                          collegeName: user?.college_name || prev.collegeName,
                          yearOfStudy: user?.year_of_study ? `${user.year_of_study}` : prev.yearOfStudy,
                          contactNumber: user?.phoneNumber || prev.contactNumber,
                          isProfileCompleted: user?.isProfile_completed || false,
                        }));

                      } else {
                        alert("Please fill in all required fields to update your profile.");
                        return;
                      }
                    } catch (err: any) {
                      // Optionally show error
                      console.error("Failed to update profile:", err);
                      alert("Failed to update profile: " + err.response?.data?.message || err.message);
                    }
                  }}
                />

                {/* Prompt to complete profile if not complete */}
                {!isProfileComplete && (
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#E8823A]/10 border border-[#E8823A]/30" />
                    <div className="absolute top-0 left-1 w-4 h-4 border-t-2 border-l-2 border-[#E8823A]" />
                    <div className="absolute bottom-0 right-1 w-4 h-4 border-b-2 border-r-2 border-[#E8823A]" />
                    <div className="relative p-4 text-[#E8823A]">
                      <span className="text-[10px] font-mono tracking-widest uppercase block mb-1">[ SYSTEM ALERT ]</span>
                      Please complete your profile by filling in your college name, year of study, and contact number.
                    </div>
                  </div>
                )}


                {/* Navigation Tabs */}
                <div className="mb-8 border-b border-white/10">
                  <div className="flex flex-wrap gap-1 pb-2 justify-center md:justify-start">
                    {[
                      { id: "overview", label: "Overview", icon: User },
                      { id: "events", label: "Events", icon: Calendar },
                      { id: "workshops", label: "Workshops", icon: Calendar },
                      { id: "teams", label: "Teams", icon: Users },
                      { id: "accommodation", label: "Accommodation", icon: Home },
                    ].map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-wide text-xs transition-all relative ${activeTab === tab.id
                              ? "text-[#33ABB9] bg-[#33ABB9]/10"
                              : "text-gray-400 hover:text-[#33ABB9] hover:bg-white/5"
                            }`}
                        >
                          {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#33ABB9]" />
                          )}
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {/* Show loading for specific tabs */}
                  {loading && activeTab !== "overview" && (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <div className="text-[#33ABB9] text-lg mb-4">Loading {activeTab}...</div>
                        <div className="w-6 h-6 border-2 border-[#33ABB9] border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </div>
                    </div>
                  )}

                  {/* Overview Tab */}
                  {activeTab === "overview" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Personal Details Card */}
                      <PersonalDetailsCard userData={userData} />
                      {/* Academic Details Card */}
                      <AcademicDetailsCard userData={userData} />
                    </div>
                  )}

                  {/* Registered Events Tab */}
                  {activeTab === "events" && !loading && (
                    <RegisteredEventsTab events={registeredEvents} />
                  )}

                  {/* Workshops Tab */}
                  {activeTab === "workshops" && !loading && <WorkshopsTab workshops={registeredWorkshops} />}

                  {/* Teams Tab */}
                  {activeTab === "teams" && !loading && (
                    <TeamsTab
                      teams={teams}
                      loading={loading}
                      error={error}
                      onAcceptRejectInvite={async (teamId, action) => {
                        try {
                          await api.post(`/events/team/${teamId}/invite/respond`, { action });
                        } catch (err: any) {
                          console.log('Error responding to invite:', err);
                          const errorMessage = err.response?.data?.message || 'Failed to update invite';
                          toast.error(errorMessage);
                          return;
                        }

                        // Refetch teams to update UI
                        try {
                          const res = await api.get("/users/teams");
                          setTeams(res.data?.data?.teams || []);
                          setPendingInvites(prev => prev.filter(i => i.teamId !== teamId));
                        } catch (err: any) {
                          console.error('Error refetching teams:', err);
                          setError(err?.response?.data?.message || "Failed to refresh teams");
                        }
                      }}
                      userEmail={userData.email}
                    />
                  )}

                  {/* Accommodation Tab */}
                  {activeTab === "accommodation" && !loading && <AccommodationTab accommodations={accommodations} />}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
