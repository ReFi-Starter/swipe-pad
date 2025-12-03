import { useState, useEffect } from "react"
import { X, Zap, DollarSign, Loader2 } from "lucide-react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { parseEther, erc20Abi } from "viem"

interface BoostModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  projectId: string
  onBoost: (amount: number) => void
}

// ABI for BoostManager (simplified)
const boostManagerAbi = [
  {
    inputs: [
      { internalType: "string", name: "projectId", type: "string" },
      { internalType: "address", name: "token", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "boostProject",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const

// Contract Addresses (Replace with deployed addresses)
const BOOST_MANAGER_ADDRESS = "0x79213fc0eF8b7ecb29cfF9B13BA23ecF5c0B898a" // Celo Sepolia BoostManager
const CUSD_ADDRESS = "0x8740685A9A7d33758b9C6A502e1c948e789Bf4E0" // Celo Sepolia cUSD (User Provided)

export function BoostModal({ isOpen, onClose, projectName, projectId, onBoost }: BoostModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isCustom, setIsCustom] = useState(false)
  const [step, setStep] = useState<"select" | "approve" | "boost" | "success">("select")

  const { address, isConnected } = useAccount()
  const { writeContract: writeApprove, data: approveHash, isPending: isApprovePending } = useWriteContract()
  const { writeContract: writeBoost, data: boostHash, isPending: isBoostPending } = useWriteContract()

  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  })

  const { isLoading: isBoostConfirming, isSuccess: isBoostSuccess } = useWaitForTransactionReceipt({
    hash: boostHash,
  })

  useEffect(() => {
    if (isApproveSuccess) {
      handleBoostTransaction()
    }
  }, [isApproveSuccess])

  useEffect(() => {
    if (isBoostSuccess) {
      const amount = isCustom ? Number.parseFloat(customAmount) : selectedAmount
      if (amount) onBoost(amount)
      setStep("success")
      setTimeout(() => {
        onClose()
        setStep("select")
        setSelectedAmount(null)
        setCustomAmount("")
      }, 2000)
    }
  }, [isBoostSuccess])

  if (!isOpen) return null

  const presetAmounts = [1, 5, 10]

  const handleApprove = () => {
    const amount = isCustom ? Number.parseFloat(customAmount) : selectedAmount
    if (!amount || amount <= 0) return

    const totalAmount = amount * 1.05 // Including 5% fee
    setStep("approve")

    writeApprove({
      address: CUSD_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [BOOST_MANAGER_ADDRESS, parseEther(totalAmount.toString())],
    })
  }

  const handleBoostTransaction = () => {
    const amount = isCustom ? Number.parseFloat(customAmount) : selectedAmount
    if (!amount || amount <= 0) return

    const totalAmount = amount * 1.05
    setStep("boost")

    writeBoost({
      address: BOOST_MANAGER_ADDRESS,
      abi: boostManagerAbi,
      functionName: "boostProject",
      args: [projectId, CUSD_ADDRESS, parseEther(totalAmount.toString())],
    })
  }

  const platformFee = (isCustom ? Number.parseFloat(customAmount) || 0 : selectedAmount || 0) * 0.05

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Boost Project</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {step === "success" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Boosted!</h3>
            <p className="text-gray-400">You successfully boosted {projectName}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-2">Boosting:</p>
              <p className="text-white font-semibold truncate">{projectName}</p>
            </div>

            <div className="mb-6">
              <p className="text-gray-300 text-sm mb-4">Select boost amount (cUSD):</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount)
                      setIsCustom(false)
                      setCustomAmount("")
                    }}
                    disabled={step !== "select"}
                    className={`p-3 rounded-lg border-2 transition-all ${selectedAmount === amount && !isCustom
                      ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                      : "border-gray-600 text-gray-300 hover:border-gray-500"
                      }`}
                  >
                    <DollarSign className="w-4 h-4 mx-auto mb-1" />
                    <span className="font-semibold">{amount}</span>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsCustom(true)
                    setSelectedAmount(null)
                  }}
                  disabled={step !== "select"}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${isCustom ? "border-yellow-400 bg-yellow-400/10" : "border-gray-600 hover:border-gray-500"
                    }`}
                >
                  <span className="text-gray-300">Custom Amount</span>
                </button>
              </div>

              {isCustom && (
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    disabled={step !== "select"}
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                    min="0.01"
                    step="0.01"
                  />
                </div>
              )}
            </div>

            {(selectedAmount || (isCustom && customAmount)) && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Boost Amount:</span>
                  <span className="text-white">${isCustom ? customAmount : selectedAmount}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Platform Fee (5%):</span>
                  <span className="text-white">${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-yellow-400">
                      ${((isCustom ? Number.parseFloat(customAmount) || 0 : selectedAmount || 0) + platformFee).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={step !== "select"}
                className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              {!isConnected ? (
                <button className="flex-1 py-3 px-4 bg-yellow-400 text-black font-medium rounded-lg">
                  Connect Wallet
                </button>
              ) : (
                <button
                  onClick={handleApprove}
                  disabled={(!selectedAmount && (!isCustom || !customAmount)) || step !== "select"}
                  className="flex-1 py-3 px-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {(isApprovePending || isApproveConfirming || isBoostPending || isBoostConfirming) ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {isApprovePending || isApproveConfirming ? "Approving..." : "Boosting..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Boost Project</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </>
        )}

        <p className="text-xs text-gray-400 mt-4 text-center">Boosted projects get higher visibility in the feed</p>
      </div>
    </div>
  )
}
