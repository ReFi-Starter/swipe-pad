"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrivacyToggle } from "@/components/privacy-toggle"
import { Bell, Users, Shield, LogOut } from "lucide-react"
import { SwipeSettings } from "@/components/swipe-settings"

export default function ProfileSettings() {
  const [isPublicProfile, setIsPublicProfile] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [friendRequests, setFriendRequests] = useState(true)
  const [defaultSwipeAmount, setDefaultSwipeAmount] = useState(0.01)
  const [autoBatch, setAutoBatch] = useState(true)

  return (
    <div className="min-h-screen pb-16">
      <Header title="Settings" showBack backUrl="/profile" />

      <div className="p-4 space-y-4">
        <h2 className="font-semibold text-lg mb-2">Account Settings</h2>

        <PrivacyToggle isPublic={isPublicProfile} onChange={setIsPublicProfile} />

        <SwipeSettings
          defaultAmount={defaultSwipeAmount}
          autoBatch={autoBatch}
          onChangeAmount={setDefaultSwipeAmount}
          onChangeAutoBatch={setAutoBatch}
        />

        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-5 w-5 text-slate-500 mr-3" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-xs text-slate-500">Receive donation and achievement alerts</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22CC88]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-slate-500 mr-3" />
                <div>
                  <p className="font-medium">Friend Requests</p>
                  <p className="text-xs text-slate-500">Allow others to send you friend requests</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={friendRequests}
                  onChange={() => setFriendRequests(!friendRequests)}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22CC88]"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        <h2 className="font-semibold text-lg mt-6 mb-2">Security</h2>

        <Card>
          <CardContent className="p-4">
            <Button variant="ghost" className="w-full justify-start text-slate-700">
              <Shield className="h-5 w-5 mr-3" />
              Privacy Policy
            </Button>

            <Button variant="ghost" className="w-full justify-start text-slate-700">
              <Shield className="h-5 w-5 mr-3" />
              Terms of Service
            </Button>

            <Button variant="ghost" className="w-full justify-start text-red-500">
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
