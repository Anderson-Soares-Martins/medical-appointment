import { useState, useEffect } from 'react'
import { ArrowLeft, Search, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/auth'
import { useAppointmentsStore } from '@/lib/store/appointments'
import { useDoctorsStore } from '@/lib/store/doctors'
import type { User } from '@/lib/types/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function PatientAppointments() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const { createAppointment } = useAppointmentsStore()
    const {
        doctors,
        fetchDoctors,
        isLoading: doctorsLoading,
    } = useDoctorsStore()

    const [step, setStep] = useState(1)
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const specialties = [
        'Cardiologia',
        'Dermatologia',
        'Ortopedia',
        'Pediatria',
        'Neurologia',
    ]

    useEffect(() => {
        if (selectedSpecialty) {
            fetchDoctors()
        }
    }, [selectedSpecialty, fetchDoctors])

    const filteredDoctors = doctors.filter(
        (doc) => doc.specialty === selectedSpecialty
    )

    // TODO: Implement this with a proper API endpoint
    const generateAvailableSlots = () => {
        const slots = []
        const start = 8
        const end = 17

        for (let hour = start; hour <= end; hour++) {
            for (const minute of ['00', '30']) {
                slots.push(`${hour.toString().padStart(2, '0')}:${minute}`)
            }
        }

        return slots
    }

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            // TODO: Replace with actual API call when available
            setAvailableSlots(generateAvailableSlots())
        }
    }, [selectedDoctor, selectedDate])

    const handleConfirmAppointment = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime || !user) return
        setIsLoading(true)
        try {
            // Create date string with the correct timezone handling
            const [hours, minutes] = selectedTime.split(':')
            const appointmentDate = `${selectedDate}T${hours}:${minutes}:00.000Z`

            await createAppointment({
                doctorId: selectedDoctor.id,
                date: appointmentDate,
            })
            toast.success('Consulta agendada com sucesso!')
            navigate('/patient')
        } catch (error) {
            console.error('Failed to create appointment:', error)
            toast.error('Erro ao agendar consulta.')
        } finally {
            setIsLoading(false)
        }
    }

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
                <h1 className="text-2xl font-semibold">Agendar Consulta</h1>
            </div>

            {/* Step Indicator */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2" />
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center">
                        <Badge
                            variant={
                                s < step
                                    ? 'secondary'
                                    : s === step
                                    ? 'default'
                                    : 'outline'
                            }
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                s < step
                                    ? 'bg-green-500 text-white hover:bg-green-500'
                                    : ''
                            }`}
                        >
                            {s}
                        </Badge>
                        <span className="text-xs mt-1 text-gray-600">
                            {s === 1
                                ? 'Especialidade'
                                : s === 2
                                ? 'Médico'
                                : s === 3
                                ? 'Data/Hora'
                                : 'Confirmação'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <Card>
                <CardContent className="p-6">
                    {step === 1 && (
                        <>
                            <div className="mb-6">
                                <label className="block text-gray-700 mb-2">
                                    Escolha uma especialidade
                                </label>
                                <div className="relative">
                                    <Search
                                        size={18}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <Input
                                        type="text"
                                        placeholder="Buscar especialidade..."
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                {specialties.map((specialty) => (
                                    <Button
                                        key={specialty}
                                        variant={
                                            selectedSpecialty === specialty
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="w-full justify-between h-auto py-4"
                                        onClick={() => {
                                            setSelectedSpecialty(specialty)
                                            setStep(2)
                                        }}
                                    >
                                        <span>{specialty}</span>
                                        {selectedSpecialty === specialty && (
                                            <Calendar size={20} />
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">
                                Escolha um profissional - {selectedSpecialty}
                            </h2>

                            <div className="space-y-4">
                                {doctorsLoading ? (
                                    <div className="text-center py-8">
                                        Carregando médicos...
                                    </div>
                                ) : filteredDoctors.length > 0 ? (
                                    filteredDoctors.map((doctor) => (
                                        <Button
                                            key={doctor.id}
                                            variant={
                                                selectedDoctor?.id === doctor.id
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            className="w-full justify-between h-auto p-4"
                                            onClick={() => {
                                                setSelectedDoctor(doctor)
                                                setStep(3)
                                            }}
                                        >
                                            <div className="flex items-center">
                                                <Avatar className="h-12 w-12 mr-4">
                                                    <AvatarFallback>
                                                        {doctor.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="text-left">
                                                    <h3 className="font-medium">
                                                        {doctor.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600">
                                                        {doctor.specialty}
                                                    </p>
                                                </div>
                                            </div>
                                        </Button>
                                    ))
                                ) : (
                                    <p className="text-center py-8 text-gray-500">
                                        Nenhum médico encontrado para esta
                                        especialidade.
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                >
                                    Voltar
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">
                                Escolha a data e horário
                            </h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 mb-2">
                                        Data da consulta
                                    </label>
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split('T')[0]
                                        }
                                        onChange={(e) =>
                                            setSelectedDate(e.target.value)
                                        }
                                    />
                                </div>

                                {selectedDate && (
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Horário disponível
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {availableSlots.map((time) => (
                                                <Button
                                                    key={time}
                                                    variant={
                                                        selectedTime === time
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    className="py-2"
                                                    onClick={() => {
                                                        setSelectedTime(time)
                                                        setStep(4)
                                                    }}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(2)}
                                >
                                    Voltar
                                </Button>
                            </div>
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h2 className="text-lg font-semibold mb-4">
                                Confirmar Agendamento
                            </h2>

                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <h3 className="font-medium mb-2">
                                        Detalhes da Consulta
                                    </h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p>
                                            <strong>Médico:</strong>{' '}
                                            {selectedDoctor?.name}
                                        </p>
                                        <p>
                                            <strong>Especialidade:</strong>{' '}
                                            {selectedDoctor?.specialty}
                                        </p>
                                        <p>
                                            <strong>Data:</strong>{' '}
                                            {new Date(
                                                selectedDate
                                            ).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong>Horário:</strong>{' '}
                                            {selectedTime}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(3)}
                                    >
                                        Voltar
                                    </Button>
                                    <Button
                                        onClick={handleConfirmAppointment}
                                        disabled={isLoading}
                                    >
                                        {isLoading
                                            ? 'Confirmando...'
                                            : 'Confirmar Agendamento'}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
