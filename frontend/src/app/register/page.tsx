'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/providers/auth-provider'
import { registerSchema, RegisterFormData } from '@/utils/validations'
import { toast } from 'sonner'
import {
    Eye,
    EyeOff,
    Loader2,
    Mail,
    Lock,
    User,
    Stethoscope,
} from 'lucide-react'
import AuthRedirect from '@/components/common/auth-redirect'

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>('PATIENT')
    const [isLoading, setIsLoading] = useState(false)
    const { register: registerUser } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'PATIENT',
        },
    })

    useEffect(() => {
        setValue('role', role)
    }, [role, setValue])

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true)
            await registerUser(data)
            toast.success('Conta criada com sucesso!')
            // Redirection is handled automatically by AuthProvider
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Erro ao criar conta'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthRedirect requireAuth={false}>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-blue-600">
                            Criar Conta
                        </CardTitle>
                        <CardDescription>
                            Preencha os dados para se cadastrar no sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            data-testid="register-form"
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="name"
                                        data-testid="name-input"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        className="pl-10"
                                        {...register('name')}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        data-testid="email-input"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="pl-10"
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        data-testid="password-input"
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        placeholder="Sua senha"
                                        className="pl-10 pr-10"
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff /> : <Eye />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Tipo de usuário</Label>
                                <Select
                                    value={role}
                                    onValueChange={(value) =>
                                        setRole(value as 'PATIENT' | 'DOCTOR')
                                    }
                                >
                                    <SelectTrigger data-testid="role-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PATIENT">
                                            <div className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                Paciente
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="DOCTOR">
                                            <div className="flex items-center">
                                                <Stethoscope className="mr-2 h-4 w-4" />
                                                Médico
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-red-500">
                                        {errors.role.message}
                                    </p>
                                )}
                            </div>

                            {role === 'DOCTOR' && (
                                <div className="space-y-2">
                                    <Label htmlFor="specialty">
                                        Especialidade
                                    </Label>
                                    <div className="relative">
                                        <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="specialty"
                                            type="text"
                                            placeholder="Cardiologia, Dermatologia, etc."
                                            className="pl-10"
                                            {...register('specialty')}
                                        />
                                    </div>
                                    {errors.specialty && (
                                        <p className="text-sm text-red-500">
                                            {errors.specialty.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            <Button
                                data-testid="register-button"
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Criando conta...
                                    </>
                                ) : (
                                    'Criar conta'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-600">
                                Já tem uma conta?{' '}
                            </span>
                            <Link
                                href="/login"
                                className="text-blue-600 hover:underline"
                            >
                                Fazer login
                            </Link>
                        </div>

                        <div className="mt-4 text-center text-sm">
                            <Link
                                href="/"
                                className="text-blue-600 hover:underline"
                            >
                                ← Voltar para o início
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthRedirect>
    )
}
