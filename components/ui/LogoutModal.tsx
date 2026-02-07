"use client";

import React from "react";
import SciFiConfirmModal from "./SciFiConfirmModal";

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
        <SciFiConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Terminate Session?"
            description="You are about to disconnect from the secure gateway. Unsaved local data may be lost."
            confirmText="Logout"
            cancelText="Cancel"
            variant="danger"
        />
    );
};

export default LogoutModal;
