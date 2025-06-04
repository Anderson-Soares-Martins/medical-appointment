import { useState } from 'react'
import { ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/lib/store/useStore'
import type { Doctor, User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function DoctorProfile() {
    const navigate = useNavigate()
    const { user } = useStore()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Partial<User & Doctor>>({
        name: user?.name || '',
        email: user?.email || '',
        specialty: user?.specialty || '',
        crm: user?.crm || '',
        rating: 0,
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
                                <Label htmlFor="crm">CRM</Label>
                                <Input
                                    id="crm"
                                    type="text"
                                    value={formData.crm}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            crm: e.target.value,
                                        })
                                    }
                                    disabled={!isEditing}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialty">Especialidade</Label>
                                <Select
                                    disabled={!isEditing}
                                    value={formData.specialty}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            specialty: value,
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma especialidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cardiologia">
                                            Cardiologia
                                        </SelectItem>
                                        <SelectItem value="Dermatologia">
                                            Dermatologia
                                        </SelectItem>
                                        <SelectItem value="Ortopedia">
                                            Ortopedia
                                        </SelectItem>
                                        <SelectItem value="Pediatria">
                                            Pediatria
                                        </SelectItem>
                                        <SelectItem value="Neurologia">
                                            Neurologia
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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

            {/* Statistics */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <CardTitle className="text-lg mb-4">
                            Consultas Realizadas
                        </CardTitle>
                        <div className="text-3xl font-bold text-blue-600">
                            248
                        </div>
                        <p className="text-gray-600 mt-1">Últimos 30 dias</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <CardTitle className="text-lg mb-4">
                            Taxa de Retorno
                        </CardTitle>
                        <div className="text-3xl font-bold text-green-600">
                            85%
                        </div>
                        <p className="text-gray-600 mt-1">
                            Pacientes que retornam
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <CardTitle className="text-lg mb-4">
                            Avaliação Média
                        </CardTitle>
                        <div className="text-3xl font-bold text-yellow-600">
                            4.8
                        </div>
                        <p className="text-gray-600 mt-1">De 5 estrelas</p>
                    </CardContent>
                </Card>
            </div>

            {/* Schedule Settings */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Configurações de Agenda</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">
                                    Duração da Consulta
                                </p>
                                <p className="text-gray-600">
                                    Tempo padrão para cada atendimento
                                </p>
                            </div>
                            <Select disabled={!isEditing} defaultValue="30">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="30">
                                        30 minutos
                                    </SelectItem>
                                    <SelectItem value="45">
                                        45 minutos
                                    </SelectItem>
                                    <SelectItem value="60">1 hora</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">
                                    Intervalo entre Consultas
                                </p>
                                <p className="text-gray-600">
                                    Tempo de preparação
                                </p>
                            </div>
                            <Select disabled={!isEditing} defaultValue="10">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5 minutos</SelectItem>
                                    <SelectItem value="10">
                                        10 minutos
                                    </SelectItem>
                                    <SelectItem value="15">
                                        15 minutos
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between py-3">
                            <div>
                                <p className="font-medium">Notificações</p>
                                <p className="text-gray-600">
                                    Lembretes de consulta
                                </p>
                            </div>
                            <Switch disabled={!isEditing} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
