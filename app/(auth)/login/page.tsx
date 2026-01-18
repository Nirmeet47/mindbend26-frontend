'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import api from '../../../lib/api';
import { showErrorToast, showSuccessToast, toastMessages } from '../../../utils/toast';

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
  const [, setFormError] = useState('');
  const [, setFormSuccess] = useState('');
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
      setFormSuccess('Login successful! Redirecting...');
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

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-0 sm:px-2 md:px-4 py-20">
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

      <div className="relative z-10 w-full max-w-xl">
        <svg
          version="1.2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1500 1000"
          className="w-full h-auto"
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
                id="LOGIN"
                style={{
                  transform: 'matrix(3.277,0,0,4.653,747.575,109.925)',
                  fontSize: '12px',
                  fill: '#ffffff',
                  fontWeight: 900,
                  fontFamily: 'Poppins-Black, Poppins',
                  letterSpacing: '0.06em',
                }}
                textAnchor="middle"
              >
                LOGIN
              </text>
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

          {/* Form Content inside SVG using foreignObject */}
          <foreignObject x="300" y="35" width="950" height="1060">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-full px-2">
                {/* VIEW 1: LOGIN */}
                {!isForgotPasswordOpen && !isResetPasswordOpen && (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="relative group">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
                      >
                        <Mail className="text-[#4bdcff]" size={40} />
                      </div>
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="Email Address"
                        className="w-full pl-40 pr-3 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="relative group">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
                      >
                        <Lock className="text-[#4bdcff]" size={40} />
                      </div>
                      <input
                        type={isPasswordVisible ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="Password"
                        className="w-full pl-40 pr-24 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible((v) => !v)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#07acca]/60 hover:text-[#4bdcff] transition-colors z-10"
                        aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {isPasswordVisible ? <EyeOff size={40} /> : <Eye size={40} />}
                      </button>
                    </div>

                    <div className="flex items-center justify-end text-sm pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotPasswordEmail(loginForm.email || forgotPasswordEmail);
                          setForgotPasswordError('');
                          setForgotPasswordSuccess('');
                          setIsForgotPasswordOpen(true);
                        }}
                        className="text-[#4bdcff] hover:text-[#bdf3ff] transition-colors font-mono text-2xl cursor-pointer"
                      >
                        FORGOT PASSWORD?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoginLoading}
                      className="w-full bg-[#07acca]/15 border-2 border-[#07acca] hover:bg-[#07acca]/25 hover:border-[#4bdcff] text-[#e6fbff] font-bold py-11 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-3xl font-mono relative overflow-hidden group"
                      style={{ clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)' }}
                    >
                      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <span className="relative z-10">{isLoginLoading ? 'SIGNING IN...' : 'SIGN IN'}</span>
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-[#07acca]/60 text-3xl font-mono">
                        DON&apos;T HAVE AN ACCOUNT?{' '}
                        <a
                          href="/register"
                          className="text-[#4bdcff] hover:text-[#bdf3ff] font-bold transition-colors"
                        >
                          SIGN UP
                        </a>
                      </p>
                    </div>
                  </form>
                )}

                {/* VIEW 2: FORGOT PASSWORD */}
                {isForgotPasswordOpen && !isResetPasswordOpen && (
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                    <div className="relative group">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-32 bg-[#07acca]/10 border border-[#07acca]/40 flex items-center justify-center z-10"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
                      >
                        <Mail className="text-[#4bdcff]" size={42} />
                      </div>
                      <input
                        type="email"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-40 pr-3 py-11 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isForgotPasswordLoading}
                      className="w-full bg-[#07acca]/15 border-2 border-[#07acca] hover:bg-[#07acca]/25 hover:border-[#4bdcff] text-[#e6fbff] font-bold py-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-3xl font-mono relative overflow-hidden group"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                    >
                      <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                      <span className="relative z-10">{isForgotPasswordLoading ? 'SENDING OTP...' : 'SEND OTP'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordOpen(false);
                        setForgotPasswordError('');
                        setForgotPasswordSuccess('');
                      }}
                      className="w-full text-[#07acca]/70 hover:text-[#bdf3ff] transition-colors font-mono text-2xl mt-1.5 cursor-pointer"
                    >
                      <p className="text-[#07acca]/60 text-3xl font-mono">
                        BACK TO {' '}
                        <span
                          className="text-[#4bdcff] font-bold transition-colors"
                        >
                          LOGIN
                        </span>
                      </p>
                    </button>
                  </form>
                )}

                {/* VIEW 3: RESET PASSWORD */}
                {isResetPasswordOpen && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="relative group">
                      <input
                        type="text"
                        value={resetOtp}
                        onChange={(e) => setResetOtp(e.target.value)}
                        placeholder="6-DIGIT OTP"
                        className="w-full px-6 py-10 bg-[#0a0e1a]/50 border-2 border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl text-center tracking-[0.4em]"
                        required
                        disabled={otpExpired}
                      />
                    </div>

                    <div className="flex items-center justify-between font-mono text-xl">
                      {!otpExpired ? (
                        <p className="text-[#07acca]/70">
                          OTP EXPIRES IN <span className="text-[#bdf3ff] tabular-nums">{formatOtpTime(otpSecondsLeft)}</span>
                        </p>
                      ) : (
                        <p className="text-amber-300">OTP EXPIRED.</p>
                      )}

                      {otpExpired && (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResendLoading}
                          className="text-[#4bdcff] hover:text-[#bdf3ff] transition-colors disabled:opacity-60"
                        >
                          {isResendLoading ? 'RESENDING...' : 'RESEND OTP'}
                        </button>
                      )}
                    </div>

                    <div className="relative group">
                      <input
                        type={isResetPasswordVisible ? 'text' : 'password'}
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        placeholder="NEW PASSWORD"
                        className="w-full px-6 py-10 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsResetPasswordVisible((v) => !v)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#07acca]/60 hover:text-[#4bdcff] transition-colors"
                        aria-label={isResetPasswordVisible ? 'Hide password' : 'Show password'}
                      >
                        {isResetPasswordVisible ? <EyeOff size={40} /> : <Eye size={40} />}
                      </button>
                    </div>

                    <div className="relative group">
                      <input
                        type={isResetConfirmVisible ? 'text' : 'password'}
                        value={resetConfirmPassword}
                        onChange={(e) => setResetConfirmPassword(e.target.value)}
                        placeholder="CONFIRM PASSWORD"
                        className="w-full px-6 py-10 bg-[#0a0e1a]/50 border border-[#07acca]/40 text-[#e6fbff] placeholder-[#07acca]/40 outline-none focus:border-[#4bdcff] focus:bg-[#0a0e1a]/80 transition-all font-mono text-3xl"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsResetConfirmVisible((v) => !v)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-[#07acca]/60 hover:text-[#4bdcff] transition-colors"
                        aria-label={isResetConfirmVisible ? 'Hide password' : 'Show password'}
                      >
                        {isResetConfirmVisible ? <EyeOff size={40} /> : <Eye size={40} />}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={isResetLoading || !!resetSuccess || otpExpired}
                      className="w-full bg-[#07acca]/15 border-2 border-[#07acca] hover:bg-[#07acca]/25 hover:border-[#4bdcff] text-[#e6fbff] font-bold py-10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-3xl font-mono"
                      style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))' }}
                    >
                      {isResetLoading ? 'RESETTING...' : resetSuccess ? 'DONE' : 'RESET PASSWORD'}
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
                      className="w-full text-[#07acca]/70 hover:text-[#bdf3ff] transition-colors font-mono text-2xl"
                    >
                      BACK TO LOGIN
                    </button>
                  </form>
                )}
              </div>
            </div>
          </foreignObject>
        </svg>
      </div>
    </div>
  );
}
