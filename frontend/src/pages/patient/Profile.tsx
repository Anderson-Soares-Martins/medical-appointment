import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/lib/store/auth'
import { useAppointmentsStore } from '@/lib/store/appointments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PatientProfile() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const { appointments } = useAppointmentsStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // TODO: Implement profile update with API
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        } finally {
            setIsSaving(false)
        }
    }

    const completedAppointments = appointments.filter(
        (apt) => apt.status === 'COMPLETED'
    )

    const lastAppointment = [...appointments]
        .filter((apt) => apt.status === 'COMPLETED')
        .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]

    const nextAppointment = appointments.find(
        (apt) => apt.status === 'SCHEDULED' && new Date(apt.date) > new Date()
    )

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
                    <h1 className="text-2xl font-semibold">Meu Perfil</h1>
                </div>
                {!isEditing && (
                    <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                    >
                        Editar
                    </Button>
                )}
            </div>

            {/* Profile Form */}
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            </div>

                            {isEditing && (
                                <div className="flex justify-end space-x-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSaving}>
                                        {isSaving ? (
                                            'Salvando...'
                                        ) : (
                                            <>
                                                <Save
                                                    size={18}
                                                    className="mr-2"
                                                />
                                                Salvar Alterações
                                            </>
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Medical History Summary */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Histórico Médico</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between py-3">
                            <div>
                                <p className="font-medium">
                                    Total de Consultas
                                </p>
                                <p className="text-gray-600">
                                    {completedAppointments.length} consultas
                                    realizadas
                                </p>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                {completedAppointments.length}
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-3">
                            <div>
                                <p className="font-medium">Última Consulta</p>
                                {lastAppointment ? (
                                    <p className="text-gray-600">
                                        Dr(a). {lastAppointment.doctor.name} -{' '}
                                        {lastAppointment.doctor.specialty}
                                    </p>
                                ) : (
                                    <p className="text-gray-600">
                                        Nenhuma consulta realizada
                                    </p>
                                )}
                            </div>
                            {lastAppointment && (
                                <div className="text-gray-600">
                                    {new Date(
                                        lastAppointment.date
                                    ).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="flex justify-between py-3">
                            <div>
                                <p className="font-medium">Próxima Consulta</p>
                                {nextAppointment ? (
                                    <p className="text-gray-600">
                                        Dr(a). {nextAppointment.doctor.name} -{' '}
                                        {nextAppointment.doctor.specialty}
                                    </p>
                                ) : (
                                    <p className="text-gray-600">
                                        Nenhuma consulta agendada
                                    </p>
                                )}
                            </div>
                            {nextAppointment && (
                                <div className="text-gray-600">
                                    {new Date(
                                        nextAppointment.date
                                    ).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
