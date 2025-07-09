import axios, {
    type AxiosInstance,
    type AxiosResponse,
    type AxiosError,
    type InternalAxiosRequestConfig,
} from 'axios'
import { AuthResponse, AuthUser } from '@/types'

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

/** ----------------------------------------------------------------
 *  Axios instance
 *  --------------------------------------------------------------*/
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

/** ----------------------------------------------------------------
 *  Request interceptor → insere o token de acesso (se existir)
 *  --------------------------------------------------------------*/
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = getAuthToken()
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error: AxiosError): Promise<never> => Promise.reject(error)
)

/** ----------------------------------------------------------------
 *  Response interceptor → trata erros de autenticação
 *  --------------------------------------------------------------*/
api.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    (error: AxiosError): Promise<never> => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            clearAuthData()
            // Redirecionamento fica a cargo de um hook (ex.: useAuth)
        }
        return Promise.reject(error)
    }
)

/** ----------------------------------------------------------------
 *  Helpers de autenticação
 *  --------------------------------------------------------------*/

// Função para definir cookies
const setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof window !== 'undefined') {
        const expires = new Date(Date.now() + days * 864e5).toUTCString()
        document.cookie = `${name}=${encodeURIComponent(
            value
        )}; expires=${expires}; path=/; SameSite=Strict`
    }
}

// Função para obter cookies
const getCookie = (name: string): string | null => {
    if (typeof window === 'undefined') return null

    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
        return decodeURIComponent(parts.pop()?.split(';').shift() || '')
    }
    return null
}

// Função para remover cookies
const removeCookie = (name: string) => {
    if (typeof window !== 'undefined') {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
}

export const getAuthToken = (): string | null => {
    // Primeiro tenta obter do localStorage (compatibilidade)
    const localToken =
        typeof window === 'undefined' ? null : localStorage.getItem('token')
    if (localToken) return localToken

    // Depois tenta obter dos cookies
    return getCookie('token')
}

export const setAuthToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token)
        setCookie('token', token, 7) // 7 dias
    }
}

export const getRefreshToken = (): string | null => {
    // Primeiro tenta obter do localStorage
    const localToken =
        typeof window === 'undefined'
            ? null
            : localStorage.getItem('refreshToken')
    if (localToken) return localToken

    // Depois tenta obter dos cookies
    return getCookie('refreshToken')
}

export const setRefreshToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('refreshToken', token)
        setCookie('refreshToken', token, 30) // 30 dias
    }
}

export const getCurrentUser = (): AuthUser | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? (JSON.parse(userStr) as AuthUser) : null
}

export const setCurrentUser = (user: AuthUser): void => {
    if (typeof window !== 'undefined')
        localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuthData = (): void => {
    if (typeof window === 'undefined') return

    // Limpar localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')

    // Limpar cookies
    removeCookie('token')
    removeCookie('refreshToken')
}

export const setAuthData = (authResponse: AuthResponse): void => {
    setAuthToken(authResponse.token)
    setRefreshToken(authResponse.refreshToken)
    setCurrentUser(authResponse.user)
}

export default api
