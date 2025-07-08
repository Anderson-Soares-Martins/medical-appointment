import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { AuthResponse, User, Appointment } from '../types/api'

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
})

// Add token to requests if available
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const auth = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', {
            email,
            password,
        })
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
    },

    register: async (userData: {
        email: string
        password: string
        name: string
        role: 'PATIENT' | 'DOCTOR'
        specialty?: string
    }): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(
            '/auth/register',
            userData
        )
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        return response.data
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },
}

export const appointments = {
    getAll: async (): Promise<Appointment[]> => {
        const response = await api.get<Appointment[]>('/appointments')
        return response.data
    },

    create: async (data: {
        doctorId: string
        date: string
    }): Promise<Appointment> => {
        const response = await api.post<Appointment>('/appointments', data)
        return response.data
    },

    update: async (
        id: string,
        data: { status: string; notes?: string }
    ): Promise<Appointment> => {
        const response = await api.patch<Appointment>(
            `/appointments/${id}`,
            data
        )
        return response.data
    },

    cancel: async (id: string): Promise<void> => {
        await api.delete(`/appointments/${id}`)
    },
}

export const users = {
    getDoctors: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users/doctors')
        return response.data
    },

    getProfile: async (): Promise<User> => {
        const response = await api.get<User>('/users/profile')
        return response.data
    },

    updateProfile: async (data: {
        name: string
        specialty?: string
    }): Promise<User> => {
        const response = await api.patch<User>('/users/profile', data)
        return response.data
    },
}
