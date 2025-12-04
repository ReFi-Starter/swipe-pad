"use client"

import { SelfAppBuilder } from "@selfxyz/qrcode";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";

// Helper to generate Universal Link (https://self.xyz/r/...)
// We implement this manually to ensure it's always correct and doesn't rely on potentially missing exports.
const generateUniversalLink = (app: any) => {
    if (!app) return "";
    // The request object is inside the app instance.
    // We need to base64 encode the JSON string of the request.
    const request = (app as any).request;
    if (request) {
        const jsonString = JSON.stringify(request);
        const base64 = typeof window !== 'undefined' ? btoa(jsonString) : Buffer.from(jsonString).toString('base64');
        // URL safe base64
        const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return `https://self.xyz/r/${urlSafeBase64}`;
    }
    return "";
}

interface SelfContextType {
    selfApp: any | null;
    universalLink: string;
    initiateSelfVerification: () => void;
}

const SelfContext = createContext<SelfContextType | undefined>(undefined);

export function SelfProvider({ children }: { children: ReactNode }) {
    const { address } = useAccount();
    const [selfApp, setSelfApp] = useState<any | null>(null);
    const [universalLink, setUniversalLink] = useState<string>("");

    useEffect(() => {
        if (!address) {
            setSelfApp(null);
            setUniversalLink("");
            return;
        }

        try {
            const app = new SelfAppBuilder({
                appName: "SwipePad",
                scope: "swipe-pad",
                endpoint: "https://api.self.xyz", // Production endpoint
                endpointType: "celo", // Production Celo
                userId: address,
                userIdType: "hex",
                disclosures: {
                    minimumAge: 18,
                },
                deeplinkCallback: typeof window !== 'undefined' ? `${window.location.origin}/?status=verified` : "https://farcaster-swipepad.vercel.app/?status=verified",
            }).build();

            setSelfApp(app);
            setUniversalLink(generateUniversalLink(app));
        } catch (error) {
            console.error("Failed to build Self App:", error);
        }

    }, [address]);

    const initiateSelfVerification = () => {
        // This function can be used to trigger any side effects if needed,
        // but primarily the button will use the universalLink directly.
        console.log("Initiating Self Verification...");
    };

    return (
        <SelfContext.Provider value={{ selfApp, universalLink, initiateSelfVerification }}>
            {children}
        </SelfContext.Provider>
    );
}

export const useSelf = () => {
    const context = useContext(SelfContext);
    if (!context) {
        throw new Error("useSelf must be used within a SelfProvider");
    }
    return context;
};
