"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ConnectButton() {
  // State to handle client-side rendering only
  const [mounted, setMounted] = useState(false);
  
  const { 
    isConnected, 
    address, 
    isOnCorrectNetwork, 
    networkName,
    connectWallet, 
    disconnectWallet,
    switchNetwork 
  } = useWallet();
  
  // Use useEffect to update the mounted state when the component mounts in the client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Format address for display (e.g., 0x1234...abcd)
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Render a placeholder button during SSR to avoid hydration errors
  if (!mounted) {
    return (
      <Button>
        Connect Wallet
      </Button>
    );
  }

  if (!isConnected) {
    return (
      <Button onClick={connectWallet}>
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {!isOnCorrectNetwork && (
        <Button 
          variant="destructive" 
          size="sm"
          onClick={switchNetwork}
        >
          Switch to {networkName}
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            {formatAddress(address || "")}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-2" disabled>
            <Check className={cn("h-4 w-4", isOnCorrectNetwork ? "opacity-100" : "opacity-0")} />
            <span>Connected to {networkName}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2"
            onClick={() => {
              if (address) {
                navigator.clipboard.writeText(address);
              }
            }}
          >
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2"
            onClick={() => {
              if (address) {
                window.open(`https://explorer.celo.org/alfajores/address/${address}`, '_blank');
              }
            }}
          >
            <ExternalLink className="h-4 w-4" />
            <span>View on Explorer</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2 text-red-500" 
            onClick={disconnectWallet}
          >
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 