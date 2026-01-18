"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Hash, Lock, Mail, User } from "lucide-react";
import axios, { AxiosError } from "axios";
import api from "../../../lib/api";
import { showErrorToast, showSuccessToast, toastMessages } from "../../../utils/toast";

export type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Array<{ field?: string; message?: string; value?: unknown }>;
  errorCode?: string;
};

export const getApiErrorMessage = (err: unknown, fallback: string) => {
  if (!axios.isAxiosError(err)) return fallback;

  const axErr = err as AxiosError<ApiErrorResponse>;
  const data = axErr.response?.data;
  const firstErrorMsg = Array.isArray(data?.errors) ? data?.errors?.[0]?.message : undefined;

  return firstErrorMsg || data?.message || fallback;
};

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const isStep2 = currentStep === 2;
  const frameScaleY = isStep2 ? 1.32 : 1;
  const titleY = isStep2 ? 140 : 109.925;

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [, setFormError] = useState("");
  const [, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setIsSubmitting(true);
    try {
      await api.post("/auth/send-otp", { email });
      setFormSuccess("OTP sent to your email.");
      showSuccessToast("OTP sent to your email.");
      setCurrentStep(2);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Failed to send OTP.");
      setFormError(msg);
      showErrorToast(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setFormError(msg);
      showErrorToast(msg);
      return;
    }
    if (password.length < 6) {
      const msg = "Password must be at least 6 characters long";
      setFormError(msg);
      showErrorToast(msg);
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/auth/verify-otp", {
        name: username,
        email,
        password,
        otp,
      });
      setFormSuccess("Registration successful! Redirecting...");
      showSuccessToast(toastMessages.auth.signupSuccess);
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, "Registration failed.");
      setFormError(msg);
      showErrorToast(toastMessages.auth.signupError(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-20">
      <video
        className="absolute inset-0 w-full h-full object-cover scale-95 pointer-events-none"
        src="/videos/auth.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/55" />

      <div className={"relative z-10 w-full max-w-xl " + (isStep2 ? "pb-40" : "")}
      >
        <svg
          version="1.2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1500 1000"
          className="w-full h-auto"
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="g1" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(183.243,0,0,25.841,318.686,120.231)">
              <stop offset="0" stopColor="#4bdcff" />
              <stop offset="1" stopColor="#058aa3" />
            </linearGradient>
            <linearGradient id="g2" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(43.635,0,0,25.841,501.929,120.231)">
              <stop offset="0" stopColor="#bdf3ff" />
              <stop offset="1" stopColor="#07acca" />
            </linearGradient>
            <linearGradient id="g3" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(183.243,0,0,25.841,997.584,120.231)">
              <stop offset="0" stopColor="#4bdcff" />
              <stop offset="1" stopColor="#058aa3" />
            </linearGradient>
            <linearGradient id="g4" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(43.635,0,0,25.841,953.949,120.231)">
              <stop offset="0" stopColor="#bdf3ff" />
              <stop offset="1" stopColor="#07acca" />
            </linearGradient>
            <linearGradient id="g5" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(86.928,-150.564,151.635,87.547,211.368,194.187)">
              <stop offset="0" stopColor="#bdf3ff" />
              <stop offset=".2" stopColor="#4bdcff" />
              <stop offset=".5" stopColor="#07acca" />
              <stop offset=".8" stopColor="#058aa3" />
              <stop offset="1" stopColor="#034a57" />
            </linearGradient>
            <linearGradient id="g6" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(116.275,-201.394,18.178,10.495,128.566,228.066)">
              <stop offset="0" stopColor="#07acca" />
              <stop offset=".35" stopColor="#058aa3" />
              <stop offset=".7" stopColor="#4bdcff" />
              <stop offset="1" stopColor="#bdf3ff" />
            </linearGradient>
            <linearGradient id="g7" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(116.275,-201.394,435.012,251.154,1203.503,228.066)">
              <stop offset="0" stopColor="#bdf3ff" />
              <stop offset=".25" stopColor="#4bdcff" />
              <stop offset=".5" stopColor="#07acca" />
              <stop offset=".75" stopColor="#058aa3" />
              <stop offset="1" stopColor="#045f77" />
            </linearGradient>
            <linearGradient id="g8" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(86.928,-150.564,370.527,213.924,995.2,194.187)">
              <stop offset="0" stopColor="#045f77" />
              <stop offset=".3" stopColor="#058aa3" />
              <stop offset=".6" stopColor="#07acca" />
              <stop offset=".9" stopColor="#4bdcff" />
              <stop offset="1" stopColor="#bdf3ff" />
            </linearGradient>
            <linearGradient id="g9" x2="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(848.847,-1470.245,1606.306,927.401,14.082,979.959)">
              <stop offset="0" stopColor="#bdf3ff" />
              <stop offset=".18" stopColor="#4bdcff" />
              <stop offset=".38" stopColor="#07acca" />
              <stop offset=".55" stopColor="#058aa3" />
              <stop offset=".72" stopColor="#045f77" />
              <stop offset=".88" stopColor="#034a57" />
              <stop offset="1" stopColor="#022d35" />
            </linearGradient>
          </defs>

          <g id="OBJECTS">
            <g id="Group">
              <text
                id="REGISTER"
                style={{
                  transform: `matrix(3.06,0,0,4.653,747.575,${titleY})`,
                  fontSize: "12px",
                  fill: "#ffffff",
                  fontWeight: 900,
                  fontFamily: "Poppins-Black, Poppins",
                  letterSpacing: "0.06em",
                }}
                textAnchor="middle"
              >
                REGISTER
              </text>
              <g
                style={{
                  transform: `scaleY(${frameScaleY})`,
                  transformOrigin: "top center",
                  transformBox: "fill-box",
                  transition: "transform 700ms ease",
                }}
              >
              <g id="Group">
                <path id="Path" fillRule="evenodd" fill="none" stroke="#07acca" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="6" strokeDasharray="0,20" d="m291.52 55.62h247.23" />
                <path id="Path" fillRule="evenodd" fill="none" stroke="#07acca" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="6" strokeDasharray="0,20" d="m1207.99 55.62h-247.22" />
              </g>
              <g id="Group">
                <g id="Group">
                  <path id="Path" fill="url(#g1)" d="m501.93 146.07h-164.63l-18.61-25.84h164.62z" />
                  <path id="Path" fill="url(#g2)" d="m545.56 146.07h-25.02l-18.61-25.84h25.02z" />
                </g>
                <g id="Group">
                  <path id="Path" fill="url(#g3)" d="m997.58 146.07h164.63l18.62-25.84h-164.63z" />
                  <path id="Path" fill="url(#g4)" d="m953.95 146.07h25.02l18.61-25.84h-25.02z" />
                </g>
              </g>
              <g id="Group">
                <path id="Path" fillRule="evenodd" fill="none" stroke="#bdf3ff" strokeOpacity="0.55" strokeMiterlimit="10" strokeWidth="2" d="m164 316.14l76.99-109.32h706.84" />
              </g>
              <g id="Group">
                <path id="Path" fillRule="evenodd" fill="none" stroke="#bdf3ff" strokeOpacity="0.55" strokeMiterlimit="10" strokeWidth="2" d="m1336 740.01l-118.99 168.95h-1047.39" />
              </g>
              <g id="Group">
                <path id="Path" fillRule="evenodd" fill="none" stroke="#bdf3ff" strokeOpacity="0.55" strokeMiterlimit="10" strokeWidth="2" d="m1335.95 763.59l-114.09 161.99h-1047.38" />
              </g>
              <g id="Group">
                <path id="Path" fillRule="evenodd" fill="none" stroke="#bdf3ff" strokeOpacity="0.55" strokeMiterlimit="10" strokeWidth="2" d="m1336 787.03l-109.28 155.16h-1037.85" />
              </g>
              <path id="Compound Path" fillRule="evenodd" fill="none" stroke="url(#g5)" strokeMiterlimit="10" strokeWidth="6" d="m551.68 93.83h-314.47l-73.21 102.41" />
              <path id="Compound Path" fillRule="evenodd" fill="none" stroke="url(#g6)" strokeMiterlimit="10" strokeWidth="6" d="m260.58 93.83l-96.48 136.98" />
              <path id="Compound Path" fillRule="evenodd" fill="none" stroke="url(#g7)" strokeMiterlimit="10" strokeWidth="6" d="m1335.51 230.81l-96.47-136.98" />
              <path id="Compound Path" fillRule="evenodd" fill="none" stroke="url(#g8)" strokeMiterlimit="10" strokeWidth="6" d="m1335.51 196.24l-73.21-102.41h-314.47" />
              <path
                id="Compound Path"
                fillRule="evenodd"
                fill="none"
                stroke="url(#g9)"
                strokeMiterlimit="10"
                strokeWidth="8"
                d="m1335.46 1000h-1105.87c-25.59-36.34-39.95-56.71-65.54-93.06v-906.94h1105.87c25.6 36.34 39.95 56.71 65.54 93.06zm-387.63-906.17l-33.26-48.66h-329.63l-33.26 48.66 33.26 48.65h329.63z"
              />
              </g>
            </g>
          </g>

          <foreignObject x="300" y={isStep2 ? 280 : 35} width="950" height={isStep2 ? 1320 : 1060}>
            <div
              className={`w-full h-full flex justify-center transition-all duration-700 ease-out ${
                isStep2 ? "items-start pt-10" : "items-center pt-0"
              }`}
            >
              <div className="w-full px-2">
                <div className="flex items-center justify-between pb-3">
                  <p className="text-[#07acca]/70 font-mono text-2xl">STEP {currentStep}/2</p>
                  {currentStep === 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormError("");
                        setFormSuccess("");
                        setCurrentStep(1);
                      }}
                      className="text-[#4bdcff] hover:text-[#bdf3ff] transition-colors font-mono text-2xl cursor-pointer"
                    >
                      CHANGE EMAIL
                    </button>
                  )}
                </div>

                <div className={isStep2 ? "max-h-180 overflow-hidden pr-2 pb-10" : undefined}>
                  <form
                    onSubmit={currentStep === 1 ? handleSendOTP : handleVerifyAndRegister}
                    className="space-y-4"
                  >
                    {currentStep === 1 ? (
                      <>
                      <div className="relative group">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                          style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
                        >
                          <Mail className="text-[#4bdcff]" size={40} />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full pl-40 pr-3 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                          required
                        />
                      </div>

                      <div className="p-5 bg-[#07acca]/5 border border-[#07acca]/30 text-[#bdf3ff]/80 text-2xl font-mono">
                        <span className="text-[#4bdcff]">INFO:</span> We will send a 6-digit OTP to your email.
                      </div>

                      <div className="p-5 bg-[#07acca]/5 border border-[#07acca]/30 text-[#bdf3ff]/90 text-2xl font-mono">
                        <span className="text-[#4bdcff]">SVNIT Students:</span> Use institute ID for signup — all events will be free!
                      </div>
                      </>
                    ) : (
                      <>
                      <div className="relative group">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                          style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
                        >
                          <User className="text-[#4bdcff]" size={40} />
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Username"
                          className="w-full pl-40 pr-3 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                          required
                        />
                      </div>

                      <div className="relative group">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                          style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
                        >
                          <Lock className="text-[#4bdcff]" size={40} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Password"
                          className="w-full pl-40 pr-24 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-[#07acca]/60 hover:text-[#4bdcff] transition-colors z-10"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={40} /> : <Eye size={40} />}
                        </button>
                      </div>

                      <div className="relative group">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                          style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
                        >
                          <Lock className="text-[#4bdcff]" size={40} />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          className="w-full pl-40 pr-24 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          className="absolute right-6 top-1/2 -translate-y-1/2 text-[#07acca]/60 hover:text-[#4bdcff] transition-colors z-10"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff size={40} /> : <Eye size={40} />}
                        </button>
                      </div>

                      <div className="relative group">
                        <div
                          className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                          style={{ clipPath: "polygon(0 0, 100% 0, 90% 100%, 0 100%)" }}
                        >
                          <Hash className="text-[#4bdcff]" size={40} />
                        </div>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="6-DIGIT OTP"
                          className="w-full pl-40 pr-3 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl tracking-[0.35em] text-center"
                          required
                          maxLength={6}
                        />
                      </div>
                      </>
                    )}

                  {currentStep === 2 ? (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormError("");
                          setFormSuccess("");
                          setCurrentStep(1);
                        }}
                        className="w-full bg-transparent border-2 border-[#07acca] hover:bg-[#07acca]/10 hover:border-[#4bdcff] text-[#bdf3ff] font-bold py-11 transition-all duration-200 uppercase tracking-widest text-3xl font-mono"
                        style={{ clipPath: "polygon(0 0, 100% 0, 95% 100%, 0 100%)" }}
                      >
                        BACK
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#07acca]/15 border-2 border-[#07acca] hover:bg-[#07acca]/25 hover:border-[#4bdcff] text-[#e6fbff] font-bold py-11 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-3xl font-mono relative overflow-hidden group"
                        style={{ clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%)" }}
                      >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <span className="relative z-10">{isSubmitting ? "LOADING..." : "REGISTER"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#07acca]/15 border-2 border-[#07acca] hover:bg-[#07acca]/25 hover:border-[#4bdcff] text-[#e6fbff] font-bold py-11 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-3xl font-mono relative overflow-hidden group"
                        style={{ clipPath: "polygon(5% 0, 100% 0, 100% 100%, 0 100%)" }}
                      >
                        <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                        <span className="relative z-10">{isSubmitting ? "LOADING..." : "SEND OTP"}</span>
                      </button>

                    </div>
                  )}
                      <div className="text-center pt-2">
                      <p className="text-[#07acca]/60 text-3xl font-mono">
                        ALREADY HAVE AN ACCOUNT?{' '}
                        <a
                          href="/login"
                          className="text-[#4bdcff] hover:text-[#bdf3ff] font-bold transition-colors"
                        >
                          LOGIN
                        </a>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}
