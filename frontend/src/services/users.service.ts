import api from './api'
import { Doctor, UserStats, AuthUser } from '@/types'

export const usersService = {
    async getDoctors(): Promise<Doctor[]> {
        const response = await api.get<{
            doctors: Doctor[]
            count: number
        }>('/users/doctors')
        return response.data.doctors
    },

    async searchDoctors(query: string): Promise<Doctor[]> {
        const response = await api.get<Doctor[]>(
            `/users/doctors/search?q=${query}`
        )
        return response.data
    },

    async getDoctor(id: string): Promise<Doctor> {
        const response = await api.get<Doctor>(`/users/doctors/${id}`)
        return response.data
    },

    async getDoctorAvailability(id: string, date: string): Promise<string[]> {
        const response = await api.get<string[]>(
            `/users/doctors/${id}/availability?date=${date}`
        )
        return response.data
    },

    async getUserStats(): Promise<UserStats> {
        const response = await api.get<UserStats>('/users/stats')
        return response.data
    },

    getProfile: async (): Promise<AuthUser> => {
        const response = await api.get('/auth/profile')
        return response.data
    },

    updateProfile: async (data: Partial<AuthUser>): Promise<AuthUser> => {
        const response = await api.put('/auth/profile', data)
        return response.data
    },

    getPatients: async (): Promise<AuthUser[]> => {
        const response = await api.get('/users/patients')
        return response.data
    },

    getUser: async (id: string): Promise<AuthUser> => {
        const response = await api.get(`/users/${id}`)
        return response.data
    },
}
