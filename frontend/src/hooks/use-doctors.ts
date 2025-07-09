import { useQuery } from '@tanstack/react-query'
import { usersService } from '@/services/users.service'

export const useDoctors = () => {
    return useQuery({
        queryKey: ['doctors'],
        queryFn: usersService.getDoctors,
    })
}

export const useDoctor = (id: string) => {
    return useQuery({
        queryKey: ['doctor', id],
        queryFn: () => usersService.getDoctor(id),
        enabled: !!id,
    })
}

export const useSearchDoctors = (query: string) => {
    return useQuery({
        queryKey: ['doctors', 'search', query],
        queryFn: () => usersService.searchDoctors(query),
        enabled: !!query,
    })
}

export const useDoctorAvailability = (doctorId: string, date: string) => {
    return useQuery({
        queryKey: ['doctor-availability', doctorId, date],
        queryFn: () => usersService.getDoctorAvailability(doctorId, date),
        enabled: !!doctorId && !!date,
    })
}
