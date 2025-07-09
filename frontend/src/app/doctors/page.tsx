'use client'

import { useAuth } from '@/providers/auth-provider'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, User, Star } from 'lucide-react'

// Mock data for testing
const mockDoctors = [
    {
        id: '1',
        name: 'Dr. João Silva',
        email: 'dr.silva@clinic.com',
        specialty: 'Cardiologia',
        phone: '(11) 99999-9999',
        rating: 4.8,
        experience: '15 anos',
    },
    {
        id: '2',
        name: 'Dra. Maria Santos',
        email: 'dr.maria@clinic.com',
        specialty: 'Dermatologia',
        phone: '(11) 88888-8888',
        rating: 4.9,
        experience: '10 anos',
    },
]

export default function DoctorsPage() {
    const { user } = useAuth()

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Médicos
                    </h1>
                    <p className="text-gray-600">
                        Lista de médicos disponíveis
                    </p>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar médico por nome ou especialidade..."
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Doctors List */}
                <div className="space-y-4">
                    {mockDoctors.map((doctor) => (
                        <Card key={doctor.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                                            <User className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {doctor.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {doctor.email}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary">
                                                    {doctor.specialty}
                                                </Badge>
                                                <span className="text-sm text-gray-500">
                                                    •
                                                </span>
                                                <span className="text-sm text-gray-600">
                                                    {doctor.experience}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 mb-1">
                                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                            <span className="font-medium">
                                                {doctor.rating}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {doctor.phone}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {user?.role === 'PATIENT' && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-gray-600 mb-4">
                                    Encontrou o médico ideal? Agende sua
                                    consulta agora!
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    )
}
