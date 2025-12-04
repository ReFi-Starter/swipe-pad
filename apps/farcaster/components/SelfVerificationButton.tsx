"use client"

import { createAgeVerificationRequest, generateSelfDeepLink, generateSelfQRCodeData } from "@/lib/self"
import { Smartphone, X } from "lucide-react"
import { useState } from "react"

interface SelfVerificationButtonProps {
    onVerified: () => void
}

export function SelfVerificationButton({ onVerified }: SelfVerificationButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [qrData, setQrData] = useState<string | null>(null)
    const [deepLink, setDeepLink] = useState<string | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)

    const handleStartVerification = () => {
        // Use the current window location origin if available, otherwise fallback to production URL
        const origin = typeof window !== 'undefined' ? window.location.origin : "https://farcaster-swipepad.vercel.app"
        const request = createAgeVerificationRequest(`${origin}/?status=verified`)
        const data = generateSelfQRCodeData(request)
        const link = generateSelfDeepLink(request)

        setQrData(data)
        setDeepLink(link)
        setShowModal(true)
    }

    const handleSimulateSuccess = () => {
        setIsVerifying(true)
        setTimeout(() => {
            setIsVerifying(false)
            setShowModal(false)
            onVerified()
            alert("Age verification successful! You are verified as over 18.")
        }, 2000)
    }

    return (
        <>
            <button
                type="button"
                onClick={handleStartVerification}
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
                                    href={deepLink || "#"}
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

                            {/* QR Code */}
                            <div className="bg-white p-4 rounded-xl inline-block mb-6 mt-4">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData || "")}`}
                                    alt="Self Verification QR"
                                    className="w-40 h-40"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
