import React, { useState } from 'react'
import {
    ArrowLeft,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store/useStore'
import { AppointmentCard } from '@/components/ui/AppointmentCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export default function DoctorSchedule() {
    const navigate = useNavigate()
    const { appointments } = useStore()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [view, setView] = useState<'day' | 'week'>('day')

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    const getWeekDates = (date: Date) => {
        const week = []
        const start = new Date(date)
        start.setDate(start.getDate() - start.getDay())

        for (let i = 0; i < 7; i++) {
            const day = new Date(start)
            day.setDate(day.getDate() + i)
            week.push(day)
        }

        return week
    }

    const weekDates = getWeekDates(selectedDate)

    const timeSlots = [
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
    ]

    const handlePrevious = () => {
        const newDate = new Date(selectedDate)
        if (view === 'day') {
            newDate.setDate(newDate.getDate() - 1)
        } else {
            newDate.setDate(newDate.getDate() - 7)
        }
        setSelectedDate(newDate)
    }

    const handleNext = () => {
        const newDate = new Date(selectedDate)
        if (view === 'day') {
            newDate.setDate(newDate.getDate() + 1)
        } else {
            newDate.setDate(newDate.getDate() + 7)
        }
        setSelectedDate(newDate)
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                        className="mr-4"
                    >
                        <ArrowLeft size={24} />
                    </Button>
                    <h1 className="text-2xl font-semibold">Agenda</h1>
                </div>
                <ToggleGroup
                    type="single"
                    value={view}
                    onValueChange={(value) =>
                        value && setView(value as 'day' | 'week')
                    }
                >
                    <ToggleGroupItem value="day">Dia</ToggleGroupItem>
                    <ToggleGroupItem value="week">Semana</ToggleGroupItem>
                </ToggleGroup>
            </div>

            {/* Calendar Navigation */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft size={20} />
                        </Button>
                        <div className="flex items-center">
                            <Calendar
                                size={20}
                                className="mr-2 text-blue-600"
                            />
                            <span className="font-medium">
                                {view === 'day'
                                    ? formatDate(selectedDate)
                                    : `${formatDate(
                                          weekDates[0]
                                      )} - ${formatDate(weekDates[6])}`}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNext}
                        >
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Grid */}
            {view === 'day' ? (
                <Card>
                    <CardContent className="p-0">
                        {timeSlots.map((time) => {
                            const appointment = appointments.find(
                                (apt) =>
                                    apt.date ===
                                        selectedDate
                                            .toISOString()
                                            .split('T')[0] && apt.time === time
                            )

                            return (
                                <div
                                    key={time}
                                    className="flex items-center border-b last:border-b-0 p-4"
                                >
                                    <div className="w-20 flex-shrink-0">
                                        <div className="flex items-center text-gray-600">
                                            <Clock size={16} className="mr-2" />
                                            <span>{time}</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        {appointment ? (
                                            <AppointmentCard
                                                appointment={appointment}
                                                showActions={false}
                                            />
                                        ) : (
                                            <Card className="border border-dashed">
                                                <CardContent className="p-4 text-center text-gray-400">
                                                    Horário Disponível
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="grid grid-cols-8 border-b">
                            <div className="p-4 border-r bg-gray-50"></div>
                            {weekDates.map((date) => (
                                <div
                                    key={date.toISOString()}
                                    className={`p-4 text-center ${
                                        date.toDateString() ===
                                        new Date().toDateString()
                                            ? 'bg-blue-50'
                                            : 'bg-gray-50'
                                    }`}
                                >
                                    <div className="font-medium">
                                        {date.toLocaleDateString('pt-BR', {
                                            weekday: 'short',
                                        })}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {date.getDate()}/{date.getMonth() + 1}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-8">
                            <div className="border-r">
                                {timeSlots.map((time) => (
                                    <div
                                        key={time}
                                        className="p-4 border-b flex items-center justify-center text-gray-600"
                                    >
                                        {time}
                                    </div>
                                ))}
                            </div>

                            {weekDates.map((date) => (
                                <div
                                    key={date.toISOString()}
                                    className="border-r last:border-r-0"
                                >
                                    {timeSlots.map((time) => {
                                        const appointment = appointments.find(
                                            (apt) =>
                                                apt.date ===
                                                    date
                                                        .toISOString()
                                                        .split('T')[0] &&
                                                apt.time === time
                                        )

                                        return (
                                            <div
                                                key={`${date.toISOString()}-${time}`}
                                                className="p-2 border-b h-24"
                                            >
                                                {appointment && (
                                                    <Card className="h-full bg-blue-50 border-blue-200">
                                                        <CardContent className="p-2">
                                                            <div className="font-medium truncate">
                                                                {
                                                                    appointment.type
                                                                }
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="mt-1"
                                                            >
                                                                {
                                                                    appointment.time
                                                                }
                                                            </Badge>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
