"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Hash, Lock, Mail, User } from "lucide-react";
import axios, { AxiosError } from "axios";
import api from "../../../lib/api";
import { showErrorToast, showSuccessToast, toastMessages } from "../../../utils/toast";
import AuthLayout from "../../../components/auth/AuthLayout";
import Link from "next/link";

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

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const nameTrimmed = username.trim();
  const nameAllowedChars = /^[A-Za-z\s\-']+$/;
  const isNameLenValid = nameTrimmed.length >= 2 && nameTrimmed.length <= 50;
  const isNameCharsValid = nameTrimmed.length > 0 && nameAllowedChars.test(nameTrimmed);

  const isPasswordLenValid = password.length >= 8 && password.length <= 128;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isPasswordComplexValid = hasUpper && hasLower && hasNumber && hasSpecial;

  const nameError = (() => {
    if (!nameTouched) return null;
    if (nameTrimmed.length === 0) return null;
    if (!isNameLenValid) return "Name must be between 2 and 50 characters";
    if (!isNameCharsValid) return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return null;
  })();

  const passwordError = (() => {
    if (!passwordTouched) return null;
    if (password.length === 0) return null;
    if (!isPasswordLenValid) return "Password must be between 8 and 128 characters";
    if (!isPasswordComplexValid) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }
    return null;
  })();

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
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

    setNameTouched(true);
    setPasswordTouched(true);

    if (!isNameLenValid) {
      const msg = "Name must be between 2 and 50 characters";
      setFormError(msg);
      showErrorToast(msg);
      return;
    }
    if (!isNameCharsValid) {
      const msg = "Name can only contain letters, spaces, hyphens, and apostrophes";
      setFormError(msg);
      showErrorToast(msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setFormError(msg);
      showErrorToast(msg);
      return;
    }
    if (!isPasswordLenValid) {
      const msg = "Password must be between 8 and 128 characters";
      setFormError(msg);
      showErrorToast(msg);
      return;
    }
    if (!isPasswordComplexValid) {
      const msg = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
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
      setFormSuccess("Registration successful! Redirecting to login...");
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

  const renderStep1 = () => (
    <>
      <div className="relative group mb-6">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
          <Mail size={20} />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
        />
      </div>

      <div className="p-4 bg-[#33ABB9]/5 border border-[#33ABB9]/20 text-gray-300 text-sm mb-4">
        <span className="text-[#33ABB9] font-bold">INFO:</span> We will send a 6-digit OTP to your email.
      </div>

      <div className="p-4 bg-[#33ABB9]/5 border border-[#33ABB9]/20 text-gray-300 text-sm mb-6">
        <span className="text-[#33ABB9] font-bold">SVNIT Students:</span> Use institute ID for signup — all events will be free!
      </div>

      {/* Success Message */}
      {formSuccess && currentStep === 1 && (
        <div className="p-4 bg-[#33ABB9]/10 border border-[#33ABB9]/30 text-[#33ABB9] text-sm animate-in fade-in slide-in-from-top duration-300">
          <span className="font-bold">SUCCESS:</span> {formSuccess}
        </div>
      )}

      {/* Error Message */}
      {formError && currentStep === 1 && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top duration-300">
          <span className="font-bold">ERROR:</span> {formError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#33ABB9]/10 border border-[#33ABB9]/30 hover:border-[#33ABB9] hover:bg-[#33ABB9]/20 text-white font-bold py-3.5 px-6 transition-all duration-300 uppercase tracking-widest text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#33ABB9]/20"
      >
        {isSubmitting ? "SENDING..." : "SEND OTP"}
      </button>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="space-y-4 mb-6">
        {/* Name */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
            <User size={20} />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => {
              if (!nameTouched) setNameTouched(true);
              setUsername(e.target.value);
            }}
            placeholder="Name"
            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
            required
          />
        </div>
        {nameError && (
          <div className="px-3 py-2 border bg-amber-500/10 border-amber-400/40 text-amber-200 text-xs">
            <span className="text-[#33ABB9] font-bold">NOTE:</span> {nameError}
          </div>
        )}

        {/* Password */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
            <Lock size={20} />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              if (!passwordTouched) setPasswordTouched(true);
              setPassword(e.target.value);
            }}
            placeholder="Password"
            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-12 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#33ABB9] transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {passwordError && (
          <div className="px-3 py-2 border bg-amber-500/10 border-amber-400/40 text-amber-200 text-xs">
            <span className="text-[#33ABB9] font-bold">NOTE:</span> {passwordError}
          </div>
        )}

        {/* Confirm Password */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
            <Lock size={20} />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-12 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#33ABB9] transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* OTP */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
            <Hash size={20} />
          </div>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-DIGIT OTP"
            className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 text-center tracking-[0.35em] text-lg outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
            required
            maxLength={6}
          />
        </div>
      </div>

      {/* Success Message */}
      {formSuccess && currentStep === 2 && (
        <div className="p-4 bg-[#33ABB9]/10 border border-[#33ABB9]/30 text-[#33ABB9] text-sm animate-in fade-in slide-in-from-top duration-300">
          <span className="font-bold">SUCCESS:</span> {formSuccess}
        </div>
      )}

      {/* Error Message */}
      {formError && currentStep === 2 && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top duration-300">
          <span className="font-bold">ERROR:</span> {formError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setFormError("");
            setFormSuccess("");
            setCurrentStep(1);
          }}
          className="w-full bg-transparent border border-white/10 hover:bg-white/5 hover:border-[#33ABB9]/30 text-gray-300 font-bold py-3.5 transition-all duration-300 uppercase tracking-widest text-sm"
        >
          BACK
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#33ABB9]/10 border border-[#33ABB9]/30 hover:border-[#33ABB9] hover:bg-[#33ABB9]/20 text-white font-bold py-3.5 transition-all duration-300 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#33ABB9]/20"
        >
          {isSubmitting ? "REGISTERING..." : "REGISTER"}
        </button>
      </div>
    </>
  );

  return (
    <AuthLayout title="REGISTER">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
        <p className="text-gray-400 text-sm">STEP {currentStep}/2</p>
        {currentStep === 2 && (
          <button
            type="button"
            onClick={() => {
              setFormError("");
              setFormSuccess("");
              setCurrentStep(1);
            }}
            className="text-[#33ABB9] hover:text-[#4DD4E5] transition-colors text-xs cursor-pointer uppercase tracking-wider"
          >
            CHANGE EMAIL
          </button>
        )}
      </div>

      <form
        onSubmit={currentStep === 1 ? handleSendOTP : handleVerifyAndRegister}
        className="w-full"
      >
        {currentStep === 1 ? renderStep1() : renderStep2()}
      </form>

      <div className="text-center pt-6 border-t border-white/10 mt-6">
        <p className="text-gray-400 text-sm uppercase">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#33ABB9] hover:text-[#4DD4E5] font-bold transition-colors ml-1"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
