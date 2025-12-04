"use client"

import { SelfAppBuilder, SelfQRcodeWrapper } from "@selfxyz/qrcode"
import { Smartphone, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAccount } from "wagmi"

interface SelfVerificationButtonProps {
    onVerified?: () => void
}

export function SelfVerificationButton({ onVerified }: SelfVerificationButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [selfApp, setSelfApp] = useState<any | null>(null)
    const [universalLink, setUniversalLink] = useState<string>("")
    const { address } = useAccount()

    useEffect(() => {
        if (!address) return;

        // Initialize Self App
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
        }).build()

        setSelfApp(app)
        
        // Generate Universal Link manually since helper is not exported
        if (app) {
            // The request object is inside the app instance. 
            // We need to base64 encode the JSON string of the request.
            // The structure of app.request is what we need.
            // We'll use a safe way to access it.
            const request = (app as any).request;
            if (request) {
                const jsonString = JSON.stringify(request);
                const base64 = typeof window !== 'undefined' ? btoa(jsonString) : Buffer.from(jsonString).toString('base64');
                // URL safe base64
                const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
                const link = `https://self.xyz/r/${urlSafeBase64}`;
                setUniversalLink(link);
            }
        }

    }, [address])

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center justify-center px-4 py-2 bg-[#2E3348] hover:bg-[#3D435C] text-white rounded-lg transition-colors text-sm font-medium border border-[#677FEB]/30"
            >
                <img src="/images/self-logo.png" alt="Self" className="w-5 h-5 mr-2 rounded-full" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span>Verify Age with Self</span>
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1F2732] rounded-2xl p-6 max-w-sm w-full border border-gray-700 relative shadow-2xl">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white mb-2">Verify Age</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Prove you are over 18 without revealing your exact age.
                            </p>

                            {/* Mobile Deep Link Button */}
                            <div className="mb-6">
                                <a
                                    href={universalLink || "#"}
                                    className="flex items-center justify-center w-full py-3 bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold rounded-xl transition-colors mb-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Smartphone className="w-5 h-5 mr-2" />
                                    Open Self App
                                </a>
                                <p className="text-xs text-gray-500">
                                    Tap above if you have the Self app installed on this device.
                                </p>
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR SCAN QR CODE</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6 mt-4">
                                {selfApp && (
                                    <SelfQRcodeWrapper
                                        selfApp={selfApp}
                                        onSuccess={() => {
                                            console.log("Verification successful!");
                                            onVerified?.();
                                            setShowModal(false);
                                        }}
                                        onError={(error: any) => {
                                            console.error("Verification error:", error);
                                        }}
                                    />
                                )}
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">
                                Scan with the Self App to verify.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
