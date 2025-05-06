"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/use-wallet";
import { ProjectList } from "@/components/project-list";

export default function MyProjectsPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected } = useWallet();
  
  // Ensure the component is mounted (client)
  useEffect(() => { 
    setMounted(true);
  }, []);
  
  // During SSR or when not mounted, show a loading state
  if (!mounted) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-white p-8 rounded-lg shadow-md animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  // If not connected, show message to connect the wallet
  if (!isConnected) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">My Projects</h1>
          <p className="mb-4">Please connect your wallet to see your projects.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link 
          href="/create" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Create New Project
        </Link>
      </div>
      
      <ProjectList />
    </div>
  );
} 