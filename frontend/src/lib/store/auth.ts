import { create } from 'zustand'
import type { User } from '../types/api'
import { auth } from '../services/api'

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (userData: {
        email: string
        password: string
        name: string
        role: 'PATIENT' | 'DOCTOR'
        specialty?: string
    }) => Promise<void>
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (email: string, password: string) => {
        try {
            const response = await auth.login(email, password)
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
            })
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    },

    register: async (userData) => {
        try {
            const response = await auth.register(userData)
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
            })
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    },

    logout: () => {
        auth.logout()
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        })
    },
}))
