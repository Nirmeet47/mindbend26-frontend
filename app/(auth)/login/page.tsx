"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [forgotError, setForgotError] = useState("");
  // Reset password states
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetOTP, setResetOTP] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [showResetPasswordField, setShowResetPasswordField] = useState(false);
  const [showResetConfirmField, setShowResetConfirmField] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      const token = res.data?.data?.token;
      if (token) {
        localStorage.setItem("mb_admin_token", token);
        setSuccess("Login successful!");
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setForgotLoading(true);
    try {
      await api.post("/auth/forgot-password", { email: forgotEmail });
      setForgotSuccess(
        "OTP has been sent to your email. Please check your inbox."
      );
      setShowResetPassword(true);
      setShowForgotPassword(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<{ message?: string }>;
        const msg = axErr.response?.data?.message;
        setForgotError(msg || "Failed to send reset link. Please try again.");
      } else {
        setForgotError("Failed to send reset link. Please try again.");
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    setResetSuccess("");

    if (resetNewPassword !== resetConfirmPassword) {
      setResetError("Passwords do not match");
      return;
    }

    if (resetNewPassword.length < 6) {
      setResetError("Password must be at least 6 characters long");
      return;
    }

    setResetLoading(true);
    try {
      await api.post("/auth/reset-password", {
        email: forgotEmail,
        otp: resetOTP,
        newPassword: resetNewPassword,
      });
      setResetSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setShowResetPassword(false);
        setResetOTP("");
        setResetNewPassword("");
        setResetConfirmPassword("");
        setForgotEmail("");
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<{ message?: string }>;
        const msg = axErr.response?.data?.message;
        setResetError(msg || "Failed to reset password. Please try again.");
      } else {
        setResetError("Failed to reset password. Please try again.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Futuristic Header */}
        <div className="mb-12 text-center">
          <h1
            className="text-4xl md:text-5xl font-black text-white mb-3 uppercase tracking-tighter"
            style={{
              fontStyle: "italic",
              textShadow: "0 0 40px rgba(6, 182, 212, 0.3)",
            }}
          >
            TechFest
          </h1>
          <p className="text-cyan-300 text-sm uppercase tracking-[0.2em] font-light">
            Enter the Arena
          </p>
        </div>

        {/* Login Form Card */}
        <div
          className="relative p-8 overflow-hidden backdrop-blur-sm transition-all duration-500 border-2 border-cyan-500/60 bg-slate-950/80 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"
          style={{
            clipPath:
              "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          {/* Form Content */}
          {!showForgotPassword ? (
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              {/* Email Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  placeholder="your@email.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm mb-4 p-2 bg-red-950/30 border border-red-500/40 rounded">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="text-green-400 text-sm mb-4 p-2 bg-green-950/30 border border-green-500/40 rounded">
                  {success}
                </div>
              )}

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-cyan-300 hover:text-cyan-200 text-sm uppercase tracking-[0.1em] transition-colors"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:from-cyan-500 hover:to-blue-500 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10">
                  {loading ? "Logging in..." : "Login"}
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleForgotPassword}
              className="space-y-6 relative z-10"
            >
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  placeholder="your@email.com"
                  required
                />
                <p className="text-cyan-300/60 text-xs mt-2">
                  Enter your email and we'll send you a password reset link
                </p>
              </div>

              {forgotError && (
                <div className="text-red-400 text-sm p-2 bg-red-950/30 border border-red-500/40 rounded">
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="text-green-400 text-sm p-2 bg-green-950/30 border border-green-500/40 rounded">
                  {forgotSuccess}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-3 border-2 border-cyan-500/60 text-cyan-300 font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-cyan-600/10 hover:border-cyan-400"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}

          {/* Reset Password Form */}
          {showResetPassword && (
            <form
              onSubmit={handleResetPassword}
              className="space-y-6 relative z-10"
            >
              <h3 className="text-cyan-300 text-lg font-bold uppercase tracking-[0.15em] text-center mb-4">
                Reset Your Password
              </h3>

              {/* OTP Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Enter OTP from Email
                </label>
                <input
                  type="text"
                  value={resetOTP}
                  onChange={(e) => setResetOTP(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  placeholder="6-digit OTP"
                  maxLength={6}
                  required
                />
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPasswordField ? "text" : "password"}
                    value={resetNewPassword}
                    onChange={(e) => setResetNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowResetPasswordField(!showResetPasswordField)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showResetPasswordField ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showResetConfirmField ? "text" : "password"}
                    value={resetConfirmPassword}
                    onChange={(e) => setResetConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowResetConfirmField(!showResetConfirmField)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showResetConfirmField ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {resetError && (
                <div className="text-red-400 text-sm p-2 bg-red-950/30 border border-red-500/40 rounded">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="text-green-400 text-sm p-2 bg-green-950/30 border border-green-500/40 rounded">
                  {resetSuccess}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetOTP("");
                    setResetNewPassword("");
                    setResetConfirmPassword("");
                  }}
                  className="flex-1 py-3 border-2 border-cyan-500/60 text-cyan-300 font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-cyan-600/10 hover:border-cyan-400"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8 flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <span className="relative px-4 text-cyan-400 text-xs uppercase tracking-[0.2em]">
              New User?
            </span>
          </div>

          {/* Sign Up Link */}
          <Link
            href="/auth/signup"
            className="block w-full py-3 text-center border-2 border-cyan-500/60 text-cyan-300 font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-cyan-600/10 hover:border-cyan-400 hover:text-cyan-200"
          >
            Create Account
          </Link>

          {/* Background Glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <p className="text-cyan-300/60 text-xs uppercase tracking-[0.2em]">
            Secure • Verified • TechFest 2025
          </p>
        </div>
      </div>
    </div>
  );
}
