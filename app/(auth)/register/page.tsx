"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Check, AlertCircle } from "lucide-react";
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
  const router = useRouter();

  // --- LOGIC PRESERVED FROM ORIGINAL ---
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setSuccess("OTP sent to your email.");
      setStep(2);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<{ message?: string }>;
        setError(axErr.response?.data?.message || "Failed to send OTP.");
      } else {
        setError("Failed to send OTP.");
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
      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axErr = err as AxiosError<{ message?: string }>;
        setError(axErr.response?.data?.message || "Registration failed.");
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050508] flex items-center justify-center px-4 py-10 font-sans" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      <video
        className="absolute inset-0 w-full h-full object-cover scale-90"
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
              <header className="mb-6">
                <h1 className="text-4xl font-semibold text-white tracking-wide" style={{ fontFamily: "Barlow Condensed, sans-serif" }}>
                  Join us:
                </h1>
                <p className="text-gray-400 font-medium mt-1 uppercase text-xs tracking-[0.2em]">
                  Create Account
                </p>
              </header>

              {/* SVNIT Special Alert Styled for Mirror Theme */}
              <div className="mb-8 p-4 rounded-3xl bg-blue-500/5 border border-blue-500/10 flex gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  <strong className="text-blue-300">SVNIT Students:</strong> Use
                  institute ID for signup — all events will be free!
                </p>
              </div>

              {/* Progress Stepper Styled like the Mirror dots */}
              <div className="flex items-center gap-2 mb-8 px-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    step >= 1
                      ? "bg-blue-900 shadow-[0_0_8px_#60a5fa]"
                      : "bg-white/10"
                  }`}
                />
                <div
                  className={`h-[1px] flex-1 ${
                    step >= 2 ? "bg-blue-500/20" : "bg-white/10"
                  }`}
                />
                <div
                  className={`w-2 h-2 rounded-full ${
                    step >= 2
                      ? "bg-blue-900 shadow-[0_0_8px_#60a5fa]"
                      : "bg-white/10"
                  }`}
                />
              </div>

              <form
                onSubmit={step === 1 ? handleSendOTP : handleVerifyAndRegister}
                className="space-y-4"
              >
                {step === 1 ? (
                  <div className="relative group">
                    <Mail
                      className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400"
                      size={18}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Institute Email address"
                      className="w-full pl-14 pr-6 py-4 bg-[#16161c] border border-white/5 rounded-full text-white placeholder-gray-600 outline-none focus:border-blue-500/50 transition-all"
                      required
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      className="w-full px-8 py-4 bg-[#16161c] border border-white/5 rounded-full text-white outline-none focus:border-blue-500/50 transition-all"
                      required
                    />
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-8 py-4 bg-[#16161c] border border-white/5 rounded-full text-white outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full px-8 py-4 bg-[#16161c] border border-white/5 rounded-full text-white outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        <Eye size={18} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Verify 6-digit OTP"
                      className="w-full px-8 py-4 bg-[#16161c] border border-blue-500/30 rounded-full text-white text-center font-bold tracking-[0.4em]"
                      required
                    />
                  </div>
                )}

                {error && (
                  <p className="text-red-400 text-xs px-6 text-center">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-blue-400 text-xs px-6 text-center">
                    {success}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                >
                  {loading
                    ? step === 1
                      ? "Sending..."
                      : "Registering..."
                    : step === 1
                    ? "Send OTP"
                    : "Complete Registration"}
                </button>
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-gray-500 text-xs font-bold uppercase tracking-widest"
                  >
                    Back
                  </button>
                )}
              </form>

              <footer className="mt-10 text-center">
                <p className="text-gray-500 text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-500 font-bold hover:underline decoration-2 underline-offset-4"
                  >
                    Login Here
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
