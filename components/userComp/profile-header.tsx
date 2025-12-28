"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { logout } from "../../lib/auth"
import { LogOut, Edit2, Lock, Save, X } from "lucide-react"
import { logout } from "@/lib/auth"

type ProfileHeaderProps = {
  userData: {
    fullName: string
    email: string
    collegeName: string
    yearOfStudy: string
    contactNumber: string
    joinedDate: string
  }
  onEditProfile: (data: any) => void
  onResetPassword: (show: boolean) => void
  showResetPassword: boolean
}

export default function ProfileHeader({
  userData,
  onEditProfile,
  onResetPassword,
  showResetPassword,
}: ProfileHeaderProps) {

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editData, setEditData] = useState(userData)
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  }

  const handleSaveProfile = () => {
    onEditProfile(editData)
    setShowEditProfile(false)
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-4xl font-black text-white uppercase tracking-tighter"
          style={{ fontStyle: "italic", textShadow: "0 0 40px rgba(6, 182, 212, 0.3)" }}
        >
          My Profile
        </h1>
        <button className="flex items-center gap-2 px-6 py-2 bg-red-600/80 hover:bg-red-700 text-white font-bold uppercase tracking-[0.1em] transition-all border border-red-500/60 text-sm" onClick={() => {
          if (confirm('Are you sure you want to logout?')) {
            logout();
          }
        }}>
          <LogOut size={18} />
          Logout
        </button>
      </div>

      <div
        className="p-8 border-2 border-cyan-500/60 bg-slate-950/80 backdrop-blur-sm hover:border-cyan-400 transition-all"
        style={{
          clipPath: "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center border-2 border-cyan-400/60">
              <span className="text-3xl font-black text-white">
                {userData.fullName.charAt(0)}
                {userData.fullName.split(" ")[1]?.charAt(0) || "D"}
              </span>
            </div>

            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">{userData.fullName}</h2>
              <p className="text-cyan-300 text-sm mb-1">{userData.email}</p>
              <p className="text-cyan-400/70 text-xs uppercase tracking-[0.15em]">
                {userData.collegeName} {userData.yearOfStudy && `• ${userData.yearOfStudy}`}
              </p>
              <p className="text-cyan-300/60 text-xs mt-2">Joined {userData.joinedDate}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setShowEditProfile(!showEditProfile)
                setEditData(userData)
              }}
              className="flex items-center gap-2 px-4 py-2 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-600/10 hover:border-cyan-400 transition-all text-sm uppercase tracking-[0.1em] font-semibold"
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
            <button
              onClick={() => onResetPassword(!showResetPassword)}
              className="flex items-center gap-2 px-4 py-2 border border-cyan-500/60 text-cyan-300 hover:bg-cyan-600/10 hover:border-cyan-400 transition-all text-sm uppercase tracking-[0.1em] font-semibold"
            >
              <Lock size={16} />
              Reset Password
            </button>
          </div>
        </div>

        {showEditProfile && (
          <div className="mt-8 pt-8 border-t border-cyan-500/30">
            <h3 className="text-cyan-300 font-bold uppercase tracking-[0.15em] mb-4 text-sm">Edit Personal Details</h3>
            <div className="space-y-3 max-w-2xl">
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                placeholder="Full Name"
                className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
              />
              {/* Email is not editable */}
              <input
                type="email"
                value={editData.email}
                disabled
                placeholder="Email"
                className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 opacity-60 cursor-not-allowed text-sm"
              />
              <input
                type="text"
                value={editData.collegeName}
                onChange={(e) => setEditData({ ...editData, collegeName: e.target.value })}
                placeholder="College Name"
                className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
              />
              <div className="relative">
                <select
                  value={editData.yearOfStudy}
                  onChange={(e) => setEditData({ ...editData, yearOfStudy: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-900/80 border-2 border-cyan-500/60 text-cyan-200 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm rounded appearance-none pr-8"
                  style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
                >
                  <option value="" className="bg-slate-900 text-cyan-400">Select Year of Study</option>
                  {[1, 2, 3, 4, 5].map((year) => (
                    <option key={year} value={year} className="bg-slate-900 text-cyan-400">{year}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400">
                  ▼
                </span>
              </div>
              <input
                type="text"
                value={editData.contactNumber}
                onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                placeholder="Contact Number"
                className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
              />
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm flex items-center justify-center gap-2"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-2 border border-cyan-500/60 text-cyan-300 font-bold uppercase tracking-[0.15em] hover:bg-cyan-600/10 text-sm flex items-center justify-center gap-2"
                >
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
