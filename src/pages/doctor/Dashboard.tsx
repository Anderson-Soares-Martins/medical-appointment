import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, User, ClipboardList } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'
import { useAppointmentsStore } from '@/lib/store/appointments'
import { AppointmentCard } from '@/components/ui/AppointmentCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DoctorDashboard() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const { appointments, fetchAppointments, isLoading } =
        useAppointmentsStore()

    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const todayAppointments = appointments.filter(
        (apt) =>
            new Date(apt.date).toDateString() === new Date().toDateString() &&
            apt.status === 'SCHEDULED'
    )

    const upcomingAppointments = appointments.filter(
        (apt) => new Date(apt.date) > new Date() && apt.status === 'SCHEDULED'
    )

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
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-indigo-500">
                    <Button
                        variant="ghost"
                        className="h-auto p-6 w-full justify-start"
                        onClick={() => navigate('/doctor/schedule')}
                    >
                        <div>
                            <div className="flex items-center text-indigo-500 mb-2">
                                <Calendar size={24} className="mr-2" />
                                <h3 className="text-lg font-semibold">
                                    Gerenciar Agenda
                                </h3>
                            </div>
                            <p className="text-gray-600 text-left">
                                Gerencie suas consultas e disponibilidade.
                            </p>
                        </div>
                    </Button>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                    <Button
                        variant="ghost"
                        className="h-auto p-6 w-full justify-start"
                        onClick={() => navigate('/doctor/history')}
                    >
                        <div>
                            <div className="flex items-center text-green-500 mb-2">
                                <ClipboardList size={24} className="mr-2" />
                                <h3 className="text-lg font-semibold">
                                    Histórico de Pacientes
                                </h3>
                            </div>
                            <p className="text-gray-600 text-left">
                                Acesse o histórico completo de atendimentos.
                            </p>
                        </div>
                    </Button>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
                    <Button
                        variant="ghost"
                        className="h-auto p-6 w-full justify-start"
                        onClick={() => navigate('/doctor/profile')}
                    >
                        <div>
                            <div className="flex items-center text-purple-500 mb-2">
                                <User size={24} className="mr-2" />
                                <h3 className="text-lg font-semibold">
                                    Editar Perfil
                                </h3>
                            </div>
                            <p className="text-gray-600 text-left">
                                Atualize suas informações e especialidades.
                            </p>
                        </div>
                    </Button>
                </Card>
            </div>

            {/* Today's Appointments */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Consultas de Hoje</CardTitle>
                        <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            {todayAppointments.length} Consultas
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : todayAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {todayAppointments.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    showActions={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            Não há consultas agendadas para hoje.
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="mt-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Próximas Consultas</CardTitle>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/doctor/schedule')}
                            className="text-indigo-600 text-sm font-medium"
                        >
                            Ver todas
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">Carregando...</div>
                    ) : upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
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
                </CardContent>
            </Card>
        </div>
    )
}
