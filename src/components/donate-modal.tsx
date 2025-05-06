import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { formatCurrency } from '@/features/currencies/formatter'
import { getUserSettings } from '@/features/settings/user-settings'
import { useEffect, useState } from 'react'

interface DonateModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    amount: number
}

export function DonateModal({ isOpen, onClose, onConfirm, amount }: DonateModalProps) {
    const [userSettings, setUserSettings] = useState({ currency: 'CENTS', language: 'en', region: 'US' })

    useEffect(() => {
        // Cargar configuración del usuario
        setUserSettings(getUserSettings())
    }, [])

    if (!isOpen) return null

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <Card className='bento-bevel w-full max-w-sm'>
                <CardContent className='pt-6'>
                    <h2 className='mb-2 text-center text-xl font-semibold'>
                        Confirm {formatCurrency(amount || 0.01, userSettings.currency)} donation?
                    </h2>
                    <p className='text-center text-blue-500'>+5 pts earned</p>
                </CardContent>
                <CardFooter className='flex justify-between gap-4'>
                    <Button variant='secondary' className='flex-1' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className='flex-1' onClick={onConfirm}>
                        Confirm
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
