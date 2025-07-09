'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { usePatients } from '@/hooks/use-patients'
import { useAppointments } from '@/hooks/use-appointments'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { formatInitials } from '@/utils/format'
import { formatDateTime } from '@/utils/date'
import { formatAppointmentStatus, getStatusColor } from '@/utils/format'
import {
    Users,
    Search,
    Calendar,
    History,
    Mail,
    User,
    Phone,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/dashboard-layout'

export default function PatientsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const { data: patients, isLoading } = usePatients()
    const { data: appointments } = useAppointments()

    const [searchTerm, setSearchTerm] = useState('')

    // Redirecionar se não for médico
    useEffect(() => {
        if (user && user.role !== 'DOCTOR') {
            router.push('/dashboard')
        }
    }, [user, router])

    if (user?.role !== 'DOCTOR') {
        return null
    }

    const filteredPatients = (patients || []).filter(
        (patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getPatientAppointments = (patientId: string) => {
        return (appointments || []).filter(
            (apt) => apt.patientId === patientId && apt.doctorId === user?.id
        )
    }

    const getPatientStats = (patientId: string) => {
        const patientAppts = getPatientAppointments(patientId)
        return {
            total: patientAppts.length,
            completed: patientAppts.filter((apt) => apt.status === 'COMPLETED')
                .length,
            scheduled: patientAppts.filter((apt) => apt.status === 'SCHEDULED')
                .length,
            lastVisit: patientAppts
                .filter((apt) => apt.status === 'COMPLETED')
                .sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                )[0],
        }
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            Meus Pacientes
                        </h1>
                        <p className="text-gray-600">
                            Gerencie seus pacientes e histórico de consultas
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                            {filteredPatients.length}
                        </div>
                        <div className="text-sm text-gray-600">
                            paciente{filteredPatients.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                </div>

                {/* Busca */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar paciente por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Pacientes */}
                {filteredPatients.length ? (
                    <div className="space-y-4">
                        {filteredPatients.map((patient) => {
                            const stats = getPatientStats(patient.id)
                            const patientAppointments = getPatientAppointments(
                                patient.id
                            )

                            return (
                                <Card
                                    key={patient.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4 flex-1">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarFallback className="bg-blue-100 text-blue-600">
                                                        {formatInitials(
                                                            patient.name
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            {patient.name}
                                                        </h3>
                                                        <Badge variant="outline">
                                                            <User className="mr-1 h-3 w-3" />
                                                            Paciente
                                                        </Badge>
                                                    </div>

                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4" />
                                                            {patient.email}
                                                        </div>
                                                    </div>

                                                    {/* Estatísticas */}
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 p-3 bg-gray-50 rounded-lg">
                                                        <div className="text-center">
                                                            <div className="text-lg font-semibold text-blue-600">
                                                                {stats.total}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Total consultas
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-lg font-semibold text-green-600">
                                                                {
                                                                    stats.completed
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Concluídas
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-lg font-semibold text-orange-600">
                                                                {
                                                                    stats.scheduled
                                                                }
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Agendadas
                                                            </div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {stats.lastVisit
                                                                    ? new Date(
                                                                          stats.lastVisit.date
                                                                      ).toLocaleDateString(
                                                                          'pt-BR'
                                                                      )
                                                                    : 'Nunca'}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                Última consulta
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <History className="h-4 w-4 mr-2" />
                                                            Histórico
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Histórico de
                                                                Consultas -{' '}
                                                                {patient.name}
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Todas as
                                                                consultas
                                                                realizadas com
                                                                este paciente
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                                            {patientAppointments.length ? (
                                                                patientAppointments
                                                                    .sort(
                                                                        (
                                                                            a,
                                                                            b
                                                                        ) =>
                                                                            new Date(
                                                                                b.date
                                                                            ).getTime() -
                                                                            new Date(
                                                                                a.date
                                                                            ).getTime()
                                                                    )
                                                                    .map(
                                                                        (
                                                                            appointment
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    appointment.id
                                                                                }
                                                                                className="p-3 border rounded-lg"
                                                                            >
                                                                                <div className="flex items-center justify-between mb-2">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <Calendar className="h-4 w-4 text-blue-600" />
                                                                                        <span className="font-medium">
                                                                                            {formatDateTime(
                                                                                                appointment.date
                                                                                            )}
                                                                                        </span>
                                                                                    </div>
                                                                                    <Badge
                                                                                        className={getStatusColor(
                                                                                            appointment.status
                                                                                        )}
                                                                                    >
                                                                                        {formatAppointmentStatus(
                                                                                            appointment.status
                                                                                        )}
                                                                                    </Badge>
                                                                                </div>
                                                                                {appointment.notes && (
                                                                                    <div className="text-sm text-gray-600">
                                                                                        <strong>
                                                                                            Observações:
                                                                                        </strong>{' '}
                                                                                        {
                                                                                            appointment.notes
                                                                                        }
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    )
                                                            ) : (
                                                                <div className="text-center py-8 text-gray-500">
                                                                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                                                    <p>
                                                                        Nenhuma
                                                                        consulta
                                                                        encontrada
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        router.push(
                                                            `/appointments/new?patient=${patient.id}`
                                                        )
                                                    }
                                                >
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Nova Consulta
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhum paciente encontrado
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm
                                    ? 'Nenhum paciente corresponde à busca realizada.'
                                    : 'Você ainda não tem pacientes cadastrados.'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}
