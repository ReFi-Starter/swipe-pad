"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, LinkIcon, Flame } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CreateProject() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [sponsorBoost, setSponsorBoost] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would submit the form data
    router.push("/home")
  }

  return (
    <div className="min-h-screen pb-16">
      <Header title="Create Project" showBack backUrl="/home" />

      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="w-full p-3 border border-slate-200 rounded-lg"
                  placeholder="Project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium mb-2">
                  Image
                </label>
                <div className="border border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50">
                  <Upload className="h-8 w-8 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload or drag and drop</p>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-3 border border-slate-200 rounded-lg min-h-[120px]"
                  placeholder="Project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">
                  Website URL (optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    id="website"
                    className="w-full p-3 pl-10 border border-slate-200 rounded-lg"
                    placeholder="https://yourproject.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Paste your project link to let donors verify impact</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 text-orange-500 mr-3" />
                  <div>
                    <Label htmlFor="sponsor-boost" className="font-medium">
                      Sponsor Boost
                    </Label>
                    <p className="text-xs text-slate-500">Get priority placement in the swipe feed</p>
                  </div>
                </div>
                <Switch id="sponsor-boost" checked={sponsorBoost} onCheckedChange={setSponsorBoost} />
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-20 mt-4">
            <Button type="submit" className="w-full">
              Publish Project
            </Button>
          </div>
        </form>
      </div>

      <BottomNav />
    </div>
  )
}
