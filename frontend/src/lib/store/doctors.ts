import { create } from 'zustand'
import type { User } from '../types/api'
import { users } from '../services/api'

interface DoctorsState {
    doctors: User[]
    isLoading: boolean
    error: string | null
    fetchDoctors: () => Promise<void>
}

export const useDoctorsStore = create<DoctorsState>((set) => ({
    doctors: [],
    isLoading: false,
    error: null,

    fetchDoctors: async () => {
        try {
            set({ isLoading: true, error: null })
            const data = await users.getDoctors()
            set({ doctors: data, isLoading: false })
        } catch (error) {
            console.error('Error fetching doctors:', error)
            set({ error: 'Failed to fetch doctors', isLoading: false })
        }
    },
}))
