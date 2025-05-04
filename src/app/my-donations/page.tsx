"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useDonationPool } from "@/hooks/useDonationPool";

// Interface for donation objects
interface Donation {
  id: string;
  title: string;
  amount: string;
  date: string;
}

export default function MyDonationsPage() {
  const [mounted, setMounted] = useState(false);
  const { isConnected, address } = useWallet();
  const { useProjectsDonatedTo } = useDonationPool();
  
  // State for donations
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState<Donation[]>([]);
  
  // Ensure the component is mounted (client)
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get projects the user has donated to
  const { 
    data: projectIds, 
    isLoading: isLoadingProjects,
    isError: isErrorProjects
  } = useProjectsDonatedTo(address);
  
  // Load details of the projects
  useEffect(() => {
    const fetchDonationDetails = async () => {
      if (!mounted) return;
      
      if (!projectIds || projectIds.length === 0) {
        setLoading(false);
        return;
      }
      
      // TODO: Implement the real loading of the projects when we have blockchain connection
      const mockDonations: Donation[] = [
        { id: "1", title: "Clean Water Initiative", amount: "0.5", date: "2023-08-15" },
        { id: "2", title: "Education for All", amount: "1.2", date: "2023-09-01" },
      ];
      
      setDonations(mockDonations);
      setLoading(false);
    };
    
    if (!isLoadingProjects && mounted) {
      fetchDonationDetails();
    }
  }, [projectIds, isLoadingProjects, mounted]);
  
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
          <h1 className="text-2xl font-bold mb-4">My Donations</h1>
          <p className="mb-4">Please connect your wallet to see your donations.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8">My Donations</h1>
      
      {loading || isLoadingProjects ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((id) => (
              <div key={id} className="flex justify-between pb-4 border-b">
                <div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isErrorProjects ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500">Error loading your donations. Please try again later.</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="mb-4">You haven&apos;t made any donations yet.</p>
          <Link href="/" className="text-blue-500 hover:underline">
            Browse Projects
          </Link>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {donations.map((donation) => (
            <div key={donation.id} className="flex justify-between py-4 border-b last:border-0">
              <div>
                <h3 className="font-medium">{donation.title}</h3>
                <p className="text-sm text-gray-500">{donation.date}</p>
              </div>
              <div>
                <span className="font-medium">{donation.amount} CELO</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 