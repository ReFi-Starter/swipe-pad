'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/providers/trpc-provider'
import { useState } from 'react'

interface UserProfileDisplayProps {
    walletAddress: string
}

export function UserProfileDisplay({ walletAddress }: UserProfileDisplayProps) {
    const { data: user, isLoading, error } = trpc.user.byWalletAddress.useQuery(walletAddress)
    const utils = trpc.useContext()

    const createUser = trpc.user.create.useMutation({
        onSuccess: () => {
            utils.user.byWalletAddress.invalidate(walletAddress)
        },
    })

    const [username, setUsername] = useState('')

    const handleCreateUser = () => {
        createUser.mutate({
            walletAddress,
            username: username || 'Anonymous User',
        })
    }

    if (isLoading) {
        return <div className='flex items-center justify-center p-4'>Loading user data...</div>
    }

    if (error) {
        return <div className='p-4 text-red-500'>Error loading user: {error.message}</div>
    }

    return (
        <div className='rounded-lg border p-4 shadow-sm'>
            {user ? (
                <div className='space-y-2'>
                    <h2 className='text-xl font-bold'>{user.username || 'Anonymous User'}</h2>
                    <p className='text-gray-700'>Wallet: {user.walletAddress}</p>
                    <div className='flex items-center gap-2'>
                        <span>Reputation: {user.reputation}</span>
                        <span className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-800'>{user.level}</span>
                    </div>
                    <p>Streak: {user.streak} days</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    <p className='text-amber-600'>No user profile found for this wallet</p>
                    <div className='flex flex-col space-y-2'>
                        <input
                            type='text'
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder='Username (optional)'
                            className='rounded border px-3 py-2'
                        />
                        <Button onClick={handleCreateUser} disabled={createUser.isPending}>
                            {createUser.isPending ? 'Creating...' : 'Create Profile'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
