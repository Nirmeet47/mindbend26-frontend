"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, LogOut, X, Check, Trash2, UserMinus } from "lucide-react";

interface SciFiConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "success" | "info" | "warning";
}

const SciFiConfirmModal: React.FC<SciFiConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
}) => {
    // Determine colors and icon based on variant
    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return {
                    primary: "#33ABB9", // Using the cyan/teal from logout for consistency
                    color: "#33ABB9",
                    icon: AlertTriangle,
                };
            case "success":
                return {
                    primary: "#4ADE80", // Green
                    color: "#4ADE80",
                    icon: Check,
                };
            case "warning":
                return {
                    primary: "#FACC15", // Yellow
                    color: "#FACC15",
                    icon: AlertTriangle,
                };
            case "info":
            default:
                return {
                    primary: "#33ABB9",
                    color: "#33ABB9",
                    icon: AlertTriangle,
                };
        }
    };

    const styles = getVariantStyles();
    // Default to the requested look (Cyan) unless specifically overridden for special cases like success
    // The user explicitly wanted "Same as Logout", so we prioritize the Logout Aesthetic (Cyan)
    const primaryColor = styles.primary;

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
                        className="relative w-full max-w-md bg-black border shadow-[0_0_30px_rgba(51,171,185,0.15)] overflow-hidden"
                        style={{ borderColor: `${primaryColor}4D`, boxShadow: `0 0 30px ${primaryColor}26` }}
                    >
                        {/* Decorative Corner Accents */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: primaryColor }} />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: primaryColor }} />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: primaryColor }} />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: primaryColor }} />

                        {/* Header Line */}
                        <div className="h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-50" style={{ color: primaryColor }} />

                        <div className="p-8 relative z-10">
                            {/* Icon & Title */}
                            <div className="flex flex-col items-center text-center space-y-4 mb-6">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center relative bg-opacity-10" style={{ backgroundColor: `${primaryColor}1A`, borderColor: `${primaryColor}4D` }}>
                                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: primaryColor }} />
                                    <styles.icon size={32} style={{ color: primaryColor }} />
                                </div>

                                <div>
                                    <h2
                                        className="text-2xl font-black text-white uppercase tracking-wider mb-2"
                                        style={{ fontFamily: "'Orbitron', sans-serif" }}
                                    >
                                        {title}
                                    </h2>
                                    <p className="text-gray-400 text-sm font-mono leading-relaxed">
                                        {description}
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
                                    <span>{cancelText}</span>
                                </button>

                                <button
                                    onClick={onConfirm}
                                    className="flex-1 relative py-3 px-4 text-black font-bold uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 overflow-hidden group"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] skew-x-12 group-hover:translate-x-[100%] transition-transform duration-700" />
                                    {/* Try to use a relevant icon for the action if possible, else generic */}
                                    <Check size={16} />
                                    <span>{confirmText}</span>
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

export default SciFiConfirmModal;
