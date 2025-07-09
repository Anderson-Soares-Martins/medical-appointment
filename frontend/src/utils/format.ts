import { AppointmentStatus, UserRole } from '@/types'

export const formatAppointmentStatus = (status: AppointmentStatus): string => {
    const statusMap = {
        SCHEDULED: 'Agendada',
        COMPLETED: 'Concluída',
        CANCELLED: 'Cancelada',
        NO_SHOW: 'Faltou',
    }

    return statusMap[status] || status
}

export const formatUserRole = (role: UserRole): string => {
    const roleMap = {
        PATIENT: 'Paciente',
        DOCTOR: 'Médico',
    }

    return roleMap[role] || role
}

export const getStatusColor = (status: AppointmentStatus): string => {
    const colorMap = {
        SCHEDULED: 'bg-blue-100 text-blue-800',
        COMPLETED: 'bg-green-100 text-green-800',
        CANCELLED: 'bg-red-100 text-red-800',
        NO_SHOW: 'bg-gray-100 text-gray-800',
    }

    return colorMap[status] || 'bg-gray-100 text-gray-800'
}

export const formatName = (name: string): string => {
    return name
        .split(' ')
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ')
}

export const formatInitials = (name: string): string => {
    return name
        .split(' ')
        .map((word) => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
}

export const formatSpecialty = (specialty: string): string => {
    return specialty.charAt(0).toUpperCase() + specialty.slice(1).toLowerCase()
}

export const formatPlaceholder = (text: string, maxLength = 100): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
}

export const formatCPF = (cpf: string): string => {
    const cleaned = cpf.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
    if (match) {
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return cpf
}

export const formatPhone = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return phone
}

export const formatEmail = (email: string): string => {
    return email.toLowerCase().trim()
}
