'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/providers/auth-provider'
import { useChangePassword, useUpdateProfile } from '@/hooks/use-auth'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatInitials } from '@/utils/format'
import { toast } from 'sonner'
import {
    Settings,
    User,
    Mail,
    Lock,
    Stethoscope,
    Save,
    Eye,
    EyeOff,
    Loader2,
} from 'lucide-react'
import DashboardLayout from '@/components/layout/dashboard-layout'

// Schemas de validação
const profileSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    specialty: z.string().optional(),
})

const passwordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
        newPassword: z
            .string()
            .min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
        confirmPassword: z
            .string()
            .min(1, 'Confirmação de senha é obrigatória'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'Senhas não coincidem',
        path: ['confirmPassword'],
    })

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function SettingsPage() {
    const { user } = useAuth()
    const changePasswordMutation = useChangePassword()
    const updateProfileMutation = useUpdateProfile()

    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Form para perfil
    const profileForm = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            specialty: user?.role === 'DOCTOR' ? user?.specialty || '' : '',
        },
    })

    // Form para senha
    const passwordForm = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    })

    const onUpdateProfile = async (data: ProfileFormData) => {
        try {
            await updateProfileMutation.mutateAsync(data)
            toast.success('Perfil atualizado com sucesso!')
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Erro ao atualizar perfil'
            toast.error(errorMessage)
        }
    }

    const onChangePassword = async (data: PasswordFormData) => {
        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            })
            toast.success('Senha alterada com sucesso!')
            passwordForm.reset()
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : 'Erro ao alterar senha'
            toast.error(errorMessage)
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Settings className="h-6 w-6" />
                        Configurações
                    </h1>
                    <p className="text-gray-600">
                        Gerencie suas informações pessoais e configurações da
                        conta
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar de Configurações */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader className="text-center">
                                <Avatar className="h-20 w-20 mx-auto mb-4">
                                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                                        {formatInitials(user?.name || '')}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle>{user?.name}</CardTitle>
                                <CardDescription>
                                    {user?.role === 'DOCTOR'
                                        ? `Dr. ${user.name}`
                                        : 'Paciente'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        {user?.email}
                                    </div>
                                    {user?.role === 'DOCTOR' &&
                                        user?.specialty && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Stethoscope className="h-4 w-4" />
                                                {user.specialty}
                                            </div>
                                        )}
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User className="h-4 w-4" />
                                        {user?.role === 'DOCTOR'
                                            ? 'Médico'
                                            : 'Paciente'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações do Perfil */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do Perfil</CardTitle>
                                <CardDescription>
                                    Atualize suas informações pessoais
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={profileForm.handleSubmit(
                                        onUpdateProfile
                                    )}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Nome completo
                                            </Label>
                                            <Input
                                                id="name"
                                                {...profileForm.register(
                                                    'name'
                                                )}
                                            />
                                            {profileForm.formState.errors
                                                .name && (
                                                <p className="text-sm text-red-500">
                                                    {
                                                        profileForm.formState
                                                            .errors.name.message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...profileForm.register(
                                                    'email'
                                                )}
                                            />
                                            {profileForm.formState.errors
                                                .email && (
                                                <p className="text-sm text-red-500">
                                                    {
                                                        profileForm.formState
                                                            .errors.email
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {user?.role === 'DOCTOR' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="specialty">
                                                Especialidade
                                            </Label>
                                            <Input
                                                id="specialty"
                                                {...profileForm.register(
                                                    'specialty'
                                                )}
                                                placeholder="Ex: Cardiologia, Dermatologia..."
                                            />
                                            {profileForm.formState.errors
                                                .specialty && (
                                                <p className="text-sm text-red-500">
                                                    {
                                                        profileForm.formState
                                                            .errors.specialty
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={
                                                updateProfileMutation.isPending
                                            }
                                        >
                                            {updateProfileMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Salvar Alterações
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Separator />

                        {/* Alterar Senha */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Alterar Senha</CardTitle>
                                <CardDescription>
                                    Mantenha sua conta segura com uma senha
                                    forte (mínimo 6 caracteres)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={passwordForm.handleSubmit(
                                        onChangePassword
                                    )}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="currentPassword">
                                            Senha atual
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="currentPassword"
                                                type={
                                                    showCurrentPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                {...passwordForm.register(
                                                    'currentPassword'
                                                )}
                                                className="pr-10"
                                                placeholder="Digite sua senha atual"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCurrentPassword(
                                                        !showCurrentPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff />
                                                ) : (
                                                    <Eye />
                                                )}
                                            </button>
                                        </div>
                                        {passwordForm.formState.errors
                                            .currentPassword && (
                                            <p className="text-sm text-red-500">
                                                {
                                                    passwordForm.formState
                                                        .errors.currentPassword
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">
                                                Nova senha
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="newPassword"
                                                    type={
                                                        showNewPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    {...passwordForm.register(
                                                        'newPassword'
                                                    )}
                                                    className="pr-10"
                                                    placeholder="Mínimo 6 caracteres"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff />
                                                    ) : (
                                                        <Eye />
                                                    )}
                                                </button>
                                            </div>
                                            {passwordForm.formState.errors
                                                .newPassword && (
                                                <p className="text-sm text-red-500">
                                                    {
                                                        passwordForm.formState
                                                            .errors.newPassword
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">
                                                Confirmar nova senha
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="confirmPassword"
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    {...passwordForm.register(
                                                        'confirmPassword'
                                                    )}
                                                    className="pr-10"
                                                    placeholder="Confirme a nova senha"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff />
                                                    ) : (
                                                        <Eye />
                                                    )}
                                                </button>
                                            </div>
                                            {passwordForm.formState.errors
                                                .confirmPassword && (
                                                <p className="text-sm text-red-500">
                                                    {
                                                        passwordForm.formState
                                                            .errors
                                                            .confirmPassword
                                                            .message
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-900 mb-2">
                                            Dicas para uma senha segura:
                                        </h4>
                                        <ul className="text-sm text-blue-700 space-y-1">
                                            <li>
                                                • Use pelo menos 6 caracteres
                                            </li>
                                            <li>
                                                • Combine letras maiúsculas e
                                                minúsculas
                                            </li>
                                            <li>• Inclua números e símbolos</li>
                                            <li>
                                                • Evite palavras comuns ou dados
                                                pessoais
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={
                                                changePasswordMutation.isPending
                                            }
                                        >
                                            {changePasswordMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Alterando...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="mr-2 h-4 w-4" />
                                                    Alterar Senha
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <Separator />

                        {/* Informações da Conta */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações da Conta</CardTitle>
                                <CardDescription>
                                    Detalhes sobre sua conta e preferências
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Tipo de conta
                                            </Label>
                                            <p className="text-sm text-gray-900">
                                                {user?.role === 'DOCTOR'
                                                    ? 'Médico'
                                                    : 'Paciente'}
                                            </p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium text-gray-700">
                                                Membro desde
                                            </Label>
                                            <p className="text-sm text-gray-900">
                                                {new Date().toLocaleDateString(
                                                    'pt-BR'
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="text-sm font-medium text-gray-700">
                                            ID da conta
                                        </Label>
                                        <p className="text-sm text-gray-900 font-mono">
                                            {user?.id}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
