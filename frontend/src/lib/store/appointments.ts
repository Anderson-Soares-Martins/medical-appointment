import { create } from 'zustand'
import type { Appointment } from '../types/api'
import { appointments } from '../services/api'

interface AppointmentsState {
    appointments: Appointment[]
    isLoading: boolean
    error: string | null
    fetchAppointments: () => Promise<void>
    createAppointment: (data: {
        doctorId: string
        date: string
    }) => Promise<void>
    updateAppointment: (
        id: string,
        data: { status: string; notes?: string }
    ) => Promise<void>
    cancelAppointment: (id: string) => Promise<void>
}

export const useAppointmentsStore = create<AppointmentsState>((set) => ({
    appointments: [],
    isLoading: false,
    error: null,

    fetchAppointments: async () => {
        try {
            set({ isLoading: true, error: null })
            const data = await appointments.getAll()
            set({ appointments: data, isLoading: false })
        } catch (error) {
            console.error('Error fetching appointments:', error)
            set({ error: 'Failed to fetch appointments', isLoading: false })
        }
    },

    createAppointment: async (data) => {
        try {
            set({ isLoading: true, error: null })
            const newAppointment = await appointments.create(data)
            set((state) => ({
                appointments: [...state.appointments, newAppointment],
                isLoading: false,
            }))
        } catch (error) {
            console.error('Error creating appointment:', error)
            set({ error: 'Failed to create appointment', isLoading: false })
            throw error
        }
    },

    updateAppointment: async (id, data) => {
        try {
            set({ isLoading: true, error: null })
            const updatedAppointment = await appointments.update(id, data)
            set((state) => ({
                appointments: state.appointments.map((apt) =>
                    apt.id === id ? updatedAppointment : apt
                ),
                isLoading: false,
            }))
        } catch (error) {
            console.error('Error updating appointment:', error)
            set({ error: 'Failed to update appointment', isLoading: false })
            throw error
        }
    },

    cancelAppointment: async (id) => {
        try {
            set({ isLoading: true, error: null })
            await appointments.cancel(id)
            set((state) => ({
                appointments: state.appointments.filter((apt) => apt.id !== id),
                isLoading: false,
            }))
        } catch (error) {
            console.error('Error cancelling appointment:', error)
            set({ error: 'Failed to cancel appointment', isLoading: false })
            throw error
        }
    },
}))
