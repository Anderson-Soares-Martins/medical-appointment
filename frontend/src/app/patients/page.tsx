'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import DashboardLayout from '@/components/layout/dashboard-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, User } from 'lucide-react'

// Mock data for testing
const mockPatients = [
    {
        id: '1',
        name: 'Carlos Silva',
        email: 'carlos@email.com',
        phone: '(11) 99999-9999',
        lastAppointment: '2024-01-15',
    },
    {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        phone: '(11) 88888-8888',
        lastAppointment: '2024-01-20',
    },
]

export default function PatientsPage() {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Redirect patients to dashboard
        if (user?.role === 'PATIENT') {
            router.push('/dashboard')
        }
    }, [user, router])

    if (user?.role === 'PATIENT') {
        return null
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Pacientes
                    </h1>
                    <p className="text-gray-600">Gerencie seus pacientes</p>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Buscar paciente por nome ou email..."
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Patients List */}
                <div className="space-y-4">
                    {mockPatients.map((patient) => (
                        <Card key={patient.id}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">
                                                {patient.name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {patient.email}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {patient.phone}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            Última consulta
                                        </p>
                                        <p className="font-medium">
                                            {patient.lastAppointment}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
