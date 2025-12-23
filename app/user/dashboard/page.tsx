"use client"

import { useState, useEffect } from "react"
import { User, Calendar, Users, Home } from "lucide-react"
import api from "../../../lib/api"
import { useRouter } from "next/navigation"
import ProfileHeader from "../../../components/userComp/profile-header"
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
    fullName: "John Doe",
    email: "john@example.com",
    collegeName: "SVNIT",
    degree: "B.Tech",
    yearOfStudy: "3rd Year",
    contactNumber: "+91 9876543210",
    joinedDate: "15 Dec 2024",
  })

  const registeredEvents = [
    { id: 1, name: "AI Workshop", category: "Technical", date: "25 Jan 2025", status: "registered" },
    { id: 2, name: "Leadership Challenge", category: "Managerial", date: "28 Jan 2025", status: "registered" },
    { id: 3, name: "Robotics Competition", category: "Technical", date: "26 Jan 2025", status: "completed" },
  ]

  const registeredWorkshops = [
    { id: 1, name: "Web Development Bootcamp", instructor: "John Smith", date: "20 Jan 2025", status: "registered" },
    { id: 2, name: "Machine Learning Basics", instructor: "Sarah Wilson", date: "22 Jan 2025", status: "registered" },
  ]

  const accommodations = [
    { id: 1, hostel: "Hostel A", room: "A-205", checkIn: "24 Jan 2025", checkOut: "30 Jan 2025", status: "booked" },
  ]

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true)
      setError("")
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null
        if (!token) {
          setError("You are not logged in.")
          return
        }
        const res = await api.get("/teams", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setTeams(res.data?.data?.teams || [])
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to load teams")
      } finally {
        setLoading(false)
      }
    }
    fetchTeams()
  }, [])

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with User Info */}
        <ProfileHeader
          userData={userData}
          onEditProfile={() => {}}
          onResetPassword={setShowResetPassword}
          showResetPassword={showResetPassword}
        />

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
