'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { workshopsRegistrationApi } from '@/lib/workshopsApi';
import { showSuccessToast, showErrorToast, toastMessages } from '@/utils/toast';
import useAuth from '@/hooks/useAuth';
import PaymentUploadModal from './PaymentUploadModal';
import SciFiConfirmModal from '@/components/ui/SciFiConfirmModal';

interface WorkshopRegistrationCTAProps {
  workshopSlug: string;
  workshopName: string;
  registeredCount: number;
  maxParticipants: number;
  isRegistrationOpen: boolean;
  stopRegistration: boolean;
  registrationDeadline?: string;
  isSvnitian?: boolean;
  entryFee: number;
  isFree: boolean;
  formatDate: (date: string) => string;
}

const WorkshopRegistrationCTA: React.FC<WorkshopRegistrationCTAProps> = ({
  workshopSlug,
  workshopName,
  registeredCount,
  maxParticipants,
  isRegistrationOpen,
  stopRegistration,
  registrationDeadline,
  isSvnitian,
  entryFee,
  isFree,
  formatDate
}) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [unregLoading, setUnregLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<"register" | "unregister" | null>(null);

  // Check if user is already registered
  const checkRegistrationStatus = async () => {
    try {
      const response = await workshopsRegistrationApi.checkWorkshopRegistration(workshopSlug);
      const registered = response.data?.data?.isRegistered || false;
      setIsRegistered(registered);
      
      // If registered, check payment status
      if (registered) {
        try {
          const paymentResponse = await workshopsRegistrationApi.getPaymentStatus(workshopSlug);
          setPaymentStatus(paymentResponse.data?.data?.paymentStatus || null);
        } catch (error) {
          console.error('Error fetching payment status:', error);
        }
      }
    } catch (error) {
      console.error('Error checking registration status:', error);
    }
  };

  // Call this when component mounts
  React.useEffect(() => {
    checkRegistrationStatus();
  }, [workshopSlug]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      showErrorToast('Please login to register for the event');
      router.push('/login');
      return;
    }

    // Check if payment is required (non-SVNIT user on paid workshop)
    const requiresPayment = !isFree && entryFee > 0 && !isSvnitian;
    
    // If payment required, show modal FIRST without registering
    if (requiresPayment) {
      setShowPaymentModal(true);
      return;
    }

    // For free workshops or SVNIT students, register immediately
    setRegLoading(true);
    setRegError(null);
    try {
      await workshopsRegistrationApi.registerForWorkshop(workshopSlug);
      setRegSuccess(true);
      setIsRegistered(true);
      showSuccessToast(toastMessages.registration.success(workshopName));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Registration failed.';
      setRegError(errorMessage);
      showErrorToast(toastMessages.registration.error(errorMessage));
    } finally {
      setRegLoading(false);
    }
  };

  const handlePaymentUpload = async (screenshotUrl: string, transactionId: string) => {
    setRegLoading(true);
    try {
      // First register for the workshop
      await workshopsRegistrationApi.registerForWorkshop(workshopSlug);
      
      // Then upload payment proof
      await workshopsRegistrationApi.uploadPaymentProof(workshopSlug, screenshotUrl, transactionId);
      
      setPaymentStatus('approved');
      setIsRegistered(true);
      setRegSuccess(true);
      showSuccessToast('Payment proof uploaded successfully! You are now registered.');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to complete registration';
      showErrorToast(errorMessage);
      throw err;
    } finally {
      setRegLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!isAuthenticated) {
      showErrorToast('Please login to access registration features');
      router.push('/login');
      return;
    }
    setUnregLoading(true);
    setRegError(null);
    try {
      await workshopsRegistrationApi.unregisterFromWorkshop(workshopSlug);
      setIsRegistered(false);
      setRegSuccess(false);
      showSuccessToast(toastMessages.unregistration.success(workshopName));
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err.message || 'Unregistration failed.';
      setRegError(errorMessage);
      showErrorToast(toastMessages.unregistration.error(errorMessage));
    } finally {
      setUnregLoading(false);
    }
  };

  const requestRegister = () => {
    setConfirmAction("register");
  };

  const requestUnregister = () => {
    setConfirmAction("unregister");
  };

  const handleConfirmAction = async () => {
    if (confirmAction === "register") {
      await handleRegister();
    } else if (confirmAction === "unregister") {
      await handleUnregister();
    }
    setConfirmAction(null);
  };

  const isRegOpen = !stopRegistration;

  // Helper to render payment status
  const renderPaymentStatus = () => {
    if (!paymentStatus || paymentStatus === 'not_required') return null;

    if (paymentStatus === 'approved') {
      return (
        <div className="mt-4 px-6 py-2 bg-green-600/20 border border-green-500/40 text-green-400 font-orbitron text-sm tracking-wider rounded">
          PAYMENT: VERIFIED ✓
        </div>
      );
    }

    return null;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-y border-white/10 bg-white/5 p-12 md:p-16 text-center relative overflow-hidden group"
      >
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

        {/* Background pulse */}
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#33ABB9]/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

        <h3 className="text-4xl md:text-6xl font-black uppercase mb-12 font-orbitron tracking-tighter">
          Ready to <span className="text-[#33ABB9] inline-block transform hover:skew-x-12 transition-transform">Learn?</span>
        </h3>

        {isRegOpen ? (
          <div className="space-y-8 relative z-10">
            <div className="flex flex-wrap items-center justify-center gap-6">
              {/* Check authentication first */}
              {!isAuthenticated ? (
                <>
                  {/* Login prompt button for unauthenticated users */}
                  <button
                    onClick={() => {
                      showErrorToast('Please login to register for the event');
                      router.push('/login');
                    }}
                    className="group/register relative px-8 py-4 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                    <span className="relative z-10 flex items-center gap-2">
                      LOGIN_TO_REGISTER
                    </span>
                  </button>
                </>
              ) : (isFree || entryFee === 0) ? (
                <>
                  {/* FREE WORKSHOP - Everyone can register */}
                  {!isRegistered && registeredCount < maxParticipants && (
                    <button
                      onClick={requestRegister}
                      disabled={regLoading}
                      className="group/register relative px-8 py-4 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                      <span className="relative z-10 flex items-center gap-2">
                        {regLoading ? 'REGISTERING...' : 'REGISTER_FREE'}
                      </span>
                    </button>
                  )}

                  {isRegistered && (
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative px-10 py-4 bg-linear-to-r from-[#33ABB9]/10 to-[#33ABB9]/5 backdrop-blur-xl border border-[#33ABB9]/40 text-[#33ABB9] font-bold font-orbitron tracking-wider text-lg overflow-hidden">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]" />
                        
                        {/* Glowing background effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#33ABB9]/20 to-transparent transform -translate-x-full animate-pulse" />
                        
                        <span className="relative z-10">YOU ARE REGISTERED</span>
                      </div>
                      {renderPaymentStatus()}
                      <button
                        onClick={requestUnregister}
                        disabled={unregLoading}
                        className="group/unregister relative px-8 py-3 bg-linear-to-r from-red-600/20 to-red-500/10 border border-red-500/40 text-red-400 font-bold font-orbitron tracking-wider text-sm hover:from-red-600/30 hover:to-red-500/20 hover:border-red-400/60 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                      >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-400/60" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-400/60" />
                        
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-red-400/10 to-transparent transform -translate-x-full group-hover/unregister:translate-x-full transition-transform duration-500" />
                        
                        <span className="relative z-10">
                          {unregLoading ? 'UNREGISTERING...' : 'UNREGISTER'}
                        </span>
                      </button>
                    </div>
                  )}

                  {registeredCount >= maxParticipants && !isRegistered && (
                    <div className="px-8 py-4 bg-yellow-600/20 border-2 border-yellow-500/50 text-yellow-400 font-bold font-orbitron tracking-wider text-lg rounded-lg">
                      WORKSHOP FULL
                    </div>
                  )}
                </>
              ) : isSvnitian ? (
                <>
                  {/* PAID WORKSHOP - SVNIT students get it free */}
                  {!isRegistered && registeredCount < maxParticipants && (
                    <button
                      onClick={requestRegister}
                      disabled={regLoading}
                      className="group/register relative px-8 py-4 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-30" />
                      <span className="relative z-10 flex items-center gap-2">
                        {regLoading ? 'REGISTERING...' : 'REGISTER_FREE (SVNIT)'}
                      </span>
                    </button>
                  )}

                  {isRegistered && (
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative px-10 py-4 bg-linear-to-r from-[#33ABB9]/10 to-[#33ABB9]/5 backdrop-blur-xl border border-[#33ABB9]/40 text-[#33ABB9] font-bold font-orbitron tracking-wider text-lg overflow-hidden">
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]" />
                        
                        {/* Glowing background effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#33ABB9]/20 to-transparent transform -translate-x-full animate-pulse" />
                        
                        <span className="relative z-10">YOU ARE REGISTERED</span>
                      </div>
                      {renderPaymentStatus()}
                      <button
                        onClick={requestUnregister}
                        disabled={unregLoading}
                        className="group/unregister relative px-8 py-3 bg-linear-to-r from-red-600/20 to-red-500/10 border border-red-500/40 text-red-400 font-bold font-orbitron tracking-wider text-sm hover:from-red-600/30 hover:to-red-500/20 hover:border-red-400/60 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                      >
                        {/* Corner accents */}
                        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-400/60" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-400/60" />
                        
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-red-400/10 to-transparent transform -translate-x-full group-hover/unregister:translate-x-full transition-transform duration-500" />
                        
                        <span className="relative z-10">
                          {unregLoading ? 'UNREGISTERING...' : 'UNREGISTER'}
                        </span>
                      </button>
                    </div>
                  )}

                  {registeredCount >= maxParticipants && !isRegistered && (
                    <div className="px-8 py-4 bg-yellow-600/20 border-2 border-yellow-500/50 text-yellow-400 font-bold font-orbitron tracking-wider text-lg rounded-lg">
                      WORKSHOP FULL
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* PAID WORKSHOP - Non-SVNIT students must pay */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="px-8 py-4 bg-[#33ABB9]/20 border-2 border-[#33ABB9]/50 text-[#33ABB9] font-bold font-orbitron tracking-wider text-lg rounded-lg mx-auto max-w-xl text-center">
                      <div className="mb-2">PAID WORKSHOP - ₹{entryFee}</div>
                      <div className="text-sm font-normal text-cyan-300">Upload payment proof to complete registration</div>
                    </div>
                    {!isRegistered && registeredCount < maxParticipants && (
                      <button
                        onClick={requestRegister}
                        disabled={regLoading}
                        className="group/register relative px-8 py-4 bg-[#33ABB9] text-black font-bold font-orbitron tracking-wider text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#2a9aa5] transition-colors"
                      >
                        <div className="absolute inset-0 bg-white transform -translate-x-full skew-x-12 group-hover/register:translate-x-0 transition-transform duration-300 opacity-20" />
                        <span className="relative z-10 flex items-center gap-2">
                          {regLoading ? 'PROCESSING...' : `UPLOAD PAYMENT - ₹${entryFee}`}
                        </span>
                      </button>
                    )}
                    {isRegistered && (
                      <div className="flex flex-col items-center gap-6">
                        <div className="relative px-10 py-4 bg-linear-to-r from-[#33ABB9]/10 to-[#33ABB9]/5 backdrop-blur-xl border border-[#33ABB9]/40 text-[#33ABB9] font-bold font-orbitron tracking-wider text-lg overflow-hidden">
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#33ABB9]" />
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#33ABB9]" />
                          
                          {/* Glowing background effect */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#33ABB9]/20 to-transparent transform -translate-x-full animate-pulse" />
                          
                          <span className="relative z-10">YOU ARE REGISTERED</span>
                        </div>
                        {renderPaymentStatus()}
                        <button
                          onClick={requestUnregister}
                          disabled={unregLoading}
                          className="group/unregister relative px-8 py-3 bg-linear-to-r from-red-600/20 to-red-500/10 border border-red-500/40 text-red-400 font-bold font-orbitron tracking-wider text-sm hover:from-red-600/30 hover:to-red-500/20 hover:border-red-400/60 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden"
                        >
                          {/* Corner accents */}
                          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-400/60" />
                          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-400/60" />
                          
                          {/* Hover effect */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-red-400/10 to-transparent transform -translate-x-full group-hover/unregister:translate-x-full transition-transform duration-500" />
                          
                          <span className="relative z-10">
                            {unregLoading ? 'UNREGISTERING...' : 'UNREGISTER'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {registrationDeadline && (
              <div className="text-center">
                <p className="text-gray-400 font-rajdhani text-lg">
                  Registration Deadline: <span className="text-[#33ABB9] font-bold">{formatDate(registrationDeadline)}</span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-red-500 text-2xl font-bold font-orbitron tracking-widest border border-red-500/50 inline-block px-6 py-2 bg-red-500/10">
              REGISTRATION_CLOSED
            </p>
            <p className="text-gray-500 font-share-tech-mono">
              Access denied. Max capacity reached or deadline exceeded.
            </p>
          </div>
        )}
      </motion.div>

      {/* Payment Upload Modal */}
      <PaymentUploadModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onUpload={handlePaymentUpload}
        workshopName={workshopName}
        entryFee={entryFee}
      />

      <SciFiConfirmModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmAction === "unregister" ? "Unregister?" : "Confirm Registration?"}
        description={
          confirmAction === "unregister"
            ? `Are you sure you want to unregister from ${workshopName}?`
            : `Proceed with registration for ${workshopName}?`
        }
        confirmText={confirmAction === "unregister" ? "Unregister" : "Proceed"}
        variant={confirmAction === "unregister" ? "danger" : "info"}
      />
    </section>
  );
};

export default WorkshopRegistrationCTA;