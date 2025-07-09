'use client'

import { useAuth } from '@/providers/auth-provider'
import {
    useAppointmentStats,
    useTodayAppointments,
    useUpcomingAppointments,
} from '@/hooks/use-appointments'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatAppointmentStatus, getStatusColor } from '@/utils/format'
import { formatRelativeTime } from '@/utils/date'
import {
    Calendar,
    Clock,
    TrendingUp,
    CheckCircle,
    XCircle,
    AlertCircle,
    CalendarPlus,
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/dashboard-layout'

export default function DashboardPage() {
    const { user } = useAuth()
    const { data: stats } = useAppointmentStats()
    const { data: todayAppointments } = useTodayAppointments()
    const { data: upcomingAppointments } = useUpcomingAppointments()

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {getGreeting()}, {user?.role === 'DOCTOR' ? 'Dr. ' : ''}
                        {user?.name}!
                    </h1>
                    <p className="text-gray-600">
                        {user?.role === 'DOCTOR'
                            ? 'Aqui está um resumo das suas consultas'
                            : 'Aqui está um resumo das suas consultas médicas'}
                    </p>
                </div>

                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total de Consultas
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {stats.total}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Todas as consultas registradas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Agendadas
                                </CardTitle>
                                <Clock className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.scheduled}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Consultas confirmadas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Concluídas
                                </CardTitle>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.completed}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Consultas realizadas
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Canceladas
                                </CardTitle>
                                <XCircle className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {stats.cancelled}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Consultas canceladas
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Today's Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5" />
                                {user?.role === 'DOCTOR'
                                    ? 'Consultas de Hoje'
                                    : 'Suas Consultas Hoje'}
                            </CardTitle>
                            <CardDescription>
                                {user?.role === 'DOCTOR'
                                    ? 'Pacientes agendados para hoje'
                                    : 'Suas consultas médicas de hoje'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {todayAppointments?.length ? (
                                <div className="space-y-3">
                                    {todayAppointments
                                        .slice(0, 3)
                                        .map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {user?.role === 'DOCTOR'
                                                            ? appointment
                                                                  .patient?.name
                                                            : appointment.doctor
                                                                  ?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatRelativeTime(
                                                            appointment.date
                                                        )}
                                                    </div>
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
                                        ))}
                                    {todayAppointments.length > 3 && (
                                        <div className="text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href="/appointments/today">
                                                    Ver todas (
                                                    {todayAppointments.length})
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                                    <p>Nenhuma consulta agendada para hoje</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Appointments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Próximas Consultas
                            </CardTitle>
                            <CardDescription>
                                {user?.role === 'DOCTOR'
                                    ? 'Suas próximas consultas agendadas'
                                    : 'Suas próximas consultas médicas'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {upcomingAppointments?.length ? (
                                <div className="space-y-3">
                                    {upcomingAppointments
                                        .slice(0, 3)
                                        .map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <div className="font-medium">
                                                        {user?.role === 'DOCTOR'
                                                            ? appointment
                                                                  .patient?.name
                                                            : appointment.doctor
                                                                  ?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {formatRelativeTime(
                                                            appointment.date
                                                        )}
                                                    </div>
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
                                        ))}
                                    {upcomingAppointments.length > 3 && (
                                        <div className="text-center">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link href="/appointments/upcoming">
                                                    Ver todas (
                                                    {
                                                        upcomingAppointments.length
                                                    }
                                                    )
                                                </Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Calendar className="h-8 w-8 mx-auto mb-2" />
                                    <p>Nenhuma consulta agendada</p>
                                    {user?.role === 'PATIENT' && (
                                        <Button
                                            size="sm"
                                            className="mt-2"
                                            asChild
                                        >
                                            <Link href="/appointments/new">
                                                <CalendarPlus className="h-4 w-4 mr-2" />
                                                Agendar Consulta
                                            </Link>
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                        <CardDescription>
                            Acesso rápido às principais funcionalidades
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {user?.role === 'PATIENT' && (
                                <Button asChild>
                                    <Link href="/appointments/new">
                                        <CalendarPlus className="h-4 w-4 mr-2" />
                                        Agendar Consulta
                                    </Link>
                                </Button>
                            )}
                            <Button variant="outline" asChild>
                                <Link href="/appointments">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Ver Todas as Consultas
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/history">
                                    <Clock className="h-4 w-4 mr-2" />
                                    Histórico
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
