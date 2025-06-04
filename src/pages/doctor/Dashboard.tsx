import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, ClipboardList } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { appointmentsApi } from '@/lib/services/api'
import { AppointmentCard } from '@/components/ui/AppointmentCard'
import type { Appointment } from '@/lib/types'

export default function DoctorDashboard() {
    const navigate = useNavigate()
    const { user, appointments, setAppointments } = useStore()
    const [isLoading, setIsLoading] = useState(false)

    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true)
            try {
                const data = await appointmentsApi.getAll()
                setAppointments(data)
            } catch (error) {
                console.error('Failed to fetch appointments:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAppointments()
    }, [setAppointments])

    const todayAppointments = appointments.filter(
        (apt) =>
            apt.date === new Date().toISOString().split('T')[0] &&
            apt.status === 'SCHEDULED'
    )

    const upcomingAppointments = appointments.filter(
        (apt) =>
            apt.date > new Date().toISOString().split('T')[0] &&
            apt.status === 'SCHEDULED'
    )

    const handleAppointmentComplete = async (appointment: Appointment) => {
        try {
            await appointmentsApi.update(appointment.id, {
                status: 'COMPLETED',
            })
            setAppointments(
                appointments.map((apt) =>
                    apt.id === appointment.id
                        ? { ...apt, status: 'COMPLETED' as const }
                        : apt
                )
            )
        } catch (error) {
            console.error('Failed to complete appointment:', error)
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {currentDate}
                </h2>
                <p className="text-gray-600">
                    Bem-vindo(a), Dr(a). {user?.name}
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div
                    onClick={() => navigate('/doctor/schedule')}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-indigo-500"
                >
                    <div className="flex items-center text-indigo-500 mb-2">
                        <Calendar size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">
                            Gerenciar Agenda
                        </h3>
                    </div>
                    <p className="text-gray-600">
                        Gerencie suas consultas e disponibilidade.
                    </p>
                </div>

                <div
                    onClick={() => navigate('/doctor/history')}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500"
                >
                    <div className="flex items-center text-green-500 mb-2">
                        <ClipboardList size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">
                            Histórico de Pacientes
                        </h3>
                    </div>
                    <p className="text-gray-600">
                        Acesse o histórico completo de atendimentos.
                    </p>
                </div>

                <div
                    onClick={() => navigate('/doctor/profile')}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500"
                >
                    <div className="flex items-center text-purple-500 mb-2">
                        <User size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">Editar Perfil</h3>
                    </div>
                    <p className="text-gray-600">
                        Atualize suas informações e especialidades.
                    </p>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Consultas de Hoje
                    </h3>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {todayAppointments.length} Consultas
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : todayAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                            <div
                                key={appointment.id}
                                className="flex p-4 border rounded-lg hover:bg-gray-50"
                            >
                                <div className="flex-shrink-0 mr-4">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-semibold">
                                        {appointment.time.split(':')[0]}h
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-medium text-gray-800">
                                        {appointment.type}
                                    </h4>
                                    <div className="mt-1 flex items-center">
                                        <Clock
                                            size={14}
                                            className="text-gray-400 mr-1"
                                        />
                                        <span className="text-sm text-gray-500">
                                            {appointment.time}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <button
                                        onClick={() =>
                                            handleAppointmentComplete(
                                                appointment
                                            )
                                        }
                                        className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
                                    >
                                        Concluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-gray-500">
                        Não há consultas agendadas para hoje.
                    </p>
                )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Próximas Consultas
                    </h3>
                    <button
                        onClick={() => navigate('/doctor/schedule')}
                        className="text-indigo-600 text-sm font-medium"
                    >
                        Ver todas
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingAppointments.slice(0, 3).map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                showActions={false}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-gray-500">
                        Não há consultas futuras agendadas.
                    </p>
                )}
            </div>
        </div>
    )
}
