// User Types
export interface User {
    id: string
    name: string
    email: string
    role: 'PATIENT' | 'DOCTOR'
    specialty?: string
    crm?: string
}

// Appointment Types
export interface Appointment {
    id: string
    patientId: string
    doctorId: string
    date: string
    time: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
    type: string
    notes?: string
    diagnosis?: string
    prescription?: string
}

// Doctor Types
export interface Doctor {
    id: string
    name: string
    specialty: string
    crm: string
    rating: number
    availableSlots?: TimeSlot[]
}

// Patient Types
export interface Patient {
    id: string
    name: string
    email: string
    phone: string
    dateOfBirth: string
    medicalHistory?: MedicalRecord[]
}

// Medical Record Types
export interface MedicalRecord {
    id: string
    patientId: string
    doctorId: string
    date: string
    diagnosis: string
    prescription: string
    notes: string
}

// Time Slot Types
export interface TimeSlot {
    id: string
    doctorId: string
    date: string
    startTime: string
    endTime: string
    isAvailable: boolean
}
