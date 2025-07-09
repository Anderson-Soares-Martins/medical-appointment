'use client'

import { useState } from 'react'
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
import { useAuth } from '@/providers/auth-provider'
import { loginSchema, LoginFormData } from '@/utils/validations'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { login } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true)
            await login(data)
            toast.success('Login realizado com sucesso!')
            // O redirecionamento é feito automaticamente pelo AuthProvider
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Erro ao fazer login'
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-blue-600">
                        MedConsult
                    </CardTitle>
                    <CardDescription>
                        Entre com sua conta para acessar o sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        data-testid="login-form"
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                            <div className="relative ">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    data-testid="password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Sua senha"
                                    className="pl-10 pr-10"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-600"
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

                        <Button
                            data-testid="login-button"
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                'Entrar'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">
                            Não tem uma conta?{' '}
                        </span>
                        <Link
                            href="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Cadastre-se
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
    )
}
