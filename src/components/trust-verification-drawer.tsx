'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Building, CheckCircle, ExternalLink, Shield } from 'lucide-react'

export interface VerificationDetail {
    id: string
    name: string
    type: 'authority' | 'document' | 'audit' | 'certification'
    description: string
    verifiedDate: Date
    link?: string
}

interface TrustVerificationDrawerProps {
    isOpen: boolean
    onClose: () => void
    campaignName: string
    verificationDetails: VerificationDetail[]
}

export function TrustVerificationDrawer({
    isOpen,
    onClose,
    campaignName,
    verificationDetails,
}: TrustVerificationDrawerProps) {
    const getIcon = (type: VerificationDetail['type']) => {
        switch (type) {
            case 'authority':
                return <Building className='h-5 w-5 text-blue-500' />
            case 'document':
                return <CheckCircle className='h-5 w-5 text-green-500' />
            case 'audit':
                return <Shield className='h-5 w-5 text-amber-500' />
            case 'certification':
                return <Award className='h-5 w-5 text-purple-500' />
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 z-40 bg-black/50'
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className='bg-background fixed right-0 bottom-0 left-0 z-50 h-[60vh] overflow-hidden rounded-t-2xl shadow-lg'>
                        {/* Header */}
                        <div className='bg-background sticky top-0 flex items-center justify-between border-b px-4 py-3'>
                            <div>
                                <h2 className='text-lg font-semibold'>Campaign Verification</h2>
                                <p className='text-muted-foreground text-sm'>{campaignName}</p>
                            </div>
                            <Button variant='ghost' size='sm' onClick={onClose}>
                                Close
                            </Button>
                        </div>

                        {/* Verification Details */}
                        <div className='h-[calc(100%-4rem)] space-y-4 overflow-y-auto p-4'>
                            <div className='flex justify-center py-2'>
                                <Badge
                                    variant='outline'
                                    className='border-blue-200 bg-blue-50 px-3 py-1.5 text-blue-700'>
                                    <CheckCircle className='mr-2 h-4 w-4 text-blue-500' />
                                    Verified Campaign
                                </Badge>
                            </div>

                            {verificationDetails.map(detail => (
                                <Card key={detail.id} className='p-4'>
                                    <div className='flex items-start gap-3'>
                                        {getIcon(detail.type)}
                                        <div className='flex-1'>
                                            <div className='flex items-start justify-between'>
                                                <h3 className='font-semibold'>{detail.name}</h3>
                                                <Badge variant='outline' className='text-xs capitalize'>
                                                    {detail.type}
                                                </Badge>
                                            </div>
                                            <p className='text-muted-foreground mt-1 text-sm'>{detail.description}</p>
                                            <div className='text-muted-foreground mt-3 flex items-center justify-between border-t pt-2 text-xs'>
                                                <span>Verified on {detail.verifiedDate.toLocaleDateString()}</span>
                                                {detail.link && (
                                                    <a
                                                        href={detail.link}
                                                        target='_blank'
                                                        rel='noopener noreferrer'
                                                        className='text-primary inline-flex items-center hover:underline'>
                                                        View proof <ExternalLink className='ml-1 h-3 w-3' />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
