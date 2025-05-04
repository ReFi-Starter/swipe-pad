import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  title?: string
  subtitle?: string
  showBack?: boolean
  backUrl?: string
}

export function Header({ title = "SwipePad", subtitle, showBack = false, backUrl = "/" }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-center border-b border-slate-100 relative px-4">
      {showBack && (
        <Link href={backUrl} className="absolute left-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      )}
      <div className="text-center">
        <h1 className="font-semibold text-lg">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </header>
  )
}
