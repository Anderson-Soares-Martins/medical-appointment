'use client'

import { useAuth } from '@/providers/auth-provider'
import {
    useTodayAppointments,
    useUpdateAppointment,
} from '@/hooks/use-appointments'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '@/components/ui/textarea'
import { formatAppointmentStatus, getStatusColor } from '@/utils/format'
import { toast } from 'sonner'
import {
    Clock,
    User,
    Stethoscope,
    Edit,
    CheckCircle,
    XCircle,
    Calendar,
} from 'lucide-react'
import { useState } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Appointment, AppointmentStatus } from '@/types'

export default function TodayAppointmentsPage() {
    const { user } = useAuth()
    const { data: todayAppointments, isLoading } = useTodayAppointments()
    const updateMutation = useUpdateAppointment()

    const [editingAppointment, setEditingAppointment] =
        useState<Appointment | null>(null)
    const [newStatus, setNewStatus] = useState<AppointmentStatus>('SCHEDULED')
    const [notes, setNotes] = useState('')

    const handleUpdateAppointment = async () => {
        if (!editingAppointment) return

        try {
            await updateMutation.mutateAsync({
                id: editingAppointment.id,
                data: { status: newStatus, notes },
            })
            toast.success('Consulta atualizada com sucesso')
            setEditingAppointment(null)
            setNotes('')
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

    const getTimeFromDate = (date: string) => {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
        })
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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="h-6 w-6" />
                            Consultas de Hoje
                        </h1>
                        <p className="text-gray-600">
                            {new Date().toLocaleDateString('pt-BR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                            {todayAppointments?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                            consulta
                            {(todayAppointments?.length || 0) !== 1
                                ? 's'
                                : ''}{' '}
                            hoje
                        </div>
                    </div>
                </div>

                {todayAppointments?.length ? (
                    <div className="space-y-4">
                        {todayAppointments
                            .sort(
                                (a, b) =>
                                    new Date(a.date).getTime() -
                                    new Date(b.date).getTime()
                            )
                            .map((appointment) => (
                                <Card
                                    key={appointment.id}
                                    className="hover:shadow-md transition-shadow"
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="flex items-center gap-2 text-lg font-medium">
                                                        <Calendar className="h-5 w-5 text-blue-600" />
                                                        {getTimeFromDate(
                                                            appointment.date
                                                        )}
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

                                            <div className="flex items-center gap-2">
                                                {canUpdateStatus(
                                                    appointment
                                                ) && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openEditDialog(
                                                                        appointment
                                                                    )
                                                                }
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Atualizar
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>
                                                                    Atualizar
                                                                    Consulta
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Atualize o
                                                                    status da
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
                                                                                <div className="flex items-center">
                                                                                    <Clock className="mr-2 h-4 w-4" />
                                                                                    Agendada
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="COMPLETED">
                                                                                <div className="flex items-center">
                                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                                    Concluída
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem value="NO_SHOW">
                                                                                <div className="flex items-center">
                                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                                    Faltou
                                                                                </div>
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
                                                            <div className="flex justify-end space-x-2">
                                                                <Button
                                                                    variant="outline"
                                                                    onClick={() =>
                                                                        setEditingAppointment(
                                                                            null
                                                                        )
                                                                    }
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                                <Button
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
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Nenhuma consulta hoje
                            </h3>
                            <p className="text-gray-600">
                                Você não tem consultas agendadas para hoje.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}
