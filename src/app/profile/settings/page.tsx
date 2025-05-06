"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrivacyToggle } from "@/components/privacy-toggle"
import { Bell, Users, LogOut, RefreshCw } from "lucide-react"
import { SwipeSettings } from "@/components/swipe-settings"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { toast } from "sonner"

export default function ProfileSettings() {
  const router = useRouter()
  const { resetOnboarding } = useAppStore()
  const [isPublicProfile, setIsPublicProfile] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [friendRequests, setFriendRequests] = useState(true)
  const [defaultSwipeAmount, setDefaultSwipeAmount] = useState(0.01)
  const [autoBatch, setAutoBatch] = useState(true)

  const handleResetOnboarding = () => {
    resetOnboarding()
    router.push("/onboarding")
  }

  const handleResetApp = async () => {
    resetOnboarding()
    toast.success("App reset successfully")
    router.push("/")
  }

  return (
    <div className="min-h-screen pb-16">
      <Header title="Settings" showBack backUrl="/profile" />

      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Privacy</h2>
            <PrivacyToggle
              icon={Users}
              label="Public Profile"
              description="Allow others to see your donation activity"
              checked={isPublicProfile}
              onCheckedChange={setIsPublicProfile}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Notifications</h2>
            <PrivacyToggle
              icon={Bell}
              label="Push Notifications"
              description="Get notified about important updates"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <PrivacyToggle
              icon={Users}
              label="Friend Requests"
              description="Receive friend requests from other users"
              checked={friendRequests}
              onCheckedChange={setFriendRequests}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Swipe Settings</h2>
            <SwipeSettings
              defaultAmount={defaultSwipeAmount}
              onDefaultAmountChange={setDefaultSwipeAmount}
              autoBatch={autoBatch}
              onAutoBatchChange={setAutoBatch}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Account</h2>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleResetOnboarding}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset Onboarding
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        <div className="rounded-lg border p-4">
          <h2 className="font-medium mb-2">Reset App</h2>
          <p className="text-sm text-slate-600 mb-4">
            This will reset the app to its initial state and show the onboarding screens again.
          </p>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleResetApp}
          >
            Reset App
          </Button>
        </div>
      </div>
    </div>
  )
}
