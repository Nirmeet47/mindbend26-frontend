"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, X } from "lucide-react";

interface LogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-black border border-[#33ABB9]/30 shadow-[0_0_30px_rgba(51,171,185,0.15)] overflow-hidden"
                    >
                        {/* Decorative Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#33ABB9]" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#33ABB9]" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#33ABB9]" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#33ABB9]" />

                        {/* Header Line */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#33ABB9]/50 to-transparent" />

                        <div className="p-8 relative z-10">
                            {/* Icon & Title */}
                            <div className="flex flex-col items-center text-center space-y-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#33ABB9]/10 border border-[#33ABB9]/30 flex items-center justify-center relative">
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#33ABB9]" />
                                    <LogOut className="text-[#33ABB9]" size={32} />
                                </div>

                                <div>
                                    <h2
                                        className="text-2xl font-black text-white uppercase tracking-wider mb-2"
                                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                                    >
                                        Terminate Session?
                                    </h2>
                                    <p className="text-gray-400 text-sm font-mono leading-relaxed">
                                        You are about to disconnect from the secure gateway. Unsaved local data may be lost.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 border border-white/10 hover:bg-white/5 text-gray-300 font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 group"
                                >
                                    <X size={16} className="group-hover:text-red-400 transition-colors" />
                                    <span>Cancel</span>
                                </button>

                                <button
                                    onClick={onConfirm}
                                    className="flex-1 relative py-3 px-4 bg-[#33ABB9] hover:bg-[#288a96] text-black font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-12 group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>

                        {/* Scanline Overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;
