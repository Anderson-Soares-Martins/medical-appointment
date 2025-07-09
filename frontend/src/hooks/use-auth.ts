'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import { usersService } from '@/services/users.service'
import { setCurrentUser } from '@/services/api'
import { AuthUser } from '@/types'

export const useLogin = () => {
    return useMutation({
        mutationFn: authService.login,
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: authService.register,
    })
}

export const useLogout = () => {
    return useMutation({
        mutationFn: authService.logout,
    })
}

export const useChangePassword = () => {
    return useMutation({
        mutationFn: authService.changePassword,
    })
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: usersService.updateProfile,
        onSuccess: (updatedUser: AuthUser) => {
            // Atualizar cache do usuário
            queryClient.setQueryData(['auth', 'profile'], updatedUser)
            // Atualizar localStorage
            setCurrentUser(updatedUser)
        },
    })
}
