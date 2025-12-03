"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";

interface SelfVerificationContextType {
    selfApp: SelfApp | null;
    isVerified: boolean;
    setIsVerified: (verified: boolean) => void;
}

const SelfVerificationContext = createContext<SelfVerificationContextType | undefined>(undefined);

export const SelfVerificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVerified, setIsVerified] = useState(false);

    const selfApp = useMemo(() => {
        // Initialize SelfApp
        // Note: In a real app, you might need to fetch config or use env vars
        return new SelfAppBuilder({
            appName: "SwipePad",
            scope: "read_user_info",
            endpointType: "celo",
            devMode: true,
            disclosures: {
                date_of_birth: true,
                nationality: true,
            },
        }).build();
    }, []);

    return (
        <SelfVerificationContext.Provider value={{ selfApp, isVerified, setIsVerified }}>
            {children}
        </SelfVerificationContext.Provider>
    );
};

export const useSelfVerification = () => {
    const context = useContext(SelfVerificationContext);
    if (!context) {
        throw new Error("useSelfVerification must be used within a SelfVerificationProvider");
    }
    return context;
};
