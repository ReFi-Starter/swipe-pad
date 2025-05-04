"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface TopUpModalProps {
  isOpen: boolean
  onClose: () => void
  onTopUp: (amount: number) => void
}

export function TopUpModal({ isOpen, onClose, onTopUp }: TopUpModalProps) {
  const [customAmount, setCustomAmount] = useState("")

  if (!isOpen) return null

  const handleTopUp = (amount: number) => {
    onTopUp(amount)
  }

  const handleCustomTopUp = () => {
    const amount = Number.parseFloat(customAmount)
    if (!isNaN(amount) && amount > 0) {
      onTopUp(amount)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Top up to keep swiping</h2>
          <p className="text-slate-600">Add ¢1, ¢5, or custom amount in your local stablecoin</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <Button variant="outline" onClick={() => handleTopUp(0.01)} className="h-12">
            ¢1
          </Button>
          <Button variant="outline" onClick={() => handleTopUp(0.05)} className="h-12">
            ¢5
          </Button>
          <Button variant="outline" onClick={() => handleTopUp(0.1)} className="h-12">
            ¢10
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="h-12"
            min="0.01"
            step="0.01"
          />
          <Button onClick={handleCustomTopUp} className="h-12 whitespace-nowrap">
            Add Custom
          </Button>
        </div>

        <Button onClick={() => handleTopUp(1)} className="w-full h-12 bg-[#22CC88] hover:bg-[#1db978]">
          Quick Add $1.00
        </Button>
      </div>
    </div>
  )
}
