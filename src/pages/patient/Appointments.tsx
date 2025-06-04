import { useState, useEffect } from 'react'
import { ArrowLeft, Search, Calendar, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store/useStore'
import { doctorsApi, appointmentsApi } from '@/lib/services/api'
import type { Doctor } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export default function PatientAppointments() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [selectedSpecialty, setSelectedSpecialty] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [availableSlots, setAvailableSlots] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const { user, addAppointment } = useStore()

    const specialties = [
        'Cardiologia',
        'Dermatologia',
        'Ortopedia',
        'Pediatria',
        'Neurologia',
    ]

    useEffect(() => {
        const fetchDoctors = async () => {
            if (!selectedSpecialty) return
            setIsLoading(true)
            try {
                const data = await doctorsApi.getAll()
                setDoctors(
                    data.filter((doc) => doc.specialty === selectedSpecialty)
                )
            } catch (error) {
                console.error('Failed to fetch doctors:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDoctors()
    }, [selectedSpecialty])

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDoctor || !selectedDate) return
            setIsLoading(true)
            try {
                const slots = await doctorsApi.getAvailableSlots(
                    selectedDoctor.id,
                    selectedDate
                )
                setAvailableSlots(slots)
            } catch (error) {
                console.error('Failed to fetch available slots:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchAvailableSlots()
    }, [selectedDoctor, selectedDate])

    const handleConfirmAppointment = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime || !user) return

        setIsLoading(true)
        try {
            const appointment = await appointmentsApi.create({
                doctorId: selectedDoctor.id,
                patientId: user.id,
                date: selectedDate,
                time: selectedTime,
                status: 'SCHEDULED',
                type: 'Consulta Regular',
            })

            addAppointment(appointment)
            navigate('/patient')
        } catch (error) {
            console.error('Failed to create appointment:', error)
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
                                        onClick={() =>
                                            setSelectedSpecialty(specialty)
                                        }
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
                                {doctors.map((doctor) => (
                                    <Button
                                        key={doctor.id}
                                        variant={
                                            selectedDoctor?.id === doctor.id
                                                ? 'default'
                                                : 'outline'
                                        }
                                        className="w-full justify-start h-auto py-4"
                                        onClick={() =>
                                            setSelectedDoctor(doctor)
                                        }
                                    >
                                        <div className="flex items-center w-full">
                                            <Avatar className="w-12 h-12 mr-4">
                                                <AvatarFallback>
                                                    {doctor.name
                                                        .split(' ')
                                                        .map((n) => n[0])
                                                        .join('')}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-left">
                                                    {doctor.name}
                                                </h3>
                                                <p className="text-sm text-left">
                                                    {doctor.specialty}
                                                </p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-yellow-500">
                                                        ★
                                                    </span>
                                                    <span className="text-sm ml-1">
                                                        {doctor.rating}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="mb-6">
                                <h3 className="flex items-center text-gray-700 mb-4">
                                    <Calendar size={18} className="mr-2" />
                                    Selecione uma data
                                </h3>
                                <Input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) =>
                                        setSelectedDate(e.target.value)
                                    }
                                />
                            </div>

                            {selectedDate && (
                                <div>
                                    <h3 className="flex items-center text-gray-700 mb-4">
                                        <Clock size={18} className="mr-2" />
                                        Selecione um horário
                                    </h3>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                        {availableSlots.map((time) => (
                                            <Button
                                                key={time}
                                                variant={
                                                    selectedTime === time
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                onClick={() =>
                                                    setSelectedTime(time)
                                                }
                                            >
                                                {time}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {step === 4 && (
                        <>
                            <h2 className="text-xl font-semibold text-center mb-6">
                                Confirmar Agendamento
                            </h2>

                            <Card className="bg-gray-50 mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-start mb-4">
                                        <Avatar className="w-12 h-12 mr-4">
                                            <AvatarFallback>
                                                {selectedDoctor?.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-semibold">
                                                {selectedDoctor?.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm">
                                                {selectedDoctor?.specialty}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between border-t pt-4">
                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Data
                                            </p>
                                            <p className="font-semibold">
                                                {selectedDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-sm">
                                                Hora
                                            </p>
                                            <p className="font-semibold">
                                                {selectedTime}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <div className="mt-8 flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => setStep((s) => Math.max(1, s - 1))}
                            disabled={step === 1}
                        >
                            Voltar
                        </Button>
                        <Button
                            onClick={() => {
                                if (step === 4) {
                                    handleConfirmAppointment()
                                } else {
                                    setStep((s) => s + 1)
                                }
                            }}
                            disabled={
                                (step === 1 && !selectedSpecialty) ||
                                (step === 2 && !selectedDoctor) ||
                                (step === 3 &&
                                    (!selectedDate || !selectedTime)) ||
                                isLoading
                            }
                        >
                            {step === 4 ? 'Confirmar Agendamento' : 'Continuar'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
