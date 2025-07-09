import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsService } from '@/services/appointments.service'
import { UpdateAppointmentRequest } from '@/types'
import { useAuth } from '@/providers/auth-provider'

export const useAppointments = () => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['appointments'],
        queryFn: appointmentsService.getAppointments,
        enabled: isAuthenticated && !loading,
    })
}

export const useAppointment = (id: string) => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['appointment', id],
        queryFn: () => appointmentsService.getAppointment(id),
        enabled: !!id && isAuthenticated && !loading,
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
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['appointments-stats'],
        queryFn: appointmentsService.getAppointmentStats,
        enabled: isAuthenticated && !loading,
    })
}

export const useTodayAppointments = () => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['appointments-today'],
        queryFn: appointmentsService.getTodayAppointments,
        enabled: isAuthenticated && !loading,
    })
}

export const useUpcomingAppointments = () => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['appointments-upcoming'],
        queryFn: appointmentsService.getUpcomingAppointments,
        enabled: isAuthenticated && !loading,
    })
}

export const useAppointmentHistory = () => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['appointments-history'],
        queryFn: appointmentsService.getHistory,
        enabled: isAuthenticated && !loading,
    })
}
