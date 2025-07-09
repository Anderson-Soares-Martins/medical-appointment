'use client'

import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'
import { AuthUser } from '@/types'

export const usePatients = () => {
    return useQuery<AuthUser[]>({
        queryKey: ['patients'],
        queryFn: () => usersService.getPatients(),
        staleTime: 5 * 60 * 1000, // 5 minutos
    })
}

export const usePatient = (id: string) => {
    return useQuery<AuthUser>({
        queryKey: ['patient', id],
        queryFn: () => usersService.getUser(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    })
}
