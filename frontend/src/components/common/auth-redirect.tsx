'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'

interface AuthRedirectProps {
    children: React.ReactNode
    requireAuth?: boolean // true = precisa estar logado, false = não pode estar logado
}

export default function AuthRedirect({
    children,
    requireAuth = true,
}: AuthRedirectProps) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return // Aguardar verificação de autenticação

        if (requireAuth && !isAuthenticated) {
            // Precisa estar logado mas não está
            router.push('/login')
            return
        }

        if (!requireAuth && isAuthenticated) {
            // Não pode estar logado mas está
            router.push('/dashboard')
            return
        }
    }, [isAuthenticated, loading, requireAuth, router])

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Verificar se deve renderizar conteúdo
    if (requireAuth && !isAuthenticated) {
        return null // Não renderizar se precisa estar logado mas não está
    }

    if (!requireAuth && isAuthenticated) {
        return null // Não renderizar se não pode estar logado mas está
    }

    return <>{children}</>
}
