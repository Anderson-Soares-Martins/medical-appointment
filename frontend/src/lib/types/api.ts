export interface User {
    id: string
    email: string
    name: string
    role: 'PATIENT' | 'DOCTOR'
    specialty?: string
}

export interface AuthResponse {
    token: string
    user: User
}

export interface Appointment {
    id: string
    date: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
    notes?: string
    patient: {
        id: string
        name: string
        email: string
    }
    doctor: {
        id: string
        name: string
        specialty: string
    }
}

export interface ApiError {
    error: string
}
