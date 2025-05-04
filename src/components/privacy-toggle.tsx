"use client"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Lock } from "lucide-react"

interface PrivacyToggleProps {
  isPublic: boolean
  onChange: (isPublic: boolean) => void
  label?: string
  description?: string
}

export function PrivacyToggle({ isPublic, onChange, label = "Profile Privacy", description }: PrivacyToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 bento-bevel">
      <div className="flex items-center">
        {isPublic ? (
          <Globe className="h-5 w-5 text-[#22CC88] mr-3" />
        ) : (
          <Lock className="h-5 w-5 text-slate-500 mr-3" />
        )}
        <div>
          <Label htmlFor="profile-privacy" className="font-medium">
            {isPublic ? `Public ${label}` : `Private ${label}`}
          </Label>
          {description ? (
            <p className="text-xs text-slate-500">{description}</p>
          ) : (
            <p className="text-xs text-slate-500">
              {isPublic
                ? "Your donations and tags are visible to everyone"
                : "Only you can see your donations and tags"}
            </p>
          )}
        </div>
      </div>
      <Switch id="profile-privacy" checked={isPublic} onCheckedChange={onChange} />
    </div>
  )
}
