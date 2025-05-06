"use client"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-white overflow-hidden">
      {children}
    </div>
  )
} 