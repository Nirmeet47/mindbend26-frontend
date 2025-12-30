"use client"

import { useState } from "react"

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
    <div className="mt-8 pt-8 border-t border-cyan-500/30">
      <h3 className="text-cyan-300 font-bold uppercase tracking-[0.15em] mb-4 text-sm">Change Password</h3>
      <div className="space-y-3 max-w-sm">
        <input
          type="password"
          placeholder="Current Password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
        />
        <input
          type="password"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full px-4 py-2 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all text-sm"
        />
        <button className="w-full py-2 bg-linear-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-sm mt-4">
          Update Password
        </button>
      </div>
    </div>
  )
}
