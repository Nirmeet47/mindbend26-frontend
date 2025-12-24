"use client"

import { useState, useEffect } from "react"
import { User, Calendar, Users, Home } from "lucide-react"
import api from "../../../lib/api"
import { useRouter } from "next/navigation"
import ProfileHeader from "../../../components/userComp/profile-header"
import { useMemo } from "react"
import ResetPasswordForm from "../../../components/userComp/reset-password-form"
import RegisteredEventsTab from "../../../components/userComp/registered-events-tab"
import WorkshopsTab from "../../../components/userComp/workshops-tab"
import TeamsTab from "../../../components/userComp/teams-tab"
import AccommodationTab from "../../../components/userComp/accommodation-tab"
import PersonalDetailsCard from "@/components/userComp/personal-details-card"
import AcademicDetailsCard from "@/components/userComp/academic-details-card"

type EventType = "technical" | "managerial"

type Team = {
  _id: string
  name: string
  eventId: {
    _id: string
    name: string
    type: EventType
    venue?: string
    eventDate?: string
  }
  leader: { name: string; email: string }
  members: { user: { name: string; email: string } }[]
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()


  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    collegeName: "",
    degree: "",
    yearOfStudy: "",
    contactNumber: "",
    joinedDate: "",
    isProfileCompleted: false,
  })
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([])
  const [registeredWorkshops, setRegisteredWorkshops] = useState<any[]>([])
  const [accommodations, setAccommodations] = useState<any[]>([])

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null
        if (!token) {
          setError("You are not logged in.")
          return
        }
        const profileRes = await api.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const user = profileRes.data?.data?.user
        setUserData({
          fullName: user?.name || "",
          email: user?.email || "",
          collegeName: user?.college_name || "",
          degree: user?.degree || "",
          yearOfStudy: user?.year_of_study ? `${user.year_of_study}` : "",
          contactNumber: user?.phoneNumber || "",
          joinedDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "",
          isProfileCompleted: user?.isProfile_completed || false,
        })
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  // Fetch data for each tab only when selected
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null
    if (!token) return
    if (activeTab === "teams" && teams.length === 0) {
      setLoading(true)
      api.get("/users/teams", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setTeams(res.data?.data?.teams || []))
        .catch((err) => setError(err?.response?.data?.message || "Failed to load teams"))
        .finally(() => setLoading(false))
    }
    if (activeTab === "events" && registeredEvents.length === 0) {
      setLoading(true)
      api.get("/users/registered-events", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setRegisteredEvents(res.data?.data?.events || []))
        .catch((err) => setError(err?.response?.data?.message || "Failed to load events"))
        .finally(() => setLoading(false))
    }
    if (activeTab === "workshops" && registeredWorkshops.length === 0) {
      setLoading(true)
      api.get("/users/registered-workshops", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setRegisteredWorkshops(res.data?.data?.workshops || []))
        .catch((err) => setError(err?.response?.data?.message || "Failed to load workshops"))
        .finally(() => setLoading(false))
    }
    if (activeTab === "accommodation" && accommodations.length === 0) {
      setLoading(true)
      api.get("/users/accommodation", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setAccommodations(res.data?.data?.accommodations || []))
        .catch((err) => setError(err?.response?.data?.message || "Failed to load accommodation"))
        .finally(() => setLoading(false))
    }
  }, [activeTab])

  // Profile completion check
  const isProfileComplete = useMemo(() => {
    return userData.isProfileCompleted;
  }, [userData])

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info */}
        <ProfileHeader
          userData={userData}
          onEditProfile={async (editData) => {
            try {
              const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null;
              if (!token) return;
              const res = await api.put(
                "/users/update-profile",
                {
                  name: editData.fullName,
                  college_name: editData.collegeName,
                  year_of_study: editData.yearOfStudy,
                  phoneNumber: editData.contactNumber,
                },
                { headers: { Authorization: `Bearer ${token}` } }
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
            } catch (err) {
              // Optionally show error
            }
          }}
          onResetPassword={setShowResetPassword}
          showResetPassword={showResetPassword}
        />

        {/* Prompt to complete profile if not complete */}
        {!isProfileComplete && (
          <div className="bg-yellow-900/80 border-l-4 border-yellow-400 text-yellow-200 p-4 mb-6 rounded">
            Please complete your profile by filling in your college name, year of study, and contact number.
          </div>
        )}

        {/* Reset Password Form */}
        {showResetPassword && (
          <ResetPasswordForm isOpen={showResetPassword} onClose={() => setShowResetPassword(false)} />
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "events", label: "Registered Events", icon: Calendar },
            { id: "workshops", label: "Workshops", icon: Calendar },
            { id: "teams", label: "Your Teams", icon: Users },
            { id: "accommodation", label: "Accommodation", icon: Home },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-[0.1em] text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-cyan-400 text-cyan-300 bg-cyan-600/10"
                    : "border-transparent text-cyan-300/60 hover:text-cyan-300 hover:border-cyan-500/40"
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div>
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
          {activeTab === "events" && <RegisteredEventsTab events={registeredEvents} />}

          {/* Workshops Tab */}
          {activeTab === "workshops" && <WorkshopsTab workshops={registeredWorkshops} />}

          {/* Teams Tab */}
          {activeTab === "teams" && <TeamsTab teams={teams} loading={loading} error={error} />}

          {/* Accommodation Tab */}
          {activeTab === "accommodation" && <AccommodationTab accommodations={accommodations} />}
        </div>
      </div>
    </div>
  )
}
