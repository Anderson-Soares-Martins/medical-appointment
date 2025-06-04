import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store/useStore'
import type { Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function PatientProfile() {
    const navigate = useNavigate()
    const { user } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Partial<Patient>>({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        dateOfBirth: '',
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            // In a real app, this would call an API endpoint
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to update profile:', error)
        } finally {
            setIsSaving(false)
        }
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

                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dateOfBirth">
                                    Data de Nascimento
                                </Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            dateOfBirth: e.target.value,
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
                                    12 consultas realizadas
                                </p>
                            </div>
                            <div className="text-2xl font-bold text-blue-600">
                                12
                            </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-3">
                            <div>
                                <p className="font-medium">Última Consulta</p>
                                <p className="text-gray-600">
                                    Dr. João Silva - Cardiologia
                                </p>
                            </div>
                            <div className="text-gray-600">15/03/2024</div>
                        </div>
                        <Separator />
                        <div className="flex justify-between py-3">
                            <div>
                                <p className="font-medium">Próxima Consulta</p>
                                <p className="text-gray-600">
                                    Dra. Maria Santos - Dermatologia
                                </p>
                            </div>
                            <div className="text-gray-600">28/03/2024</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
