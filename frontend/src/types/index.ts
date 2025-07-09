export type UserRole = 'PATIENT' | 'DOCTOR'

export type AppointmentStatus =
    | 'SCHEDULED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'NO_SHOW'

export interface User {
    id: string
    email: string
    name: string
    role: UserRole
    specialty?: string
    createdAt: string
    updatedAt: string
}

export interface Appointment {
    id: string
    date: string
    status: AppointmentStatus
    notes?: string
    patientId: string
    doctorId: string
    createdAt: string
    updatedAt: string
    patient?: User
    doctor?: User
}

export interface AuthUser {
    id: string
    email: string
    name: string
    role: UserRole
    specialty?: string
}

export interface AuthResponse {
    message: string
    user: AuthUser
    token: string
    refreshToken: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    email: string
    password: string
    name: string
    role: UserRole
    specialty?: string
}

export interface CreateAppointmentRequest {
    doctorId: string
    date: string
}

export interface UpdateAppointmentRequest {
    status?: AppointmentStatus
    notes?: string
}

export interface Doctor {
    id: string
    name: string
    specialty: string
    email: string
}

export interface ApiError {
    error: string
}

export interface AppointmentStats {
    total: number
    scheduled: number
    completed: number
    cancelled: number
    noShow: number
}

export interface UserStats {
    appointments: AppointmentStats
    todayAppointments: number
    upcomingAppointments: number
}
