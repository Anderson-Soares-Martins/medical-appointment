import api from './api'
import {
    Appointment,
    CreateAppointmentRequest,
    UpdateAppointmentRequest,
    AppointmentStats,
} from '@/types'

export const appointmentsService = {
    async getAppointments(): Promise<Appointment[]> {
        const response = await api.get<{
            appointments: Appointment[]
            pagination: {
                page: number
                limit: number
                total: number
                pages: number
            }
        }>('/appointments')

        // devolve só o array
        return response.data.appointments
    },

    async getAppointment(id: string): Promise<Appointment> {
        const response = await api.get<Appointment>(`/appointments/${id}`)
        return response.data
    },

    async createAppointment(
        data: CreateAppointmentRequest
    ): Promise<Appointment> {
        const response = await api.post<Appointment>('/appointments', data)
        return response.data
    },

    async updateAppointment(
        id: string,
        data: UpdateAppointmentRequest
    ): Promise<Appointment> {
        const response = await api.patch<Appointment>(
            `/appointments/${id}`,
            data
        )
        return response.data
    },

    async cancelAppointment(id: string): Promise<void> {
        await api.delete(`/appointments/${id}`)
    },

    async getAppointmentStats(): Promise<AppointmentStats> {
        const response = await api.get<AppointmentStats>('/appointments/stats')
        return response.data
    },

    async getTodayAppointments(): Promise<Appointment[]> {
        const response = await api.get<Appointment[]>('/appointments/today')
        return response.data
    },

    async getUpcomingAppointments(): Promise<Appointment[]> {
        const response = await api.get<Appointment[]>('/appointments/upcoming')
        return response.data
    },

    async getHistory(): Promise<Appointment[]> {
        const response = await api.get<Appointment[]>('/appointments/history')
        return response.data
    },
}
