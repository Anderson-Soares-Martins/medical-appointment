import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, ClipboardList, User } from 'lucide-react'
import { useStore } from '@/lib/store/useStore'
import { appointmentsApi } from '@/lib/services/api'
import { AppointmentCard } from '@/components/ui/AppointmentCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PatientDashboard() {
    const navigate = useNavigate()
    const { user, appointments, setAppointments } = useStore()
    const currentDate = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await appointmentsApi.getAll()
                setAppointments(data)
            } catch (error) {
                console.error('Failed to fetch appointments:', error)
            }
        }

        fetchAppointments()
    }, [setAppointments])

    const upcomingAppointments = appointments.filter(
        (apt) => apt.status === 'SCHEDULED'
    )

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    {currentDate}
                </h2>
                <p className="text-gray-600">Bem-vindo(a), {user?.name}</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-blue-500">
                    <Button
                        variant="ghost"
                        className="h-auto p-6 w-full justify-start"
                        onClick={() => navigate('/patient/appointments')}
                    >
                        <div>
                            <div className="flex items-center text-blue-500 mb-2">
                                <Calendar size={24} className="mr-2" />
                                <h3 className="text-lg font-semibold">
                                    Agendar Consulta
                                </h3>
                            </div>
                            <p className="text-gray-600 text-left">
                                Marque uma nova consulta com o especialista de
                                sua escolha.
                            </p>
                        </div>
                    </Button>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-green-500">
                    <Button
                        variant="ghost"
                        className="h-auto p-6 w-full justify-start"
                        onClick={() => navigate('/patient/appointments')}
                    >
                        <div>
                            <div className="flex items-center text-green-500 mb-2">
                                <ClipboardList size={24} className="mr-2" />
                                <h3 className="text-lg font-semibold">
                                    Minhas Consultas
                                </h3>
                            </div>
                            <p className="text-gray-600 text-left">
                                Gerencie suas consultas agendadas e
                                cancelamentos.
                            </p>
                        </div>
                    </Button>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-purple-500">
                    <Button
                        variant="ghost"
                        className="h-auto p-6 w-full justify-start"
                        onClick={() => navigate('/patient/history')}
                    >
                        <div>
                            <div className="flex items-center text-purple-500 mb-2">
                                <User size={24} className="mr-2" />
                                <h3 className="text-lg font-semibold">
                                    Histórico
                                </h3>
                            </div>
                            <p className="text-gray-600 text-left">
                                Visualize todo o seu histórico de consultas
                                anteriores.
                            </p>
                        </div>
                    </Button>
                </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
                <CardHeader>
                    <CardTitle>Próximas Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                    {upcomingAppointments.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingAppointments.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    onCancel={(id) => {
                                        // Handle cancellation
                                        appointmentsApi.cancel(id).then(() => {
                                            setAppointments(
                                                appointments.map((apt) =>
                                                    apt.id === id
                                                        ? {
                                                              ...apt,
                                                              status: 'CANCELLED' as const,
                                                          }
                                                        : apt
                                                )
                                            )
                                        })
                                    }}
                                    onViewDetails={(id) => {
                                        navigate(`/patient/appointments/${id}`)
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">
                            Você não tem consultas agendadas.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
