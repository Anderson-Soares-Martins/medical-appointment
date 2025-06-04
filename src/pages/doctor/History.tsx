import { useState, useEffect } from 'react'
import { ArrowLeft, Filter, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppointmentsStore } from '@/lib/store/appointments'
import { AppointmentCard } from '@/components/ui/AppointmentCard'
import type { Appointment } from '@/lib/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'

export default function DoctorHistory() {
    const navigate = useNavigate()
    const { appointments, fetchAppointments, isLoading } =
        useAppointmentsStore()
    const [filterOpen, setFilterOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<
        Appointment['status'] | 'all'
    >('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    useEffect(() => {
        fetchAppointments()
    }, [fetchAppointments])

    const filteredAppointments = appointments.filter((appointment) => {
        if (statusFilter !== 'all' && appointment.status !== statusFilter) {
            return false
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            const patientName = appointment.patient.name.toLowerCase()
            const notes = appointment.notes?.toLowerCase() || ''

            if (
                !patientName.includes(searchLower) &&
                !notes.includes(searchLower)
            ) {
                return false
            }
        }

        if (startDate) {
            const appointmentDate = new Date(appointment.date)
            const filterDate = new Date(startDate)
            if (appointmentDate < filterDate) {
                return false
            }
        }

        if (endDate) {
            const appointmentDate = new Date(appointment.date)
            const filterDate = new Date(endDate)
            if (appointmentDate > filterDate) {
                return false
            }
        }

        return true
    })

    return (
        <div>
            {/* Header */}
            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(-1)}
                    className="mr-4"
                >
                    <ArrowLeft size={24} />
                </Button>
                <h1 className="text-2xl font-semibold">
                    Histórico de Consultas
                </h1>
            </div>

            {/* Search and Filter */}
            <Card>
                <CardContent className="p-4">
                    <div className="relative mb-4">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <Input
                            type="text"
                            placeholder="Buscar por paciente ou observações..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Collapsible
                            open={filterOpen}
                            onOpenChange={setFilterOpen}
                        >
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center"
                                >
                                    <Filter size={18} className="mr-2" />
                                    <span>Filtros</span>
                                    {filterOpen ? (
                                        <ChevronUp size={18} className="ml-1" />
                                    ) : (
                                        <ChevronDown
                                            size={18}
                                            className="ml-1"
                                        />
                                    )}
                                </Button>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="mt-4 pt-4 border-t">
                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={
                                                statusFilter === 'all'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setStatusFilter('all')
                                            }
                                        >
                                            Todas
                                        </Button>
                                        <Button
                                            variant={
                                                statusFilter === 'COMPLETED'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className={
                                                statusFilter === 'COMPLETED'
                                                    ? 'bg-green-600 hover:bg-green-700'
                                                    : ''
                                            }
                                            onClick={() =>
                                                setStatusFilter('COMPLETED')
                                            }
                                        >
                                            Realizadas
                                        </Button>
                                        <Button
                                            variant={
                                                statusFilter === 'CANCELLED'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className={
                                                statusFilter === 'CANCELLED'
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : ''
                                            }
                                            onClick={() =>
                                                setStatusFilter('CANCELLED')
                                            }
                                        >
                                            Canceladas
                                        </Button>
                                        <Button
                                            variant={
                                                statusFilter === 'NO_SHOW'
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            className={
                                                statusFilter === 'NO_SHOW'
                                                    ? 'bg-yellow-600 hover:bg-yellow-700'
                                                    : ''
                                            }
                                            onClick={() =>
                                                setStatusFilter('NO_SHOW')
                                            }
                                        >
                                            Não Compareceu
                                        </Button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        Período
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-1">
                                                De
                                            </label>
                                            <Input
                                                type="date"
                                                value={startDate}
                                                onChange={(e) =>
                                                    setStartDate(e.target.value)
                                                }
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-1">
                                                Até
                                            </label>
                                            <Input
                                                type="date"
                                                value={endDate}
                                                onChange={(e) =>
                                                    setEndDate(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </CardContent>
            </Card>

            {/* Appointments List */}
            <div className="mt-6 space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">Carregando...</div>
                ) : filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                        <AppointmentCard
                            key={appointment.id}
                            appointment={appointment}
                            showActions={false}
                        />
                    ))
                ) : (
                    <p className="text-center py-8 text-gray-500">
                        Nenhuma consulta encontrada.
                    </p>
                )}
            </div>
        </div>
    )
}
