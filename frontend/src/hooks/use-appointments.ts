import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsService } from '@/services/appointments.service'
import { UpdateAppointmentRequest } from '@/types'

export const useAppointments = () => {
    return useQuery({
        queryKey: ['appointments'],
        queryFn: appointmentsService.getAppointments,
    })
}

export const useAppointment = (id: string) => {
    return useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentsService.getAppointment(id),
        enabled: !!id,
    })
}

export const useCreateAppointment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: appointmentsService.createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            queryClient.invalidateQueries({ queryKey: ['appointment-stats'] })
            queryClient.invalidateQueries({ queryKey: ['today-appointments'] })
            queryClient.invalidateQueries({
                queryKey: ['upcoming-appointments'],
            })
        },
    })
}

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: UpdateAppointmentRequest
        }) => appointmentsService.updateAppointment(id, data),
        onSuccess: (updatedAppointment) => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            queryClient.invalidateQueries({
                queryKey: ['appointment', updatedAppointment.id],
            })
            queryClient.invalidateQueries({ queryKey: ['appointments-today'] })
            queryClient.invalidateQueries({
                queryKey: ['appointments-upcoming'],
            })
            queryClient.invalidateQueries({ queryKey: ['appointments-stats'] })
        },
    })
}

export const useCancelAppointment = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => appointmentsService.cancelAppointment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] })
            queryClient.invalidateQueries({ queryKey: ['appointments-today'] })
            queryClient.invalidateQueries({
                queryKey: ['appointments-upcoming'],
            })
            queryClient.invalidateQueries({ queryKey: ['appointments-stats'] })
        },
    })
}

export const useAppointmentStats = () => {
    return useQuery({
        queryKey: ['appointments-stats'],
        queryFn: appointmentsService.getAppointmentStats,
    })
}

export const useTodayAppointments = () => {
    return useQuery({
        queryKey: ['appointments-today'],
        queryFn: appointmentsService.getTodayAppointments,
    })
}

export const useUpcomingAppointments = () => {
    return useQuery({
        queryKey: ['appointments-upcoming'],
        queryFn: appointmentsService.getUpcomingAppointments,
    })
}

export const useAppointmentHistory = () => {
    return useQuery({
        queryKey: ['appointments-history'],
        queryFn: appointmentsService.getHistory,
    })
}
