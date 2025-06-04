import { Calendar, Clock } from 'lucide-react'
import type { Appointment, Doctor, Patient } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

interface AppointmentCardProps {
    appointment: Appointment
    doctor?: Doctor
    patient?: Patient
    showActions?: boolean
    onCancel?: (id: string) => void
    onViewDetails?: (id: string) => void
}

export function AppointmentCard({
    appointment,
    doctor,
    patient,
    showActions = true,
    onCancel,
    onViewDetails,
}: AppointmentCardProps) {
    const getStatusBadge = (status: Appointment['status']) => {
        const statusConfig = {
            SCHEDULED: {
                variant: 'outline',
                className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                label: 'Agendada',
            },
            COMPLETED: {
                variant: 'outline',
                className: 'bg-green-100 text-green-800 border-green-200',
                label: 'Realizada',
            },
            CANCELLED: {
                variant: 'destructive',
                className: '',
                label: 'Cancelada',
            },
            NO_SHOW: {
                variant: 'secondary',
                className: '',
                label: 'Não Compareceu',
            },
        } as const

        const config = statusConfig[status]
        return (
            <Badge variant={config.variant} className={config.className}>
                {config.label}
            </Badge>
        )
    }

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                        <Avatar className="h-12 w-12 bg-blue-100">
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                                {(doctor?.name || patient?.name || '')
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-medium text-gray-900">
                                {doctor?.name || patient?.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {doctor?.specialty}
                            </p>
                            <div className="flex items-center mt-2 space-x-4">
                                <div className="flex items-center text-gray-500 text-sm">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>{appointment.date}</span>
                                </div>
                                <div className="flex items-center text-gray-500 text-sm">
                                    <Clock className="h-4 w-4 mr-1" />
                                    <span>{appointment.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                        {getStatusBadge(appointment.status)}
                        {showActions && appointment.status === 'SCHEDULED' && (
                            <div className="flex space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        onViewDetails?.(appointment.id)
                                    }
                                >
                                    Ver Detalhes
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onCancel?.(appointment.id)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
                {appointment.notes && (
                    <>
                        <Separator className="my-4" />
                        <p className="text-sm text-gray-600">
                            {appointment.notes}
                        </p>
                    </>
                )}
            </CardContent>
        </Card>
    )
}
