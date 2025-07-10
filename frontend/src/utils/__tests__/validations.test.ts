import {
    loginSchema,
    registerSchema,
    appointmentSchema,
    changePasswordSchema,
    profileSchema,
    searchSchema,
} from '../validations'

describe('Validations - Testes Unitários', () => {
    describe('loginSchema', () => {
        it('deve validar login correto', () => {
            const validData = {
                email: 'test@email.com',
                password: '123456',
            }
            const result = loginSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve rejeitar email inválido', () => {
            const invalidData = {
                email: 'email-invalido',
                password: '123456',
            }
            const result = loginSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })

        it('deve rejeitar senha muito curta', () => {
            const invalidData = {
                email: 'test@email.com',
                password: '12345',
            }
            const result = loginSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })

        it('deve rejeitar campos vazios', () => {
            const invalidData = {
                email: '',
                password: '',
            }
            const result = loginSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })
    })

    describe('registerSchema', () => {
        it('deve validar registro de paciente correto', () => {
            const validData = {
                name: 'João Silva',
                email: 'joao@email.com',
                password: '123456',
                role: 'PATIENT' as const,
            }
            const result = registerSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve validar registro de médico com especialidade', () => {
            const validData = {
                name: 'Dr. João Silva',
                email: 'dr.joao@email.com',
                password: '123456',
                role: 'DOCTOR' as const,
                specialty: 'Cardiologia',
            }
            const result = registerSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve rejeitar nome muito curto', () => {
            const invalidData = {
                name: 'A',
                email: 'test@email.com',
                password: '123456',
                role: 'PATIENT' as const,
            }
            const result = registerSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })

        it('deve rejeitar role inválido', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'joao@email.com',
                password: '123456',
                role: 'ADMIN' as any,
            }
            const result = registerSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })
    })

    describe('appointmentSchema', () => {
        it('deve validar agendamento correto', () => {
            const validData = {
                doctorId: 'doctor-123',
                date: '2024-01-15',
                time: '09:00',
                notes: 'Consulta de rotina',
            }
            const result = appointmentSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve validar agendamento sem notas', () => {
            const validData = {
                doctorId: 'doctor-123',
                date: '2024-01-15',
                time: '09:00',
            }
            const result = appointmentSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve rejeitar agendamento sem médico', () => {
            const invalidData = {
                doctorId: '',
                date: '2024-01-15',
                time: '09:00',
            }
            const result = appointmentSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })

        it('deve rejeitar agendamento sem data', () => {
            const invalidData = {
                doctorId: 'doctor-123',
                date: '',
                time: '09:00',
            }
            const result = appointmentSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })

        it('deve rejeitar agendamento sem horário', () => {
            const invalidData = {
                doctorId: 'doctor-123',
                date: '2024-01-15',
                time: '',
            }
            const result = appointmentSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })
    })

    describe('changePasswordSchema', () => {
        it('deve validar mudança de senha correta', () => {
            const validData = {
                currentPassword: 'senha123',
                newPassword: 'novaSenha123',
                confirmPassword: 'novaSenha123',
            }
            const result = changePasswordSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve rejeitar senhas que não coincidem', () => {
            const invalidData = {
                currentPassword: 'senha123',
                newPassword: 'novaSenha123',
                confirmPassword: 'senhasDiferentes',
            }
            const result = changePasswordSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })

        it('deve rejeitar nova senha muito curta', () => {
            const invalidData = {
                currentPassword: 'senha123',
                newPassword: '12345',
                confirmPassword: '12345',
            }
            const result = changePasswordSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })
    })

    describe('profileSchema', () => {
        it('deve validar perfil correto', () => {
            const validData = {
                name: 'João Silva',
                email: 'joao@email.com',
                specialty: 'Cardiologia',
            }
            const result = profileSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve validar perfil sem especialidade', () => {
            const validData = {
                name: 'João Silva',
                email: 'joao@email.com',
            }
            const result = profileSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })
    })

    describe('searchSchema', () => {
        it('deve validar busca correta', () => {
            const validData = {
                query: 'Dr. João',
            }
            const result = searchSchema.safeParse(validData)
            expect(result.success).toBe(true)
        })

        it('deve rejeitar busca vazia', () => {
            const invalidData = {
                query: '',
            }
            const result = searchSchema.safeParse(invalidData)
            expect(result.success).toBe(false)
        })
    })
})
