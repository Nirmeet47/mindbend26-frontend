'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import api from '../../../lib/api';
import { showErrorToast, showSuccessToast, toastMessages } from '../../../utils/toast';
import AuthLayout from '../../../components/auth/AuthLayout';
import Link from 'next/link';

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

export default function LoginPage() {
  const router = useRouter();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isForgotPasswordLoading, setIsForgotPasswordLoading] = useState(false);
  const [, setForgotPasswordSuccess] = useState('');
  const [, setForgotPasswordError] = useState('');

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [isResetPasswordVisible, setIsResetPasswordVisible] = useState(false);
  const [isResetConfirmVisible, setIsResetConfirmVisible] = useState(false);

  const [otpSecondsLeft, setOtpSecondsLeft] = useState(120);
  const [otpExpired, setOtpExpired] = useState(false);
  const [isResendLoading, setIsResendLoading] = useState(false);
  const [, setResendError] = useState('');
  const [, setResendSuccess] = useState('');
  const otpTimerRef = useRef<number | null>(null);

  const formatOtpTime = (s: number) => {
    const mm = String(Math.floor(s / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  const startOtpTimer = () => {
    if (otpTimerRef.current) window.clearInterval(otpTimerRef.current);
    setOtpSecondsLeft(120);
    setOtpExpired(false);
    otpTimerRef.current = window.setInterval(() => {
      setOtpSecondsLeft((prev) => {
        if (prev <= 1) {
          if (otpTimerRef.current) window.clearInterval(otpTimerRef.current);
          otpTimerRef.current = null;
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (isResetPasswordOpen) startOtpTimer();
    return () => {
      if (otpTimerRef.current) window.clearInterval(otpTimerRef.current);
      otpTimerRef.current = null;
    };
  }, [isResetPasswordOpen]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setIsLoginLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email: loginForm.email,
        password: loginForm.password,
      });

      if (response?.data?.token) {
        localStorage.setItem('token', response.data.token);
        if (loginForm.rememberMe) localStorage.setItem('rememberMe', 'true');
      }
      setFormSuccess('Login successful! Redirecting to dashboard...');
      showSuccessToast(toastMessages.auth.loginSuccess);
      setTimeout(() => router.push('/user/dashboard'), 800);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Login failed. Please try again.');
      setFormError(msg);
      showErrorToast(toastMessages.auth.loginError(msg));
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordSuccess('');
    setIsForgotPasswordLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotPasswordEmail });
      setForgotPasswordSuccess('OTP has been sent to your email.');
      showSuccessToast('OTP sent to your email.');
      setIsResetPasswordOpen(true);
      setIsForgotPasswordOpen(false);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to send reset OTP.');
      setForgotPasswordError(msg);
      showErrorToast(msg);
    } finally {
      setIsForgotPasswordLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendError('');
    setResendSuccess('');
    setResetError('');
    setResetSuccess('');
    if (!forgotPasswordEmail) {
      const msg = 'Missing email. Please go back and enter your email again.';
      setResendError(msg);
      showErrorToast(msg);
      return;
    }
    setIsResendLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: forgotPasswordEmail });
      setResendSuccess('A new OTP has been sent to your email.');
      showSuccessToast('OTP resent successfully.');
      setResetOtp('');
      startOtpTimer();
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to resend OTP.');
      setResendError(msg);
      showErrorToast(msg);
    } finally {
      setIsResendLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess('');
    setResendError('');
    setResendSuccess('');

    if (otpExpired) {
      const msg = 'OTP expired. Please resend OTP to continue.';
      setResetError(msg);
      showErrorToast(msg);
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      const msg = 'Passwords do not match';
      setResetError(msg);
      showErrorToast(msg);
      return;
    }
    if (resetNewPassword.length < 6) {
      const msg = 'Password must be at least 6 characters long';
      setResetError(msg);
      showErrorToast(msg);
      return;
    }

    setIsResetLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email: forgotPasswordEmail,
        otp: resetOtp,
        newPassword: resetNewPassword,
      });
      setResetSuccess('Password reset successfully! You can login now.');
      showSuccessToast('Password reset successfully.');
      setTimeout(() => {
        setIsResetPasswordOpen(false);
        setIsForgotPasswordOpen(false);
        setResetOtp('');
        setResetNewPassword('');
        setResetConfirmPassword('');
        setForgotPasswordEmail('');
        setResetError('');
        setResetSuccess('');
        setOtpExpired(false);
        setOtpSecondsLeft(120);
      }, 1200);
    } catch (err: unknown) {
      const msg = getApiErrorMessage(err, 'Failed to reset password.');
      setResetError(msg);
      showErrorToast(msg);
    } finally {
      setIsResetLoading(false);
    }
  };

  // 1. LOGIN FORM
  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
          <Mail size={20} />
        </div>
        <input
          type="email"
          value={loginForm.email}
          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
          placeholder="Email Address"
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
        />
      </div>

      {/* Password Input */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
          <Lock size={20} />
        </div>
        <input
          type={isPasswordVisible ? 'text' : 'password'}
          value={loginForm.password}
          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          placeholder="Password"
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-12 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#33ABB9] transition-colors"
          aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
        >
          {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="flex items-center justify-end text-sm">
        <button
          type="button"
          onClick={() => {
            setForgotPasswordEmail(loginForm.email || forgotPasswordEmail);
            setForgotPasswordError('');
            setForgotPasswordSuccess('');
            setIsForgotPasswordOpen(true);
          }}
          className="text-[#33ABB9] hover:text-[#4DD4E5] transition-colors uppercase tracking-wider text-xs"
        >
          Forgot Password?
        </button>
      </div>

      {/* Success Message */}
      {formSuccess && (
        <div className="p-4 bg-[#33ABB9]/10 border border-[#33ABB9]/30 text-[#33ABB9] text-sm animate-in fade-in slide-in-from-top duration-300">
          <span className="font-bold">SUCCESS:</span> {formSuccess}
        </div>
      )}

      {/* Error Message */}
      {formError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm animate-in fade-in slide-in-from-top duration-300">
          <span className="font-bold">ERROR:</span> {formError}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoginLoading}
        className="w-full bg-[#33ABB9]/10 border border-[#33ABB9]/30 hover:border-[#33ABB9] hover:bg-[#33ABB9]/20 text-white font-bold py-3.5 px-6 transition-all duration-300 uppercase tracking-widest text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoginLoading ? 'LOGGING IN...' : 'LOGIN'}
      </button>

      <div className="text-center pt-4 border-t border-white/10">
        <p className="text-gray-400 text-sm uppercase">
          New User?{' '}
          <Link
            href="/register"
            className="text-[#33ABB9] hover:text-[#4DD4E5] font-bold transition-colors ml-1"
          >
            Register
          </Link>
        </p>
      </div>
    </form>
  );

  // 2. FORGOT PASSWORD FORM
  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#33ABB9]">
          <Mail size={20} />
        </div>
        <input
          type="email"
          value={forgotPasswordEmail}
          onChange={(e) => setForgotPasswordEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isForgotPasswordLoading}
        className="w-full bg-[#33ABB9]/10 border border-[#33ABB9]/30 hover:border-[#33ABB9] hover:bg-[#33ABB9]/20 text-white font-bold py-3.5 px-6 transition-all duration-300 uppercase tracking-widest text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#33ABB9]/20"
      >
        {isForgotPasswordLoading ? 'SENDING...' : 'SEND OTP'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsForgotPasswordOpen(false);
          setForgotPasswordError('');
          setForgotPasswordSuccess('');
        }}
        className="w-full text-gray-400 hover:text-[#33ABB9] transition-colors text-sm uppercase tracking-wider mt-2"
      >
        BACK TO LOGIN
      </button>
    </form>
  );

  // 3. RESET PASSWORD FORM
  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="relative group">
        <input
          type="text"
          value={resetOtp}
          onChange={(e) => setResetOtp(e.target.value)}
          placeholder="6-DIGIT OTP"
          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-center tracking-[0.5em] text-xl outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
          disabled={otpExpired}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        {!otpExpired ? (
          <p className="text-gray-400">
            EXPIRES IN <span className="text-white tabular-nums">{formatOtpTime(otpSecondsLeft)}</span>
          </p>
        ) : (
          <p className="text-amber-500">EXPIRED</p>
        )}

        {otpExpired && (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResendLoading}
            className="text-[#33ABB9] hover:text-[#4DD4E5] transition-colors disabled:opacity-50"
          >
            {isResendLoading ? 'WAIT...' : 'RESEND OTP'}
          </button>
        )}
      </div>

      <div className="relative group">
        <input
          type={isResetPasswordVisible ? 'text' : 'password'}
          value={resetNewPassword}
          onChange={(e) => setResetNewPassword(e.target.value)}
          placeholder="NEW PASSWORD"
          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
        />
        <button
          type="button"
          onClick={() => setIsResetPasswordVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#33ABB9] transition-colors"
        >
          {isResetPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="relative group">
        <input
          type={isResetConfirmVisible ? 'text' : 'password'}
          value={resetConfirmPassword}
          onChange={(e) => setResetConfirmPassword(e.target.value)}
          placeholder="CONFIRM PASSWORD"
          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 outline-none hover:border-[#33ABB9]/30 focus:border-[#33ABB9] focus:bg-white/10 transition-all placeholder-gray-500"
          required
        />
        <button
          type="button"
          onClick={() => setIsResetConfirmVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#33ABB9] transition-colors"
        >
          {isResetConfirmVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <button
        type="submit"
        disabled={isResetLoading || !!resetSuccess || otpExpired}
        className="w-full bg-[#33ABB9]/10 border border-[#33ABB9]/30 hover:border-[#33ABB9] hover:bg-[#33ABB9]/20 text-white font-bold py-3.5 px-6 transition-all duration-300 uppercase tracking-widest text-base disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#33ABB9]/20"
      >
        {isResetLoading ? 'RESETTING...' : resetSuccess ? 'SUCCESS' : 'RESET PASSWORD'}
      </button>

      <button
        type="button"
        onClick={() => {
          setIsResetPasswordOpen(false);
          setIsForgotPasswordOpen(false);
          setResetError('');
          setResetSuccess('');
          setResendError('');
          setResendSuccess('');
          setOtpExpired(false);
          setOtpSecondsLeft(120);
          if (otpTimerRef.current) window.clearInterval(otpTimerRef.current);
          otpTimerRef.current = null;
        }}
        className="w-full text-gray-400 hover:text-[#33ABB9] transition-colors text-sm uppercase tracking-wider mt-2"
      >
        BACK TO LOGIN
      </button>
    </form>
  );

  let title = 'LOGIN';
  let content = renderLoginForm();

  if (isForgotPasswordOpen && !isResetPasswordOpen) {
    title = 'FORGOT PASSWORD';
    content = renderForgotPasswordForm();
  } else if (isResetPasswordOpen) {
    title = 'RESET PASSWORD';
    content = renderResetPasswordForm();
  }

  return (
    <AuthLayout title={title}>
      {content}
    </AuthLayout>
  );
}
