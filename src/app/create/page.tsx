"use client"

import { CreateDonationProject } from "@/components/create-donation"

export default function CreatePage() {
  return (
    <main className="container py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create a Donation Project</h1>
        <p className="text-gray-500">
          Start fundraising for your project on the Celo blockchain
        </p>
      </div>
      <CreateDonationProject />
    </main>
  )
}
