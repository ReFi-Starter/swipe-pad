"use client"

import { useState } from "react"
import { createAgeVerificationRequest, generateSelfQRCodeData } from "@/lib/self"
import { X } from "lucide-react"

interface SelfVerificationButtonProps {
    onVerified: () => void
}

export function SelfVerificationButton({ onVerified }: SelfVerificationButtonProps) {
    const [showModal, setShowModal] = useState(false)
    const [qrData, setQrData] = useState<string | null>(null)
    const [isVerifying, setIsVerifying] = useState(false)

    const handleStartVerification = () => {
        const request = createAgeVerificationRequest("https://farcaster-swipepad.vercel.app/api/self-callback") // Mock callback
        const data = generateSelfQRCodeData(request)
        setQrData(data)
        setShowModal(true)

        // In a real app, we would poll the backend for verification status here.
        // For this demo, we'll simulate a user completing it.
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
                                Scan this QR code with your Self app to prove you are over 18 without revealing your exact age.
                            </p>

                            <div className="bg-white p-4 rounded-xl inline-block mb-6">
                                {/* Using a public QR code API for the demo to avoid needing a QR library */}
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData || "")}`}
                                    alt="Self Verification QR"
                                    className="w-48 h-48"
                                />
                            </div>

                            <div className="space-y-3">
                                <button
                                    onClick={handleSimulateSuccess}
                                    disabled={isVerifying}
                                    className="w-full py-3 bg-[#677FEB] hover:bg-[#5A6FD3] text-white font-bold rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {isVerifying ? "Verifying..." : "Simulate Verified Scan"}
                                </button>
                                <p className="text-xs text-gray-500">
                                    Waiting for verification...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
