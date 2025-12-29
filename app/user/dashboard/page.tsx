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

import { DetailedTeam } from "@/types"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showResetPassword, setShowResetPassword] = useState(false)
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

  // Redirect to /login if not authenticated (rely on API 401)
  useEffect(() => {
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
  }, [])

  // Fetch data for each tab only when selected
  useEffect(() => {
    
    // const token = typeof window !== "undefined" ? localStorage.getItem("mb_admin_token") : null
    // if (!token) return

    if (activeTab === "teams" && teams.length === 0) {
      setLoading(true)
      api.get("/users/teams")
        .then((res) => setTeams(res.data?.data?.teams || []))
        .catch((err) => setError(err?.response?.data?.message || "Failed to load teams"))
        .finally(() => setLoading(false))
    }
    if (activeTab === "events" && registeredEvents.length === 0) {
      setLoading(true)
      api.get("/users/registered-events")
        .then((res) => {
          setRegisteredEvents(res.data?.data?.events || []);
          setPendingInvites(res.data?.data?.pendingInvites || []);
        })
        .catch((err) => setError(err?.response?.data?.message || "Failed to load events"))
        .finally(() => setLoading(false))
    }
    if (activeTab === "workshops" && registeredWorkshops.length === 0) {
      setLoading(true)
      api.get("/workshops/my-registrations")
        .then((res) => setRegisteredWorkshops(res.data?.data?.workshops || []))
        .catch((err) => setError(err?.response?.data?.message || "Failed to load workshops"))
        .finally(() => setLoading(false))
    }
    if (activeTab === "accommodation" && accommodations.length === 0) {
      setLoading(true)
      api.get("/users/accommodation")
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
                className={`flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm whitespace-nowrap transition-all border-b-2 ${
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
          {activeTab === "events" && (
            <RegisteredEventsTab events={registeredEvents} />
          )}

          {/* Workshops Tab */}
          {activeTab === "workshops" && <WorkshopsTab workshops={registeredWorkshops} />}

          {/* Teams Tab */}
          {activeTab === "teams" && (
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
                  alert(errorMessage);
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
          {activeTab === "accommodation" && <AccommodationTab accommodations={accommodations} />}
        </div>
      </div>
    </div>
  )
}
