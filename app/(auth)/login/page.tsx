"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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

  // --- LOGIC PRESERVED FROM ORIGINAL ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // const token = res.data?.data?.token;
      // if (token) {
      //   localStorage.setItem("mb_admin_token", token);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/user/dashboard"); // Redirect to user dashboard after login
        }, 1000);
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
        setForgotError(
          axErr.response?.data?.message || "Failed to send reset link."
        );
      } else {
        setForgotError("Failed to send reset link.");
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
        setResetError(
          axErr.response?.data?.message || "Failed to reset password."
        );
      } else {
        setResetError("Failed to reset password.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-20 font-sans">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-95"
        src="/videos/auth.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-[440px]">
        {/* Mirror Reflective Card */}
        <div className="relative p-[1.5px] rounded-[40px] bg-black shadow-2xl overflow-hidden">
          <div className="relative bg-[#0d0d12]/50 backdrop-blur-xl rounded-[39px] p-10 overflow-hidden">
            {/* RADIUM BLUE TOP-LEFT FLARE */}
            <div className="absolute -top-20 -left-20 w-75 h-75 bg-blue-800/20 rounded-full blur-[70px] pointer-events-none" />

            {/* REFLECTIVE DOT GRID */}
            <div
              className="absolute top-8 right-8 w-24 h-24 opacity-30 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
                maskImage: "radial-gradient(circle, black, transparent 70%)",
                WebkitMaskImage:
                  "radial-gradient(circle, black, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <header className="mb-10">
                <h1 className="text-4xl font-semibold text-white tracking-wide" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                  Welcome back:
                </h1>
                <p className="text-gray-400 font-medium mt-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Sign in to your account
                </p>
              </header>

              {/* VIEW 1: LOGIN FORM */}
              {!showForgotPassword && !showResetPassword && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="relative group" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    <Mail
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="megamindbend@gmail.com"
                      className="w-full pl-14 pr-6 py-4 bg-[#16161c] border border-white/5 rounded-full text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
                      required
                    />
                  </div>
                  <div className="relative group" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    <Lock
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-14 pr-14 py-4 bg-[#16161c] border border-white/5 rounded-full text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs px-6">{error}</p>
                  )}
                  {success && (
                    <p className="text-blue-400 text-xs px-6">{success}</p>
                  )}

                  <div className="flex justify-end px-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] active:scale-95"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              )}

              {/* VIEW 2: FORGOT PASSWORD */}
              {showForgotPassword && (
                <form onSubmit={handleForgotPassword} className="space-y-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-8 py-4 bg-[#16161c] border border-white/5 rounded-full text-white outline-none"
                    required
                  />
                  {forgotError && (
                    <p className="text-red-400 text-xs px-6">{forgotError}</p>
                  )}
                  {forgotSuccess && (
                    <p className="text-blue-400 text-xs px-6">
                      {forgotSuccess}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full py-4 bg-blue-500 text-black font-bold rounded-full"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-gray-500 text-sm"
                  >
                    Back to Login
                  </button>
                </form>
              )}

              {/* VIEW 3: RESET PASSWORD */}
              {showResetPassword && (
                <form onSubmit={handleResetPassword} className="space-y-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  <input
                    type="text"
                    value={resetOTP}
                    onChange={(e) => setResetOTP(e.target.value)}
                    placeholder="6-digit OTP"
                    className="w-full px-8 py-4 bg-[#16161c] border border-blue-500/20 rounded-full text-white outline-none text-center font-bold tracking-[0.4em]"
                    required
                  />
                  <div className="relative">
                    <input
                      type={showResetPasswordField ? "text" : "password"}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="New Password"
                      className="w-full px-8 py-4 bg-[#16161c] border border-white/5 rounded-full text-white outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowResetPasswordField(!showResetPasswordField)
                      }
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showResetConfirmField ? "text" : "password"}
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder="Confirm Password"
                      className="w-full px-8 py-4 bg-[#16161c] border border-white/5 rounded-full text-white outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowResetConfirmField(!showResetConfirmField)
                      }
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  {resetError && (
                    <p className="text-red-400 text-xs px-6">{resetError}</p>
                  )}
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-4 bg-blue-500 text-black font-bold rounded-full"
                  >
                    {resetLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}

              <footer className="mt-10 text-center" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <p className="text-gray-500 text-sm">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-blue-500 font-bold hover:underline decoration-2 underline-offset-4"
                  >
                    Sign Up
                  </Link>
                </p>
              </footer>
            </div>
          </div>

          {/* HIGH-END BORDER HIGHLIGHT REFRACTION */}
          <div className="absolute inset-0 rounded-[40px] pointer-events-none border border-white/10 shadow-[inset_0_1.5px_0_rgba(255,255,255,0.15)]" />
        </div>
      </div>
    </div>
  );
}
