'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useAppointments } from '@/hooks/use-appointments'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatAppointmentStatus, getStatusColor } from '@/utils/format'
import { formatDateTime } from '@/utils/date'
import {
    History,
    Search,
    Filter,
    Calendar,
    User,
    Stethoscope,
    Download,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { AppointmentStatus } from '@/types'

export default function HistoryPage() {
    const { user } = useAuth()
    const { data: appointments, isLoading } = useAppointments()

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>(
        'all'
    )
    const [periodFilter, setPeriodFilter] = useState<string>('all')

    // Filtrar apenas consultas completadas e canceladas (histórico)
    const historicalAppointments = (appointments || []).filter(
        (apt) =>
            apt.status === 'COMPLETED' ||
            apt.status === 'CANCELLED' ||
            apt.status === 'NO_SHOW'
    )

    const filteredAppointments = historicalAppointments.filter(
        (appointment) => {
            const matchesSearch =
                user?.role === 'DOCTOR'
                    ? appointment.patient?.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                    : appointment.doctor?.name
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())

            const matchesStatus =
                statusFilter === 'all' || appointment.status === statusFilter

            let matchesPeriod = true
            if (periodFilter !== 'all') {
                const appointmentDate = new Date(appointment.date)
                const now = new Date()

                switch (periodFilter) {
                    case 'week':
                        const weekAgo = new Date(
                            now.getTime() - 7 * 24 * 60 * 60 * 1000
                        )
                        matchesPeriod = appointmentDate >= weekAgo
                        break
                    case 'month':
                        const monthAgo = new Date(
                            now.getTime() - 30 * 24 * 60 * 60 * 1000
                        )
                        matchesPeriod = appointmentDate >= monthAgo
                        break
                    case 'quarter':
                        const quarterAgo = new Date(
                            now.getTime() - 90 * 24 * 60 * 60 * 1000
                        )
                        matchesPeriod = appointmentDate >= quarterAgo
                        break
                    case 'year':
                        const yearAgo = new Date(
                            now.getTime() - 365 * 24 * 60 * 60 * 1000
                        )
                        matchesPeriod = appointmentDate >= yearAgo
                        break
                }
            }

            return matchesSearch && matchesStatus && matchesPeriod
        }
    )

    const getStats = () => {
        return {
            total: filteredAppointments.length,
            completed: filteredAppointments.filter(
                (apt) => apt.status === 'COMPLETED'
            ).length,
            cancelled: filteredAppointments.filter(
                (apt) => apt.status === 'CANCELLED'
            ).length,
            noShow: filteredAppointments.filter(
                (apt) => apt.status === 'NO_SHOW'
            ).length,
        }
    }

    const stats = getStats()

    const exportHistory = () => {
        // Implementar exportação CSV/PDF
        // Por ora, apenas mostrar toast
        alert('Funcionalidade de exportação será implementada em breve!')
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
                            <History className="h-6 w-6" />
                            Histórico de Consultas
                        </h1>
                        <p className="text-gray-600">
                            Consulte o histórico completo de consultas
                            realizadas
                        </p>
                    </div>

                    <Button onClick={exportHistory} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>

                {/* Estatísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.total}
                            </div>
                            <div className="text-sm text-gray-600">Total</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {stats.completed}
                            </div>
                            <div className="text-sm text-gray-600">
                                Concluídas
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {stats.cancelled}
                            </div>
                            <div className="text-sm text-gray-600">
                                Canceladas
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.noShow}
                            </div>
                            <div className="text-sm text-gray-600">
                                Faltaram
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder={`Buscar por ${
                                        user?.role === 'DOCTOR'
                                            ? 'paciente'
                                            : 'médico'
                                    }...`}
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={(value) =>
                                    setStatusFilter(
                                        value as AppointmentStatus | 'all'
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <Filter className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todos os status
                                    </SelectItem>
                                    <SelectItem value="COMPLETED">
                                        Concluídas
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Canceladas
                                    </SelectItem>
                                    <SelectItem value="NO_SHOW">
                                        Faltaram
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={periodFilter}
                                onValueChange={setPeriodFilter}
                            >
                                <SelectTrigger>
                                    <Calendar className="mr-2 h-4 w-4" />
                                    <SelectValue placeholder="Período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todo o período
                                    </SelectItem>
                                    <SelectItem value="week">
                                        Última semana
                                    </SelectItem>
                                    <SelectItem value="month">
                                        Último mês
                                    </SelectItem>
                                    <SelectItem value="quarter">
                                        Último trimestre
                                    </SelectItem>
                                    <SelectItem value="year">
                                        Último ano
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Consultas */}
                {filteredAppointments.length ? (
                    <div className="space-y-4">
                        {filteredAppointments
                            .sort(
                                (a, b) =>
                                    new Date(b.date).getTime() -
                                    new Date(a.date).getTime()
                            )
                            .map((appointment) => (
                                <Card
                                    key={appointment.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge
                                                        className={getStatusColor(
                                                            appointment.status
                                                        )}
                                                    >
                                                        {formatAppointmentStatus(
                                                            appointment.status
                                                        )}
                                                    </Badge>
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDateTime(
                                                            appointment.date
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 mb-2">
                                                    {user?.role === 'DOCTOR' ? (
                                                        <>
                                                            <User className="h-4 w-4 text-gray-600" />
                                                            <span className="font-medium">
                                                                {
                                                                    appointment
                                                                        .patient
                                                                        ?.name
                                                                }
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Stethoscope className="h-4 w-4 text-gray-600" />
                                                            <span className="font-medium">
                                                                Dr.{' '}
                                                                {
                                                                    appointment
                                                                        .doctor
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                -{' '}
                                                                {
                                                                    appointment
                                                                        .doctor
                                                                        ?.specialty
                                                                }
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {appointment.notes && (
                                                    <div className="text-sm text-gray-600 mt-2">
                                                        <strong>
                                                            Observações:
                                                        </strong>{' '}
                                                        {appointment.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhuma consulta no histórico
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm ||
                                statusFilter !== 'all' ||
                                periodFilter !== 'all'
                                    ? 'Nenhuma consulta corresponde aos filtros aplicados.'
                                    : 'Você ainda não tem consultas finalizadas.'}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}
