import { create } from 'zustand'
import type { User, Appointment, Doctor, Patient } from '../types'

interface AppState {
    // Auth
    user: User | null
    setUser: (user: User | null) => void

    // Appointments
    appointments: Appointment[]
    setAppointments: (appointments: Appointment[]) => void
    addAppointment: (appointment: Appointment) => void
    updateAppointment: (id: string, appointment: Partial<Appointment>) => void
    cancelAppointment: (id: string) => void

    // Doctors
    doctors: Doctor[]
    setDoctors: (doctors: Doctor[]) => void

    // Patients
    patients: Patient[]
    setPatients: (patients: Patient[]) => void
}

export const useStore = create<AppState>()((set) => ({
    // Auth
    user: null,
    setUser: (user: User | null) => set({ user }),

    // Appointments
    appointments: [],
    setAppointments: (appointments: Appointment[]) => set({ appointments }),
    addAppointment: (appointment: Appointment) =>
        set((state) => ({
            appointments: [...state.appointments, appointment],
        })),
    updateAppointment: (id: string, updatedAppointment: Partial<Appointment>) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, ...updatedAppointment } : apt
            ),
        })),
    cancelAppointment: (id: string) =>
        set((state) => ({
            appointments: state.appointments.map((apt) =>
                apt.id === id ? { ...apt, status: 'CANCELLED' as const } : apt
            ),
        })),

    // Doctors
    doctors: [],
    setDoctors: (doctors: Doctor[]) => set({ doctors }),

    // Patients
    patients: [],
    setPatients: (patients: Patient[]) => set({ patients }),
}))
