'use client'

import { Toaster } from '@/components/ui/sonner'

export function ToasterProvider() {
    return (
        <Toaster position="top-right" richColors closeButton duration={4000} />
    )
}
