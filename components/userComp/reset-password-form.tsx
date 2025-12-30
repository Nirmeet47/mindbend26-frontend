"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

type ResetPasswordFormProps = {
  isOpen: boolean
  onClose: () => void
}

export default function ResetPasswordForm({ isOpen, onClose }: ResetPasswordFormProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  if (!isOpen) return null

  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-8 pt-8 border-t border-white/10"
    >
      <h3 className="text-[#33ABB9] font-bold uppercase tracking-[0.15em] mb-4 text-sm font-mono flex items-center gap-2">
        <Lock className="w-4 h-4" />
        [ CHANGE PASSWORD ]
      </h3>
      <div className="space-y-3 max-w-sm">
        <input
          type="password"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
        />
        <input
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#33ABB9]/50 focus:shadow-[0_0_20px_rgba(51,171,185,0.2)] transition-all text-sm"
        />
        <button className="w-full py-2 bg-linear-to-r from-[#33ABB9] to-[#184344] text-white font-bold uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(51,171,185,0.4)] text-sm mt-4">
          Update Password
        </button>
      </div>
    </motion.div>
  )
}
