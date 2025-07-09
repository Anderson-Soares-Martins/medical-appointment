'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'

interface ProtectedRouteProps {
    children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, loading, router])

    // Mostrar loading enquanto verifica autenticação
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Se não estiver autenticado, não renderizar nada (redirecionamento já foi feito)
    if (!isAuthenticated) {
        return null
    }

    // Se estiver autenticado, renderizar o conteúdo
    return <>{children}</>
}
