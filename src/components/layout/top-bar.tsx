'use client'

import { AvatarCircle } from '@/components/ui/avatar-circle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogoSmall } from '@/components/ui/logo-small'
import { useWallet } from '@/hooks/use-wallet'
import { cn } from '@/lib/styles/tailwind'
import { AlertCircle, Copy, ExternalLink, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { toast } from 'sonner'

interface TopBarProps {
    className?: string
}

export default function TopBar({ className }: TopBarProps) {
    const {
        address,
        isConnected,
        connectWallet,
        disconnectWallet,
        isMiniPay,
        isOnCorrectNetwork,
        networkName,
        switchNetwork,
    } = useWallet()

    useEffect(() => {
        // Auto connect if it's MiniPay
        if (typeof window !== 'undefined' && window.ethereum?.isMiniPay) {
            connectWallet()
        }
    }, [connectWallet])

    // Ensure address is in the correct format for AvatarCircle
    const formattedAddress = address as `0x${string}` | undefined

    const handleCopyAddress = async () => {
        if (address) {
            try {
                // Try using the clipboard API first
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(address)
                } else {
                    // Fallback: Create a temporary textarea element
                    const textArea = document.createElement('textarea')
                    textArea.value = address
                    document.body.appendChild(textArea)
                    textArea.select()
                    document.execCommand('copy')
                    document.body.removeChild(textArea)
                }
                toast.success('Address copied to clipboard', {
                    duration: 2000,
                })
            } catch (error) {
                console.error('Failed to copy address:', error)
                toast.error('Failed to copy address', {
                    duration: 2000,
                })
            }
        }
    }

    const handleNetworkSwitch = async () => {
        if (!isOnCorrectNetwork) {
            try {
                await switchNetwork()
                toast.success(`Switched to ${networkName}`, {
                    duration: 2000,
                })
            } catch {
                toast.error('Failed to switch network', {
                    duration: 2000,
                })
            }
        }
    }

    // Format address for display (e.g., 0x1234...5678)
    const truncateAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    return (
        <nav
            className={cn(
                'h-topbar bg-background fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-4',
                className,
            )}>
            <Link href='/' className='flex items-center'>
                <LogoSmall />
            </Link>
            <div className='flex items-center'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div>
                            <AvatarCircle
                                address={isConnected ? formattedAddress : undefined}
                                onClick={isConnected ? undefined : connectWallet}
                                isMiniPay={isMiniPay}
                            />
                        </div>
                    </DropdownMenuTrigger>
                    {isConnected && address && (
                        <DropdownMenuContent align='end' className='w-64 p-2'>
                            <div className='px-2 pb-2'>
                                <p className='text-muted-foreground text-xs font-medium'>Connected Wallet</p>
                                <DropdownMenuItem
                                    className='focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground cursor-pointer px-0 py-1'
                                    onClick={handleCopyAddress}>
                                    <p
                                        className='text-foreground font-mono text-sm transition-opacity select-none hover:opacity-80'
                                        title='Click to copy address'>
                                        {truncateAddress(address)}
                                    </p>
                                </DropdownMenuItem>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleCopyAddress}
                                className='focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground cursor-pointer gap-2 text-sm'>
                                <span className='flex-1'>Copy Address</span>
                                <Copy className='h-4 w-4 opacity-50' />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (address) {
                                        window.open(`https://explorer.celo.org/alfajores/address/${address}`, '_blank')
                                    }
                                }}
                                className='focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground cursor-pointer gap-2 text-sm'>
                                <span className='flex-1'>View on Explorer</span>
                                <ExternalLink className='h-4 w-4 opacity-50' />
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={handleNetworkSwitch}
                                disabled={isOnCorrectNetwork}
                                className={cn(
                                    'cursor-pointer px-2 py-1.5',
                                    !isOnCorrectNetwork && 'hover:bg-red-50 focus:bg-red-50',
                                )}>
                                <div className='w-full'>
                                    <div className='flex items-center gap-2'>
                                        <p className='text-muted-foreground text-xs'>Network</p>
                                        {!isOnCorrectNetwork && <AlertCircle className='text-destructive h-3 w-3' />}
                                    </div>
                                    <p
                                        className={cn(
                                            'text-sm',
                                            isOnCorrectNetwork ? 'text-foreground' : 'text-destructive',
                                        )}>
                                        {networkName}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                            {!isMiniPay && (
                                <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={disconnectWallet}
                                        className='cursor-pointer gap-2 text-sm text-red-500 focus:bg-red-50 focus:text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600'>
                                        <span className='flex-1'>Disconnect</span>
                                        <LogOut className='h-4 w-4 opacity-50' />
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    )}
                </DropdownMenu>
                <div className='w-2' /> {/* 8px spacing for future icons */}
            </div>
        </nav>
    )
}
