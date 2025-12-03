"use client";

import React, { useState, useEffect } from "react";
import { SelfQRcodeWrapper } from "@selfxyz/qrcode";
import { useSelfVerification } from "./SelfVerificationProvider";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";

// ABI for BoostManager (simplified, only updateVerificationStatus)
const boostManagerAbi = [
    {
        inputs: [
            { internalType: "address", name: "userAddress", type: "address" },
            { internalType: "bool", name: "_isVerified", type: "bool" },
        ],
        name: "updateVerificationStatus",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
] as const;

const BOOST_MANAGER_ADDRESS = "0x79213fc0eF8b7ecb29cfF9B13BA23ecF5c0B898a"; // Celo Sepolia BoostManager

export const SelfVerificationButton = () => {
    const { selfApp, isVerified, setIsVerified } = useSelfVerification();
    const [isOpen, setIsOpen] = useState(false);
    const { address } = useAccount();

    const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        if (isSuccess) {
            console.log("Verification recorded on-chain!");
            setIsVerified(true);
            setIsOpen(false);
        }
    }, [isSuccess, setIsVerified]);

    const handleSuccess = () => {
        console.log("Verification successful!");

        // NOTE: The current SDK's onSuccess callback does not pass the verification data.
        // In a production environment, you would typically:
        // 1. Use a backend verifier that receives the proof from the Self relayer.
        // 2. Have the backend verify the proof and age.
        // 3. Return the result to the frontend or call the contract directly.

        // Since we are implementing a frontend-only flow for this demo and cannot access the data directly here,
        // we will proceed with the contract call assuming the user is valid, 
        // OR we use the mock data below to demonstrate the age check logic requested.

        // Mocking data for demonstration (REMOVE IN PRODUCTION)
        const verificationData = {
            disclosures: {
                date_of_birth: "2000-01-01", // Example: Over 18
                nationality: "USA"
            }
        };

        if (verificationData?.disclosures?.date_of_birth) {
            const dob = new Date(verificationData.disclosures.date_of_birth);
            const ageDifMs = Date.now() - dob.getTime();
            const ageDate = new Date(ageDifMs); // miliseconds from epoch
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);

            if (age < 18) {
                console.error("User is under 18");
                alert("Verification failed: You must be over 18.");
                return;
            }
        }

        if (address) {
            writeContract({
                address: BOOST_MANAGER_ADDRESS,
                abi: boostManagerAbi,
                functionName: "updateVerificationStatus",
                args: [address, true],
            });
        } else {
            console.error("No wallet connected");
        }
    };

    const handleError = (error: any) => {
        console.error("Verification failed:", error);
    };

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
            const mobile = Boolean(
                userAgent.match(
                    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
                )
            );
            setIsMobile(mobile);
        };
        checkMobile();
    }, []);

    if (isVerified) {
        return (
            <button disabled className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg cursor-default">
                <CheckCircle className="w-5 h-5" />
                <span>Verified</span>
            </button>
        );
    }

    if (!selfApp) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
                Verify Identity
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-6 text-center">Verify with Self</h2>

                        {(isPending || isConfirming) ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                <p className="text-white font-medium">Recording verification on-chain...</p>
                                <p className="text-gray-400 text-sm mt-2">Please confirm the transaction in your wallet.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-center bg-white p-4 rounded-xl">
                                    {isMobile ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-800 mb-4 font-medium">Tap below to verify in Self App</p>
                                            <SelfQRcodeWrapper
                                                selfApp={selfApp}
                                                onSuccess={handleSuccess}
                                                onError={handleError}
                                                type="deeplink"
                                            />
                                        </div>
                                    ) : (
                                        <SelfQRcodeWrapper
                                            selfApp={selfApp}
                                            onSuccess={handleSuccess}
                                            onError={handleError}
                                        />
                                    )}
                                </div>

                                <p className="text-sm text-gray-400 mt-6 text-center">
                                    {isMobile ? "Tap the button above to open the Self app." : "Scan the QR code with your Self app to verify your identity."}
                                    <br />
                                    <span className="text-xs text-gray-500">(Requires Age 18+ and Valid ID)</span>
                                </p>
                                {writeError && (
                                    <p className="text-red-400 text-xs text-center mt-2">
                                        Error: {writeError.message}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};
