import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    password: z
        .string()
        .min(1, 'Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    password: z
        .string()
        .min(1, 'Senha é obrigatória')
        .min(6, 'Senha deve ter pelo menos 6 caracteres')
        .max(100, 'Senha deve ter no máximo 100 caracteres'),
    role: z.enum(['PATIENT', 'DOCTOR'], {
        required_error: 'Tipo de usuário é obrigatório',
    }),
    specialty: z.string().optional(),
})

export const appointmentSchema = z.object({
    doctorId: z.string().min(1, 'Selecione um médico'),
    date: z.string().min(1, 'Selecione uma data'),
    time: z.string().min(1, 'Selecione um horário'),
    notes: z.string().optional(),
})

export const updateAppointmentSchema = z.object({
    status: z
        .enum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
        .optional(),
    notes: z.string().optional(),
})

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
        newPassword: z
            .string()
            .min(1, 'Nova senha é obrigatória')
            .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
            .max(100, 'Nova senha deve ter no máximo 100 caracteres'),
        confirmPassword: z
            .string()
            .min(1, 'Confirmação de senha é obrigatória'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'As senhas não coincidem',
        path: ['confirmPassword'],
    })

export const profileSchema = z.object({
    name: z
        .string()
        .min(1, 'Nome é obrigatório')
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
    specialty: z.string().optional(),
})

export const searchSchema = z.object({
    query: z.string().min(1, 'Busca é obrigatória'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type AppointmentFormData = z.infer<typeof appointmentSchema>
export type UpdateAppointmentFormData = z.infer<typeof updateAppointmentSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>
export type ProfileFormData = z.infer<typeof profileSchema>
export type SearchFormData = z.infer<typeof searchSchema>
