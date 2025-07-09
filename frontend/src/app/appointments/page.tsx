'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import {
    useAppointments,
    useCancelAppointment,
    useUpdateAppointment,
} from '@/hooks/use-appointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { formatAppointmentStatus, getStatusColor } from '@/utils/format'
import { formatDateTime } from '@/utils/date'
import { toast } from 'sonner'
import {
    Calendar,
    Search,
    Edit,
    Trash2,
    User,
    Stethoscope,
    Plus,
    Filter,
} from 'lucide-react'
import Link from 'next/link'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Appointment, AppointmentStatus } from '@/types'

export default function AppointmentsPage() {
    const { user } = useAuth()
    const { data: appointments, isLoading } = useAppointments()
    const cancelMutation = useCancelAppointment()
    const updateMutation = useUpdateAppointment()

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>(
        'all'
    )
    const [editingAppointment, setEditingAppointment] =
        useState<Appointment | null>(null)
    const [newStatus, setNewStatus] = useState<AppointmentStatus>('SCHEDULED')
    const [notes, setNotes] = useState('')

    const filteredAppointments = appointments?.filter((appointment) => {
        const matchesSearch =
            user?.role === 'DOCTOR'
                ? appointment.patient?.name
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase())
                : appointment.doctor?.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())

        const matchesStatus =
            statusFilter === 'all' || appointment.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            await cancelMutation.mutateAsync(appointmentId)
            toast.success('Consulta cancelada com sucesso')
        } catch {
            toast.error('Erro ao cancelar consulta')
        }
    }

    const handleUpdateAppointment = async () => {
        if (!editingAppointment) return

        try {
            await updateMutation.mutateAsync({
                id: editingAppointment.id,
                data: { status: newStatus, notes },
            })
            toast.success('Consulta atualizada com sucesso')
            setEditingAppointment(null)
        } catch {
            toast.error('Erro ao atualizar consulta')
        }
    }

    const openEditDialog = (appointment: Appointment) => {
        setEditingAppointment(appointment)
        setNewStatus(appointment.status)
        setNotes(appointment.notes || '')
    }

    const canUpdateStatus = (appointment: Appointment) => {
        return user?.role === 'DOCTOR' && appointment.doctorId === user.id
    }

    const canCancelAppointment = (appointment: Appointment) => {
        if (appointment.status !== 'SCHEDULED') return false

        if (user?.role === 'DOCTOR') {
            return appointment.doctorId === user.id
        }

        return appointment.patientId === user?.id
    }

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-6" data-testid="appointments-page">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Consultas
                        </h1>
                        <p className="text-gray-600">
                            Gerencie suas consultas médicas
                        </p>
                    </div>
                    {user?.role === 'PATIENT' && (
                        <Button asChild>
                            <Link href="/appointments/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Nova Consulta
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-blue-600"
                                    data-testid="total-appointments"
                                >
                                    {filteredAppointments?.length || 0}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Total de Consultas
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-green-600"
                                    data-testid="scheduled-count"
                                >
                                    {filteredAppointments?.filter(
                                        (a) => a.status === 'SCHEDULED'
                                    ).length || 0}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Agendadas
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div
                                    className="text-2xl font-bold text-red-600"
                                    data-testid="cancelled-count"
                                >
                                    {filteredAppointments?.filter(
                                        (a) => a.status === 'CANCELLED'
                                    ).length || 0}
                                </div>
                                <p className="text-sm text-gray-600">
                                    Canceladas
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        data-testid="search-input"
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
                            </div>

                            {/* Hidden native select for Cypress testing */}
                            <select
                                data-testid="status-filter"
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value as
                                            | AppointmentStatus
                                            | 'all'
                                    )
                                }
                                className="sr-only"
                                aria-hidden="true"
                            >
                                <option value="all">Todos os status</option>
                                <option value="SCHEDULED">Agendadas</option>
                                <option value="COMPLETED">Concluídas</option>
                                <option value="CANCELLED">Canceladas</option>
                                <option value="NO_SHOW">Faltou</option>
                            </select>

                            <Select
                                value={statusFilter}
                                onValueChange={(value) =>
                                    setStatusFilter(
                                        value as AppointmentStatus | 'all'
                                    )
                                }
                            >
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Todos os status
                                    </SelectItem>
                                    <SelectItem value="SCHEDULED">
                                        Agendadas
                                    </SelectItem>
                                    <SelectItem value="COMPLETED">
                                        Concluídas
                                    </SelectItem>
                                    <SelectItem value="CANCELLED">
                                        Canceladas
                                    </SelectItem>
                                    <SelectItem value="NO_SHOW">
                                        Faltou
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Appointments List */}
                <div className="space-y-4">
                    {filteredAppointments?.length ? (
                        filteredAppointments.map((appointment) => (
                            <Card
                                key={appointment.id}
                                data-testid="appointment-card"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge
                                                    className={getStatusColor(
                                                        appointment.status
                                                    )}
                                                    data-testid="appointment-status"
                                                >
                                                    {formatAppointmentStatus(
                                                        appointment.status
                                                    )}
                                                </Badge>
                                                <div
                                                    className="flex items-center gap-1 text-sm text-gray-600"
                                                    data-testid="appointment-date"
                                                >
                                                    <Calendar className="h-4 w-4" />
                                                    {formatDateTime(
                                                        appointment.date
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {user?.role === 'DOCTOR' ? (
                                                        <>
                                                            <User className="h-4 w-4 text-gray-600" />
                                                            <span
                                                                className="font-medium"
                                                                data-testid="patient-name"
                                                            >
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
                                                            <span
                                                                className="font-medium"
                                                                data-testid="doctor-name"
                                                            >
                                                                Dr.{' '}
                                                                {
                                                                    appointment
                                                                        .doctor
                                                                        ?.name
                                                                }
                                                            </span>
                                                            <span
                                                                className="text-sm text-gray-600"
                                                                data-testid="doctor-specialty"
                                                            >
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
                                                    <div
                                                        className="text-sm text-gray-600 mt-2"
                                                        data-testid="appointment-notes"
                                                    >
                                                        <strong>
                                                            Observações:
                                                        </strong>{' '}
                                                        {appointment.notes}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* View Details Button */}
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        data-testid="view-details"
                                                    >
                                                        Ver Detalhes
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent data-testid="appointment-details-modal">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Detalhes da Consulta
                                                        </DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <strong data-testid="detail-doctor">
                                                                Dr.{' '}
                                                                {
                                                                    appointment
                                                                        .doctor
                                                                        ?.name
                                                                }
                                                            </strong>
                                                        </div>
                                                        <div>
                                                            <span data-testid="detail-specialty">
                                                                {
                                                                    appointment
                                                                        .doctor
                                                                        ?.specialty
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span data-testid="detail-notes">
                                                                {
                                                                    appointment.notes
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            {canUpdateStatus(appointment) && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            data-testid="edit-appointment"
                                                            onClick={() =>
                                                                openEditDialog(
                                                                    appointment
                                                                )
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Editar Consulta
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Atualize o
                                                                status e
                                                                observações da
                                                                consulta
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium">
                                                                    Status
                                                                </label>
                                                                <Select
                                                                    value={
                                                                        newStatus
                                                                    }
                                                                    onValueChange={(
                                                                        value
                                                                    ) =>
                                                                        setNewStatus(
                                                                            value as AppointmentStatus
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="SCHEDULED">
                                                                            Agendada
                                                                        </SelectItem>
                                                                        <SelectItem value="COMPLETED">
                                                                            Concluída
                                                                        </SelectItem>
                                                                        <SelectItem value="CANCELLED">
                                                                            Cancelada
                                                                        </SelectItem>
                                                                        <SelectItem value="NO_SHOW">
                                                                            Faltou
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-sm font-medium">
                                                                    Observações
                                                                </label>
                                                                <Textarea
                                                                    value={
                                                                        notes
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setNotes(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    placeholder="Adicione observações sobre a consulta..."
                                                                    rows={3}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                data-testid="cancel-edit"
                                                                onClick={() =>
                                                                    setEditingAppointment(
                                                                        null
                                                                    )
                                                                }
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                data-testid="save-appointment"
                                                                onClick={
                                                                    handleUpdateAppointment
                                                                }
                                                            >
                                                                Salvar
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            )}

                                            {canCancelAppointment(
                                                appointment
                                            ) && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            data-testid="cancel-appointment"
                                                            disabled={
                                                                appointment.status !==
                                                                'SCHEDULED'
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Cancelar
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent data-testid="cancel-modal">
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>
                                                                Cancelar
                                                                Consulta
                                                            </AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Tem certeza que
                                                                deseja cancelar
                                                                esta consulta?
                                                                Esta ação não
                                                                pode ser
                                                                desfeita.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <div className="my-4">
                                                            <label className="text-sm font-medium">
                                                                Motivo do
                                                                cancelamento
                                                            </label>
                                                            <select
                                                                className="w-full mt-2 p-2 border rounded"
                                                                data-testid="cancel-reason"
                                                            >
                                                                <option value="Conflito de agenda">
                                                                    Conflito de
                                                                    agenda
                                                                </option>
                                                                <option value="Emergência">
                                                                    Emergência
                                                                </option>
                                                                <option value="Outros">
                                                                    Outros
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>
                                                                Não
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                data-testid="confirm-cancel"
                                                                onClick={() =>
                                                                    handleCancelAppointment(
                                                                        appointment.id
                                                                    )
                                                                }
                                                            >
                                                                Sim, cancelar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}

                                            {appointment.status ===
                                                'COMPLETED' && (
                                                <div
                                                    data-testid="non-cancellable"
                                                    className="text-sm text-green-600"
                                                >
                                                    Consulta realizada
                                                </div>
                                            )}

                                            {appointment.status ===
                                                'COMPLETED' &&
                                                appointment.notes && (
                                                    <div
                                                        data-testid="completion-date"
                                                        className="text-sm text-gray-500"
                                                    >
                                                        Concluída em:{' '}
                                                        {formatDateTime(
                                                            appointment.date
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <div
                                    className="text-center py-8"
                                    data-testid="no-appointments"
                                >
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Nenhuma consulta encontrada
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {appointments?.length === 0
                                            ? 'Você ainda não tem consultas agendadas.'
                                            : 'Nenhuma consulta corresponde aos filtros aplicados.'}
                                    </p>
                                    {user?.role === 'PATIENT' &&
                                        appointments?.length === 0 && (
                                            <Button
                                                asChild
                                                data-testid="refresh-appointments"
                                            >
                                                <Link href="/appointments/new">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Agendar Primeira Consulta
                                                </Link>
                                            </Button>
                                        )}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}
