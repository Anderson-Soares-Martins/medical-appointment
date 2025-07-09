import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'
import { useAuth } from '@/providers/auth-provider'

export const useDoctors = () => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['doctors'],
        queryFn: usersService.getDoctors,
        enabled: isAuthenticated && !loading,
    })
}

export const useDoctor = (id: string) => {
    const { isAuthenticated, loading } = useAuth()

    return useQuery({
        queryKey: ['doctor', id],
        queryFn: () => usersService.getDoctor(id),
        enabled: !!id && isAuthenticated && !loading,
    })
}

// Note: This hook might be used in public pages for appointment scheduling
// So it doesn't need authentication checks
export const useDoctorAvailability = (doctorId: string, date: string) => {
    return useQuery({
        queryKey: ['doctor-availability', doctorId, date],
        queryFn: () => usersService.getDoctorAvailability(doctorId, date),
        enabled: !!doctorId && !!date,
    })
}
