"use client"
import { Heart, X } from "lucide-react"
import { formatCurrency, getUserSettings } from "@/lib/utils"
import { toast } from "sonner"

interface ToastWithProgressProps {
  type: "success" | "skip" | "error"
  amount?: number
  points?: number
  duration?: number
}

export function showToastWithProgress({ type, amount = 0, points = 0, duration = 3000 }: ToastWithProgressProps) {
  const userSettings = getUserSettings()

  const config = {
    success: {
      icon: <Heart className="h-5 w-5 text-green-500" />,
      title: "¡Donación realizada!",
      description: `Has donado ${formatCurrency(amount, userSettings.currency)} y ganado ${points} pts`,
    },
    skip: {
      icon: <X className="h-5 w-5 text-slate-500" />,
      title: "Proyecto saltado",
      description: "Has decidido no donar a este proyecto",
    },
    error: {
      icon: <X className="h-5 w-5 text-white" />,
      title: "Error",
      description: "Ha ocurrido un error al procesar tu donación",
    },
  }[type]

  return toast(config.title, {
    description: config.description,
    icon: config.icon,
    duration: duration,
    className: type === "success" ? "bg-green-50 border-green-200" : type === "error" ? "bg-red-50 border-red-200" : "",
  })
}
