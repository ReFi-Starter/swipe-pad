"use client"
import { LucideIcon } from "lucide-react"

export interface PrivacyToggleProps {
  icon: LucideIcon
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function PrivacyToggle({ icon: Icon, label, description, checked, onCheckedChange }: PrivacyToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-slate-500 mr-3" />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22CC88]"></div>
      </label>
    </div>
  )
}
