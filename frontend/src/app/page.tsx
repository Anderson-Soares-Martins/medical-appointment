import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Calendar, Users, Clock, Shield } from 'lucide-react'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-blue-600">
                                MedConsult
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" asChild>
                                <Link href="/login">Entrar</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Cadastrar</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Sistema de Gestão de Consultas Médicas
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Simplifique o agendamento e gerenciamento de consultas
                        médicas com nossa plataforma completa. Para pacientes e
                        profissionais da saúde.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" asChild>
                            <Link href="/register">Começar Agora</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Fazer Login</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Funcionalidades
                        </h3>
                        <p className="text-lg text-gray-600">
                            Tudo que você precisa para gerenciar consultas
                            médicas
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card>
                            <CardHeader>
                                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Agendamento</CardTitle>
                                <CardDescription>
                                    Agende consultas de forma rápida e fácil
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Sistema intuitivo para marcar e gerenciar
                                    horários de consultas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Users className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Gestão de Pacientes</CardTitle>
                                <CardDescription>
                                    Controle completo de informações
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Mantenha histórico e dados dos pacientes
                                    organizados.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Horários Flexíveis</CardTitle>
                                <CardDescription>
                                    Disponibilidade em tempo real
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Visualize e gerencie disponibilidade de
                                    horários facilmente.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                                <CardTitle>Segurança</CardTitle>
                                <CardDescription>
                                    Dados protegidos e seguros
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600">
                                    Protocolos de segurança para proteger
                                    informações médicas.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">
                        Pronto para começar?
                    </h3>
                    <p className="text-xl text-blue-100 mb-8">
                        Crie sua conta e comece a gerenciar suas consultas hoje
                        mesmo.
                    </p>
                    <Button size="lg" variant="secondary" asChild>
                        <Link href="/register">Criar Conta Gratuita</Link>
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h4 className="text-lg font-semibold mb-2">
                            MedConsult
                        </h4>
                        <p className="text-gray-400">
                            Sistema de Gestão de Consultas Médicas
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
