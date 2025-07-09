'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser, LoginRequest, RegisterRequest } from '@/types'
import { authService } from '@/services/auth.service'
import {
    getCurrentUser,
    setAuthData,
    clearAuthData,
    getAuthToken,
} from '@/services/api'

interface AuthContextType {
    user: AuthUser | null
    loading: boolean
    login: (credentials: LoginRequest) => Promise<void>
    register: (userData: RegisterRequest) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = getAuthToken()
                const currentUser = getCurrentUser()

                if (token && currentUser) {
                    // Validar se o token ainda é válido fazendo uma chamada para o backend
                    try {
                        const validUser = await authService.getProfile()
                        setUser(validUser)
                    } catch (error) {
                        // Token inválido, limpar dados de autenticação
                        console.warn(
                            'Token inválido durante inicialização:',
                            error
                        )
                        clearAuthData()
                        setUser(null)
                    }
                } else {
                    // Não há token ou usuário armazenado
                    setUser(null)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                clearAuthData()
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = async (credentials: LoginRequest) => {
        try {
            const response = await authService.login(credentials)
            setAuthData(response)
            setUser(response.user)

            // Redirecionamento mais rápido após definir o estado
            router.push('/dashboard')
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const register = async (userData: RegisterRequest) => {
        try {
            const response = await authService.register(userData)
            setAuthData(response)
            setUser(response.user)

            // Redirecionamento mais rápido após definir o estado
            router.push('/dashboard')
        } catch (error) {
            console.error('Register error:', error)
            throw error
        }
    }

    const logout = async () => {
        try {
            await authService.logout()
        } catch (error) {
            console.error('Logout error:', error)
        } finally {
            clearAuthData()
            setUser(null)
            router.push('/login')
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
