import { useEffect, useState } from "react";
import { 
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract
} from 'wagmi';
import { parseUnits } from 'viem';
import { useWallet } from "@/hooks/useWallet";
import { celoAlfajores } from "wagmi/chains";
import { donationPoolAbi } from '@/lib/wagmi/contracts';

// TODO: Update with actual deployment address when deployed
const DONATION_POOL_ADDRESS = '0x0000000000000000000000000000000000000000';

// Define a proper interface for project details
export interface ProjectDetail {
  startTime: bigint;
  endTime: bigint;
  projectName: string;
  projectDescription: string;
  projectUrl: string;
  imageUrl: string;
  fundingGoal: bigint;
  fundingModel: bigint;
}

// Define interface for project UI
export interface ProjectUI {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  funding: {
    goal: string;
    raised: string;
    progress: number;
  };
  creator: {
    name: string;
    address: string;
  };
  dates: {
    start: string;
    end: string;
  };
}

/**
 * Hook for interacting with the DonationPool contract
 */
export function useDonationPool() {
  // State to control if the component is mounted (client vs server)
  const [mounted, setMounted] = useState(false);
  
  // When the component mounts, update the state
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { isConnected, isOnCorrectNetwork } = useWallet();
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);
  
  // Write operations
  const { writeContract, isPending: isWritePending, data: txHash } = useWriteContract();
  
  // Transaction receipt
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash: txHash,
      confirmations: 1
    });
  
  // Set lastTxHash when a transaction is submitted
  useEffect(() => {
    if (txHash) {
      setLastTxHash(txHash);
    }
  }, [txHash]);
  
  /**
   * Create a new donation project
   */
  const createProject = async (
    projectName: string,
    projectDescription: string,
    projectUrl: string,
    imageUrl: string,
    fundingGoal: string,
    fundingModel: 0 | 1, // 0 = ALL_OR_NOTHING, 1 = KEEP_WHAT_YOU_RAISE
    tokenAddress: `0x${string}`
  ) => {
    // Verify that we are in the client and the wallet is connected
    if (!mounted || !isConnected || !isOnCorrectNetwork) {
      throw new Error("Wallet not connected or on wrong network");
    }
    
    // Calculate start and end times - use Date only in the client
    const now = Math.floor(Date.now() / 1000);
    const startTime = BigInt(now + 60 * 60); // Start in 1 hour
    const endTime = BigInt(now + (30 * 24 * 60 * 60)); // End in 30 days
    
    // Convert funding goal to wei
    const fundingGoalWei = parseUnits(fundingGoal, 18);
    
    return writeContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'createProject',
      args: [
        Number(startTime),
        Number(endTime),
        projectName,
        projectDescription,
        projectUrl,
        imageUrl,
        fundingGoalWei,
        fundingModel,
        tokenAddress
      ],
      chainId: celoAlfajores.id
    });
  };
  
  /**
   * Donate to a project
   */
  const donate = async (projectId: bigint, amount: string, tokenDecimals = 18) => {
    // Verify that we are in the client and the wallet is connected
    if (!mounted || !isConnected || !isOnCorrectNetwork) {
      throw new Error("Wallet not connected or on wrong network");
    }
    
    // Convert amount to wei
    const amountWei = parseUnits(amount, tokenDecimals);
    
    return writeContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'donate',
      args: [projectId, amountWei],
      chainId: celoAlfajores.id
    });
  };
  
  // Custom hook for reading project details
  function useProjectDetails(projectId: bigint | undefined) {
    return useReadContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'getProjectDetails',
      args: projectId ? [projectId] : undefined,
      chainId: celoAlfajores.id,
      query: {
        enabled: !!projectId && mounted // Only enable the query when we are in the client
      }
    }) as unknown as { data: ProjectDetail | undefined; isLoading: boolean; isError: boolean; };
  }
  
  // Custom hook for reading project balance
  function useProjectBalance(projectId: bigint | undefined) {
    return useReadContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'getProjectBalance',
      args: projectId ? [projectId] : undefined,
      chainId: celoAlfajores.id,
      query: {
        enabled: !!projectId && mounted // Only enable the query when we are in the client
      }
    });
  }
  
  // Custom hook to get projects created by an address
  function useProjectsCreatedBy(creatorAddress: `0x${string}` | undefined) {
    return useReadContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'getProjectsCreatedBy',
      args: creatorAddress ? [creatorAddress] : undefined,
      chainId: celoAlfajores.id,
      query: {
        enabled: !!creatorAddress && mounted // Only enable the query when we are in the client
      }
    });
  }
  
  // Custom hook to get projects donated to by an address
  function useProjectsDonatedTo(donorAddress: `0x${string}` | undefined) {
    return useReadContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'getProjectsDonatedToBy',
      args: donorAddress ? [donorAddress] : undefined,
      chainId: celoAlfajores.id,
      query: {
        enabled: !!donorAddress && mounted // Only enable the query when we are in the client
      }
    });
  }
  
  // Custom hook to claim refund for failed ALL_OR_NOTHING project
  const claimRefund = async (projectId: bigint) => {
    // Verify that we are in the client and the wallet is connected
    if (!mounted || !isConnected || !isOnCorrectNetwork) {
      throw new Error("Wallet not connected or on wrong network");
    }
    
    return writeContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'claimRefund',
      args: [projectId],
      chainId: celoAlfajores.id
    });
  };
  
  // Custom hook for project creators to withdraw funds
  const withdrawFunds = async (projectId: bigint) => {
    // Verify that we are in the client and the wallet is connected
    if (!mounted || !isConnected || !isOnCorrectNetwork) {
      throw new Error("Wallet not connected or on wrong network");
    }
    
    return writeContract({
      address: DONATION_POOL_ADDRESS as `0x${string}`,
      abi: donationPoolAbi,
      functionName: 'withdrawFunds',
      args: [projectId],
      chainId: celoAlfajores.id
    });
  };
  
  // Function to convert contract details to UI format
  const convertToUIProject = (projectId: string, projectDetail: ProjectDetail): ProjectUI => {
    return {
      id: projectId,
      title: projectDetail.projectName,
      description: projectDetail.projectDescription,
      imageUrl: projectDetail.imageUrl,
      category: "General", // No category in the contract, could be added
      funding: {
        goal: (Number(projectDetail.fundingGoal) / 1e18).toString(),
        raised: "0", // We would need to get this from somewhere else
        progress: 0, // We would need to calculate this
      },
      creator: {
        name: "Project Creator", // We don't have this data in the contract
        address: "0x", // We would need to get this
      },
      dates: {
        start: new Date(Number(projectDetail.startTime) * 1000).toLocaleDateString(),
        end: new Date(Number(projectDetail.endTime) * 1000).toLocaleDateString(),
      }
    };
  };
  
  return {
    createProject,
    donate,
    useProjectDetails,
    useProjectBalance,
    useProjectsCreatedBy,
    useProjectsDonatedTo,
    claimRefund,
    withdrawFunds,
    convertToUIProject,
    isPending: isWritePending || isConfirming,
    isConfirmed,
    lastTxHash,
    mounted // Export the mounted state so components can know if they are in the client
  };
} 