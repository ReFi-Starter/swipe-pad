'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useDonationPool } from '@/hooks/use-donation-pool'
import { useWallet } from '@/hooks/use-wallet'
import { useState } from 'react'
import { toast } from 'sonner'

// Mock token address for CELO
const CELO_TOKEN_ADDRESS = '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9'

export function CreateDonationProject() {
    const { createCampaign, isPending, isConfirmed } = useDonationPool()
    const { isConnected, isOnCorrectNetwork } = useWallet()

    const [formState, setFormState] = useState({
        projectName: '',
        projectDescription: '',
        projectUrl: '',
        imageUrl: '',
        fundingGoal: '',
        fundingModel: '0', // Default to ALL_OR_NOTHING
    })

    const [submitting, setSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormState(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (value: string) => {
        setFormState(prev => ({ ...prev, fundingModel: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!isConnected) {
            toast.error('Please connect your wallet first')
            return
        }

        if (!isOnCorrectNetwork) {
            toast.error('Please switch to Celo Alfajores network')
            return
        }

        try {
            setSubmitting(true)

            await createCampaign(
                formState.projectName,
                formState.projectDescription,
                formState.projectUrl,
                formState.imageUrl,
                formState.fundingGoal,
                parseInt(formState.fundingModel) as 0 | 1,
                CELO_TOKEN_ADDRESS as `0x${string}`,
            )

            toast.success('Project creation initiated. Please wait for confirmation.')
        } catch (error) {
            console.error('Failed to create project:', error)
            toast.error('Failed to create project. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='mx-auto w-full max-w-2xl rounded-lg bg-white p-6 shadow-md'>
            <h2 className='mb-6 text-2xl font-bold'>Create Donation Project</h2>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='space-y-2'>
                    <Label htmlFor='projectName'>Project Name</Label>
                    <Input
                        id='projectName'
                        name='projectName'
                        value={formState.projectName}
                        onChange={handleChange}
                        placeholder='Enter project name'
                        required
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='projectDescription'>Project Description</Label>
                    <Textarea
                        id='projectDescription'
                        name='projectDescription'
                        value={formState.projectDescription}
                        onChange={handleChange}
                        placeholder='Describe your project'
                        rows={4}
                        required
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='projectUrl'>Project URL</Label>
                    <Input
                        id='projectUrl'
                        name='projectUrl'
                        value={formState.projectUrl}
                        onChange={handleChange}
                        placeholder='https://your-project-website.com'
                        type='url'
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='imageUrl'>Image URL</Label>
                    <Input
                        id='imageUrl'
                        name='imageUrl'
                        value={formState.imageUrl}
                        onChange={handleChange}
                        placeholder='https://example.com/your-image.jpg'
                        type='url'
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='fundingGoal'>Funding Goal (CELO)</Label>
                    <Input
                        id='fundingGoal'
                        name='fundingGoal'
                        value={formState.fundingGoal}
                        onChange={handleChange}
                        placeholder='1.0'
                        type='number'
                        step='0.01'
                        min='0.01'
                        required
                    />
                </div>

                <div className='space-y-2'>
                    <Label htmlFor='fundingModel'>Funding Model</Label>
                    <Select value={formState.fundingModel} onValueChange={handleSelectChange}>
                        <SelectTrigger id='fundingModel'>
                            <SelectValue placeholder='Select funding model' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='0'>All or Nothing</SelectItem>
                            <SelectItem value='1'>Keep What You Raise</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className='mt-1 text-sm text-gray-500'>
                        {formState.fundingModel === '0'
                            ? 'All or Nothing: Funds are only released if the goal is met'
                            : 'Keep What You Raise: All funds are released regardless of reaching the goal'}
                    </p>
                </div>

                <Button
                    type='submit'
                    className='w-full'
                    disabled={!isConnected || !isOnCorrectNetwork || submitting || isPending}>
                    {submitting || isPending ? 'Processing...' : 'Create Project'}
                </Button>

                {!isConnected && (
                    <p className='text-center text-sm text-red-500'>Please connect your wallet to create a project</p>
                )}

                {isConnected && !isOnCorrectNetwork && (
                    <p className='text-center text-sm text-red-500'>Please switch to Celo Alfajores network</p>
                )}

                {isConfirmed && <p className='text-center text-sm text-green-500'>Project created successfully!</p>}
            </form>
        </div>
    )
}
