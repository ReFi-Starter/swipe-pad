import Link from "next/link"
import { ArrowLeft, Bell, Settings } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  showBack?: boolean
  backUrl?: string
  showIcons?: boolean
}

export function Header({ showBack = false, backUrl = "/", showIcons = true }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-gray-100 shrink-0">
      <div className="w-16"></div>

      <div className="flex-1 text-center">
        <span className="text-lg font-semibold text-primary">SwipePad</span>
      </div>

      <div className="flex items-center justify-end gap-2 w-16">
        <button className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-primary/10">
          <Bell className="h-5 w-5" />
        </button>
        <a href="/profile/settings" className="p-2 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-primary/10">
          <Settings className="h-5 w-5" />
        </a>
      </div>
    </header>
  )
}
