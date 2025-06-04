import type { User, Appointment, Doctor, Patient } from '../types'
import { mockAuthApi } from './mockApi'

// In a real application, this would be an environment variable
const API_BASE_URL = '/api'

// Helper function for making API requests
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
}

// Auth API
export const authApi = {
    login: async (
        email: string,
        password: string
    ): Promise<{ user: User; token: string }> => {
        // Use o mock da API em vez de fazer uma chamada real
        return mockAuthApi.login(email, password)
    },

    logout: async (): Promise<void> => {
        return fetchApi('/auth/logout', { method: 'POST' })
    },
}

// Appointments API
export const appointmentsApi = {
    getAll: async (): Promise<Appointment[]> => {
        return fetchApi('/appointments')
    },

    getById: async (id: string): Promise<Appointment> => {
        return fetchApi(`/appointments/${id}`)
    },

    create: async (
        appointment: Omit<Appointment, 'id'>
    ): Promise<Appointment> => {
        return fetchApi('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointment),
        })
    },

    update: async (
        id: string,
        appointment: Partial<Appointment>
    ): Promise<Appointment> => {
        return fetchApi(`/appointments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(appointment),
        })
    },

    cancel: async (id: string): Promise<Appointment> => {
        return fetchApi(`/appointments/${id}/cancel`, {
            method: 'POST',
        })
    },
}

// Doctors API
export const doctorsApi = {
    getAll: async (): Promise<Doctor[]> => {
        return fetchApi('/doctors')
    },

    getById: async (id: string): Promise<Doctor> => {
        return fetchApi(`/doctors/${id}`)
    },

    getAvailableSlots: async (
        doctorId: string,
        date: string
    ): Promise<string[]> => {
        return fetchApi(`/doctors/${doctorId}/available-slots?date=${date}`)
    },
}

// Patients API
export const patientsApi = {
    getAll: async (): Promise<Patient[]> => {
        return fetchApi('/patients')
    },

    getById: async (id: string): Promise<Patient> => {
        return fetchApi(`/patients/${id}`)
    },

    getMedicalHistory: async (patientId: string): Promise<Appointment[]> => {
        return fetchApi(`/patients/${patientId}/medical-history`)
    },
}
