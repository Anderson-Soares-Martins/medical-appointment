import api from './api'
import { AuthResponse, LoginRequest, RegisterRequest, AuthUser } from '@/types'

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(
            '/auth/login',
            credentials
        )
        return response.data
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(
            '/auth/register',
            userData
        )
        return response.data
    },

    async refreshToken(): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/refresh-token')
        return response.data
    },

    async getProfile(): Promise<AuthUser> {
        const response = await api.get<AuthUser>('/auth/profile')
        return response.data
    },

    async updateProfile(userData: Partial<AuthUser>): Promise<AuthUser> {
        const response = await api.put<AuthUser>('/auth/profile', userData)
        return response.data
    },

    changePassword: async (data: {
        currentPassword: string
        newPassword: string
    }): Promise<void> => {
        await api.put('/auth/change-password', data)
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
    },
}
