'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'
import { AuthUser } from '@/types'
import { useAuth } from '@/providers/auth-provider'

export const usePatients = () => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery<AuthUser[]>({
        queryKey: ['patients'],
        queryFn: () => usersService.getPatients(),
        staleTime: 5 * 60 * 1000, // 5 minutos
        enabled: isAuthenticated && !loading,
    })
}

export const usePatient = (id: string) => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery<AuthUser>({
        queryKey: ['patient', id],
        queryFn: () => usersService.getUser(id),
        enabled: !!id && isAuthenticated && !loading,
        staleTime: 5 * 60 * 1000,
    })
}
