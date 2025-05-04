"use client";

import { useState } from "react";
import { useDonationPool } from "@/hooks/useDonationPool";
import { useWallet } from "@/hooks/useWallet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { formatEther } from "viem";
import { toast } from "sonner";
import Image from "next/image";

interface ProjectDetailsProps {
  projectId: bigint;
}

export function ProjectDetails({ projectId }: ProjectDetailsProps) {
  const { useProjectDetails, useProjectBalance, donate, isPending } = useDonationPool();
  const { isConnected, isOnCorrectNetwork } = useWallet();
  const [donationAmount, setDonationAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Fetch project details
  const { 
    data: projectDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails
  } = useProjectDetails(projectId);
  
  // Fetch project balance
  const {
    data: projectBalance,
    isLoading: isLoadingBalance,
    isError: isErrorBalance
  } = useProjectBalance(projectId);
  
  // Handle donation submission
  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!isOnCorrectNetwork) {
      toast.error("Please switch to Celo Alfajores network");
      return;
    }
    
    try {
      setSubmitting(true);
      
      await donate(projectId, donationAmount);
      
      toast.success("Donation initiated. Please wait for confirmation.");
      setDonationAmount("");
    } catch (error) {
      console.error("Failed to donate:", error);
      toast.error("Failed to donate. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Format dates for display
  const formatDate = (timestamp: bigint) => {
    try {
      return formatDistanceToNow(new Date(Number(timestamp) * 1000), { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };
  
  // Calculate funding progress
  const calculateProgress = () => {
    if (!projectDetails || !projectBalance) return 0;
    
    const fundingGoal = projectDetails.fundingGoal;
    if (fundingGoal === BigInt(0)) return 0;
    
    return Number((projectBalance * BigInt(100)) / fundingGoal);
  };
  
  // Calculate time left
  const calculateTimeLeft = () => {
    if (!projectDetails) return "";
    
    const endTime = projectDetails.endTime;
    const now = BigInt(Math.floor(Date.now() / 1000));
    
    if (endTime < now) {
      return "Funding ended";
    }
    
    return `Ends ${formatDate(endTime)}`;
  };
  
  // Determine funding model text
  const getFundingModelText = () => {
    if (!projectDetails) return "";
    
    return projectDetails.fundingModel === BigInt(0)
      ? "All or Nothing" 
      : "Keep What You Raise";
  };
  
  if (isLoadingDetails || isLoadingBalance) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-48">
            <p>Loading project details...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (isErrorDetails || isErrorBalance || !projectDetails) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center min-h-48">
            <p className="text-red-500">Error loading project details</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const progress = calculateProgress();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{projectDetails.projectName}</CardTitle>
        <CardDescription>
          {projectDetails.imageUrl && (
            <div className="mb-4">
              <Image 
                src={projectDetails.imageUrl} 
                alt={projectDetails.projectName} 
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}
          <p className="mt-2">{projectDetails.projectDescription}</p>
          {projectDetails.projectUrl && (
            <a 
              href={projectDetails.projectUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              Project Website
            </a>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>
              {projectBalance ? formatEther(projectBalance) : "0"} CELO raised
            </span>
            <span>
              Goal: {projectDetails.fundingGoal ? formatEther(projectDetails.fundingGoal) : "0"} CELO
            </span>
          </div>
          <Progress value={progress} className="h-2 w-full" />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>{getFundingModelText()}</span>
            <span>{calculateTimeLeft()}</span>
          </div>
        </div>
        
        <form onSubmit={handleDonate} className="space-y-4">
          <div>
            <label htmlFor="donationAmount" className="block text-sm font-medium mb-1">
              Donation Amount (CELO)
            </label>
            <Input
              id="donationAmount"
              type="number"
              step="0.01"
              min="0.01"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Enter amount to donate"
              required
              disabled={!isConnected || !isOnCorrectNetwork || submitting || isPending}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={!isConnected || !isOnCorrectNetwork || submitting || isPending}
          >
            {submitting || isPending ? "Processing..." : "Donate Now"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-sm text-gray-500 flex justify-between">
        <span>Started {formatDate(projectDetails.startTime)}</span>
        <span>Project ID: {projectId.toString()}</span>
      </CardFooter>
    </Card>
  );
} 