"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Edit2, Lock, Save, X } from "lucide-react"
import { logout } from "@/lib/auth"
import { motion } from "framer-motion"
import LogoutModal from "../ui/LogoutModal";

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
}

export default function ProfileHeader({
  userData,
  onEditProfile,
}: ProfileHeaderProps) {

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [editData, setEditData] = useState(userData)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const router = useRouter();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    router.push("/login");
    setShowLogoutModal(false);
  }

  const handleSaveProfile = () => {
    onEditProfile(editData);
    setShowEditProfile(false);
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-orbitron"
          style={{ textShadow: "0 0 40px rgba(51, 171, 185, 0.3)" }}
        >
          My Profile
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold uppercase tracking-widest transition-all border border-red-500/30 hover:border-red-500/50 text-sm"
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        {/* Background Shape */}
        <div className="absolute inset-0 bg-white/5 border-2 border-[#33ABB9]/60 transition-colors hover:border-[#33ABB9]" />

        <div className="relative p-4 md:p-8 overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-start justify-between md:gap-6 gap-4">
            <div className="text-center md:text-left min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-2 font-orbitron overflow-wrap break-word">{userData.fullName}</h2>
              <p className="text-[#33ABB9] text-sm mb-1 break-all">{userData.email}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wide overflow-wrap break-word">
                {userData.collegeName} {userData.yearOfStudy && `• Year ${userData.yearOfStudy}`}
              </p>
              <p className="text-gray-500 text-xs mt-2 font-mono">Joined {userData.joinedDate}</p>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end gap-2 shrink-0 justify-center md:justify-end">
              <div className="flex flex-1 flex-row md:flex-col gap-2 w-auto md:w-36 justify-center md:justify-end">
                <button
                  onClick={() => {
                    setShowEditProfile(!showEditProfile)
                    setEditData(userData)
                  }}
                  className="relative flex items-center gap-1 px-3 py-2 text-[#33ABB9] hover:bg-[#33ABB9]/10 transition-all text-xs uppercase tracking-normal font-semibold border border-gray-700/30 bg-black/20 whitespace-nowrap w-auto md:w-36"
                >
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]/60" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]/60" />
                  <Edit2 size={14} />
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="relative flex items-center gap-1 px-3 py-2 text-[#33ABB9] hover:bg-[#33ABB9]/10 transition-all text-xs uppercase tracking-normal font-semibold border border-gray-700/30 bg-black/20 whitespace-nowrap w-auto md:w-36"
                >
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]/60" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]/60" />
                  <Lock size={14} />
                  Reset Password
                </button>
              </div>
            </div>
          </div>

          {showEditProfile && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-[#33ABB9] font-bold uppercase tracking-[0.15em] mb-4 text-sm font-mono">[ EDIT PERSONAL DETAILS ]</h3>
              <div className="space-y-3 max-w-2xl">
                <input
                  type="text"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  placeholder="Full Name"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
                />
                {/* Email is not editable */}
                <input
                  type="email"
                  value={editData.email}
                  disabled
                  placeholder="Email"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-gray-500 placeholder-gray-500 opacity-60 cursor-not-allowed text-sm"
                />
                <input
                  type="text"
                  value={editData.collegeName}
                  onChange={(e) => setEditData({ ...editData, collegeName: e.target.value })}
                  placeholder="College Name"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
                />
                <div className="relative">
                  <select
                    value={editData.yearOfStudy}
                    onChange={(e) => setEditData({ ...editData, yearOfStudy: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-white/10 text-white focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm appearance-none pr-8"
                  >
                    <option value="" className="bg-[#0a0a0a] text-gray-400">Select Year of Study</option>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <option key={year} value={year} className="bg-[#0a0a0a] text-white">{year}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-[#33ABB9]">
                    ▼
                  </span>
                </div>
                <input
                  type="text"
                  value={editData.contactNumber}
                  onChange={(e) => setEditData({ ...editData, contactNumber: e.target.value })}
                  placeholder="Contact Number"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 relative px-6 py-3 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-base overflow-hidden transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300 opacity-20" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Save size={16} /> Save Changes
                    </span>
                  </button>
                  <button
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 py-2 border border-white/10 text-gray-400 font-bold uppercase tracking-[0.15em] hover:bg-white/5 text-sm flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showResetPassword && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <h3 className="text-[#33ABB9] font-bold uppercase tracking-[0.15em] mb-4 text-sm font-mono">[ CHANGE PASSWORD ]</h3>
              <div className="space-y-3 max-w-2xl">
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Current Password"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
                />
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="New Password"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
                />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm New Password"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      if (passwordData.newPassword !== passwordData.confirmPassword) {
                        alert("Passwords don't match")
                        return
                      }
                      if (!passwordData.currentPassword || !passwordData.newPassword) {
                        alert("Please fill all fields")
                        return
                      }
                      // Here you would call an API to change password
                      console.log("Change password:", passwordData)
                      setShowResetPassword(false)
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    }}
                    className="flex-1 relative px-6 py-3 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-base overflow-hidden transition-all flex items-center justify-center gap-2 cursor-pointer group"
                  >
                    <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover:translate-x-0 transition-transform duration-300 opacity-20" />
                    <span className="relative z-10 flex items-center gap-2">
                      <Save size={16} /> Update Password
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setShowResetPassword(false)
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    }}
                    className="flex-1 py-2 border border-white/10 text-gray-400 font-bold uppercase tracking-[0.15em] hover:bg-white/5 text-sm flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  )
}
