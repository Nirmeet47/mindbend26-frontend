"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, Check } from "lucide-react";
import axios, { AxiosError } from "axios";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  // Removed unused state to satisfy lint rules
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setSuccess("OTP has been sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<{ message?: string }>;
        setError(
          axErr.response?.data?.message ||
            "Failed to send OTP. Please try again."
        );
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        name: username,
        email,
        password,
        otp,
      });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<{ message?: string }>;
        setError(
          axErr.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
            Join TechFest
          </h1>
          <p className="text-cyan-300 text-sm uppercase tracking-[0.2em] font-light">
            Create Your Account
          </p>
        </div>

        {/* Alert Message for SVNIT Students */}
        <div className="mb-8 p-4 border-2 border-orange-500/50 bg-orange-950/20 backdrop-blur-sm">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-orange-300 text-sm font-semibold">
                SVNIT Students Special Notice
              </p>
              <p className="text-orange-200/80 text-xs mt-1">
                Use your institute ID for signup - all events will be free for
                SVNITians!
              </p>
            </div>
          </div>
        </div>

        {/* Signup Form Card */}
        <div
          className="relative p-8 overflow-hidden backdrop-blur-sm transition-all duration-500 border-2 border-cyan-500/60 bg-slate-950/80 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)]"
          style={{
            clipPath:
              "polygon(0 0, 98% 0, 100% 2%, 100% 98%, 98% 100%, 0 100%, 0 98%, 0 2%)",
          }}
        >
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 1
                    ? "bg-cyan-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {step > 1 ? <Check size={16} /> : "1"}
              </div>
              <span
                className={`text-sm uppercase tracking-[0.1em] ${
                  step >= 1 ? "text-cyan-300" : "text-cyan-300/50"
                }`}
              >
                Email
              </span>
            </div>
            <div
              className={`flex-1 h-0.5 mx-2 ${
                step === 2 ? "bg-cyan-500" : "bg-cyan-500/30"
              }`}
            />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 2
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-700 text-cyan-300/50"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm uppercase tracking-[0.1em] ${
                  step === 2 ? "text-cyan-300" : "text-cyan-300/50"
                }`}
              >
                Setup
              </span>
            </div>
          </div>

          {/* Form Content */}
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-6 relative z-10">
              {/* Email Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Email Address *
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

              {error && (
                <div className="text-red-400 text-sm p-2 bg-red-950/30 border border-red-500/40 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-400 text-sm p-2 bg-green-950/30 border border-green-500/40 rounded">
                  {success}
                </div>
              )}

              {/* Send OTP Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
              >
                <span className="relative z-10">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyAndRegister}
              className="space-y-6 relative z-10"
            >
              {/* Username Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  placeholder="Your username"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Password *
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

              {/* Confirm Password Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* OTP Field */}
              <div>
                <label className="block text-cyan-300 text-sm uppercase tracking-[0.15em] font-light mb-2">
                  Verify OTP *
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-cyan-500/40 text-white placeholder-cyan-300/50 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all"
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm p-2 bg-red-950/30 border border-red-500/40 rounded">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-green-400 text-sm p-2 bg-green-950/30 border border-green-500/40 rounded">
                  {success}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setSuccess("");
                  }}
                  className="flex-1 py-3 border-2 border-cyan-500/60 text-cyan-300 font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:bg-cyan-600/10 hover:border-cyan-400"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold uppercase tracking-[0.15em] transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {loading ? "Registering..." : "Complete Registration"}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Background Glow */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8">
          <div className="flex justify-center items-center gap-4">
            <p className="text-cyan-300/60 text-xs uppercase tracking-[0.2em]">
              Already have an account?
            </p>
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Login Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
