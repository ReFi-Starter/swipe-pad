"use client"

import { SelfQRcodeWrapper } from "@selfxyz/qrcode"
import { Smartphone, X } from "lucide-react"
import { useState } from "react"
import { useAccount } from "wagmi"
import { useSelf } from "./SelfProvider"

interface SelfVerificationButtonProps {
    onVerified?: () => void
}

export function SelfVerificationButton({ onVerified }: SelfVerificationButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const { selfApp, universalLink, initiateSelfVerification } = useSelf()
    const { address } = useAccount()

    const handleOpenModal = () => {
        if (!address) {
            alert("Please connect your wallet first.");
            return;
        }
        if (!universalLink) {
            alert("Initializing identity... please wait a moment.");
            return;
        }
        initiateSelfVerification();
        setShowModal(true);
    }

    // Always render the button, but change text/state based on readiness
    let buttonText = "Verify Age with Self";
    let isDisabled = false;
    
    if (!address) {
        buttonText = "Connect Wallet to Verify";
        // We don't disable it, but clicking it will prompt to connect (or we could disable)
        // Let's keep it enabled but show alert for now, or better: rely on parent to handle connection
    } else if (!universalLink) {
        buttonText = "Initializing Identity...";
        isDisabled = true;
    }

    return (
        <>
            <button
                type="button"
                onClick={handleOpenModal}
                disabled={isDisabled}
                className={`flex items-center justify-center px-4 py-2 bg-[#2E3348] hover:bg-[#3D435C] text-white rounded-lg transition-colors text-sm font-medium border border-[#677FEB]/30 ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <img src="/images/self-logo.png" alt="Self" className="w-5 h-5 mr-2 rounded-full" onError={(e) => e.currentTarget.style.display = 'none'} />
                <span>{buttonText}</span>
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
                            <h3 className="text-xl font-bold text-white mb-2">Self Verification</h3>
                            <p className="text-gray-400 text-sm mb-6">
                                Scan the QR code to verify your identity with self.xyz
                            </p>

                            {/* Mobile Deep Link Button */}
                            <div className="mb-6">
                                {universalLink && universalLink !== "#" ? (
                                    <>
                                        <a
                                            href={universalLink}
                                            className="flex items-center justify-center w-full py-3 bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold rounded-xl transition-colors mb-2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => console.log("Opening Self link:", universalLink)}
                                        >
                                            <Smartphone className="w-5 h-5 mr-2" />
                                            Open Self App
                                        </a>
                                        <p className="text-xs text-gray-500">
                                            Tap above if you have the Self app installed on this device.
                                        </p>
                                    </>
                                ) : (
                                    <div className="bg-gray-800 rounded-xl p-4 text-center">
                                        <p className="text-sm text-gray-400">
                                            Please connect your wallet to generate verification link
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-gray-700"></div>
                                <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR SCAN QR CODE</span>
                                <div className="flex-grow border-t border-gray-700"></div>
                            </div>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6 mt-4 min-h-[200px] flex items-center justify-center">
                                {selfApp ? (
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
                                ) : (
                                    <div className="text-center text-gray-500 text-sm">
                                        {!universalLink ? "Connect wallet to generate QR code" : "Loading QR code..."}
                                    </div>
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
