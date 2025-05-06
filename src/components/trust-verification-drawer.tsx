"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Shield, Award, Building, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  projectName: string
  verificationDetails: VerificationDetail[]
}

export function TrustVerificationDrawer({
  isOpen,
  onClose,
  projectName,
  verificationDetails
}: TrustVerificationDrawerProps) {
  const getIcon = (type: VerificationDetail['type']) => {
    switch (type) {
      case 'authority':
        return <Building className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'audit':
        return <Shield className="h-5 w-5 text-amber-500" />;
      case 'certification':
        return <Award className="h-5 w-5 text-purple-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[60vh] bg-background rounded-t-2xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Project Verification</h2>
                <p className="text-sm text-muted-foreground">{projectName}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>

            {/* Verification Details */}
            <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 space-y-4">
              <div className="flex justify-center py-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5">
                  <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                  Verified Project
                </Badge>
              </div>
              
              {verificationDetails.map((detail) => (
                <Card key={detail.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {getIcon(detail.type)}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{detail.name}</h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {detail.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {detail.description}
                      </p>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t text-xs text-muted-foreground">
                        <span>
                          Verified on {detail.verifiedDate.toLocaleDateString()}
                        </span>
                        {detail.link && (
                          <a 
                            href={detail.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-primary hover:underline"
                          >
                            View proof <ExternalLink className="ml-1 h-3 w-3" />
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