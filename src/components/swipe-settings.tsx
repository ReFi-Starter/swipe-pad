"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { swipeAmounts } from "@/lib/utils"
import { Input } from "@/components/ui/input"

export interface SwipeSettingsProps {
  defaultAmount: number
  onDefaultAmountChange: (amount: number) => void
  autoBatch: boolean
  onAutoBatchChange: (enabled: boolean) => void
}

export function SwipeSettings({
  defaultAmount,
  onDefaultAmountChange,
  autoBatch,
  onAutoBatchChange,
}: SwipeSettingsProps) {
  return (
    <Card className="overflow-hidden bento-bevel">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Swipe Settings</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="default-amount">Default Donation Amount</Label>
            <div className="mt-1">
              <Input
                id="default-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={defaultAmount}
                onChange={(e) => onDefaultAmountChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <p className="text-sm text-slate-500 mt-1">Amount to donate with each right swipe</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-batch">Auto-batch Transactions</Label>
              <p className="text-sm text-slate-500">Combine multiple donations into a single transaction</p>
            </div>
            <Switch id="auto-batch" checked={autoBatch} onCheckedChange={onAutoBatchChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
