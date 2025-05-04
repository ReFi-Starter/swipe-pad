"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { swipeAmounts } from "@/lib/utils"

interface SwipeSettingsProps {
  defaultAmount: number
  autoBatch: boolean
  onChangeAmount: (amount: number) => void
  onChangeAutoBatch: (enabled: boolean) => void
}

export function SwipeSettings({ defaultAmount, autoBatch, onChangeAmount, onChangeAutoBatch }: SwipeSettingsProps) {
  return (
    <Card className="overflow-hidden bento-bevel">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Swipe Settings</h3>

        <div className="mb-4">
          <p className="text-sm text-slate-500 mb-2">Default donation amount</p>
          <div className="grid grid-cols-4 gap-2">
            {swipeAmounts.map((amount) => (
              <Button
                key={amount.value}
                variant={defaultAmount === amount.value ? "default" : "outline"}
                className="w-full"
                onClick={() => onChangeAmount(amount.value)}
              >
                {amount.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="auto-batch" className="font-medium">
              Enable auto-batch
            </Label>
            <p className="text-xs text-slate-500">Process donations in batches to reduce transaction fees</p>
          </div>
          <Switch id="auto-batch" checked={autoBatch} onCheckedChange={onChangeAutoBatch} />
        </div>
      </CardContent>
    </Card>
  )
}
