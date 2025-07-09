import {
    format,
    formatDistanceToNow,
    isToday,
    isTomorrow,
    isYesterday,
    isValid,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const formatDate = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) return 'Data inválida'
    return format(dateObj, 'dd/MM/yyyy', { locale: ptBR })
}

export const formatTime = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) return 'Horário inválido'
    return format(dateObj, 'HH:mm', { locale: ptBR })
}

export const formatDateTime = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) return 'Data/Hora inválida'
    return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: ptBR })
}

export const formatDateTimeShort = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) return 'Data/Hora inválida'
    return format(dateObj, 'dd/MM HH:mm', { locale: ptBR })
}

export const formatRelativeTime = (date: string | Date): string => {
    const dateObj = new Date(date)

    // Validação para datas inválidas
    if (!isValid(dateObj) || isNaN(dateObj.getTime())) {
        return 'Data inválida'
    }

    try {
        if (isToday(dateObj)) {
            return `Hoje às ${formatTime(date)}`
        }

        if (isTomorrow(dateObj)) {
            return `Amanhã às ${formatTime(date)}`
        }

        if (isYesterday(dateObj)) {
            return `Ontem às ${formatTime(date)}`
        }

        return formatDistanceToNow(dateObj, {
            addSuffix: true,
            locale: ptBR,
        })
    } catch (error) {
        console.error('Erro ao formatar data relativa:', error)
        return 'Data inválida'
    }
}

export const formatDateForInput = (date: string | Date): string => {
    const dateObj = new Date(date)
    if (!isValid(dateObj)) return ''
    return format(dateObj, 'yyyy-MM-dd')
}

export const formatTimeForInput = (date: string | Date): string => {
    return format(new Date(date), 'HH:mm')
}

export const formatDateTimeForInput = (date: string | Date): string => {
    return format(new Date(date), "yyyy-MM-dd'T'HH:mm")
}

export const isDateInPast = (date: string | Date): boolean => {
    return new Date(date) < new Date()
}

export const isDateInFuture = (date: string | Date): boolean => {
    return new Date(date) > new Date()
}

export const addDays = (date: string | Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export const getTimeSlots = (
    startHour = 8,
    endHour = 18,
    intervalMinutes = 30
): string[] => {
    const slots: string[] = []

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += intervalMinutes) {
            const time = format(
                new Date().setHours(hour, minute, 0, 0),
                'HH:mm'
            )
            slots.push(time)
        }
    }

    return slots
}
