import {
    formatAppointmentStatus,
    getStatusColor,
    formatUserRole,
    formatName,
    formatInitials,
    formatSpecialty,
    formatPlaceholder,
    formatCPF,
    formatPhone,
    formatEmail,
} from '../format'
import { AppointmentStatus, UserRole } from '@/types'

describe('Format Utils - Testes Unitários', () => {
    describe('formatAppointmentStatus', () => {
        it('deve formatar status SCHEDULED corretamente', () => {
            expect(
                formatAppointmentStatus('SCHEDULED' as AppointmentStatus)
            ).toBe('Agendada')
        })

        it('deve formatar status COMPLETED corretamente', () => {
            expect(
                formatAppointmentStatus('COMPLETED' as AppointmentStatus)
            ).toBe('Concluída')
        })

        it('deve formatar status CANCELLED corretamente', () => {
            expect(
                formatAppointmentStatus('CANCELLED' as AppointmentStatus)
            ).toBe('Cancelada')
        })

        it('deve formatar status NO_SHOW corretamente', () => {
            expect(
                formatAppointmentStatus('NO_SHOW' as AppointmentStatus)
            ).toBe('Faltou')
        })

        it('deve retornar o status original para status não mapeado', () => {
            expect(
                formatAppointmentStatus('UNKNOWN' as AppointmentStatus)
            ).toBe('UNKNOWN')
        })
    })

    describe('getStatusColor', () => {
        it('deve retornar cor azul para SCHEDULED', () => {
            expect(getStatusColor('SCHEDULED' as AppointmentStatus)).toBe(
                'blue'
            )
        })

        it('deve retornar cor verde para COMPLETED', () => {
            expect(getStatusColor('COMPLETED' as AppointmentStatus)).toBe(
                'green'
            )
        })

        it('deve retornar cor vermelha para CANCELLED', () => {
            expect(getStatusColor('CANCELLED' as AppointmentStatus)).toBe('red')
        })

        it('deve retornar cor amarela para NO_SHOW', () => {
            expect(getStatusColor('NO_SHOW' as AppointmentStatus)).toBe(
                'yellow'
            )
        })

        it('deve retornar cor cinza para status desconhecido', () => {
            expect(getStatusColor('UNKNOWN' as AppointmentStatus)).toBe('gray')
        })
    })

    describe('formatUserRole', () => {
        it('deve formatar role PATIENT corretamente', () => {
            expect(formatUserRole('PATIENT' as UserRole)).toBe('Paciente')
        })

        it('deve formatar role DOCTOR corretamente', () => {
            expect(formatUserRole('DOCTOR' as UserRole)).toBe('Médico')
        })

        it('deve retornar role original para role não mapeado', () => {
            expect(formatUserRole('ADMIN' as UserRole)).toBe('ADMIN')
        })
    })

    describe('formatName', () => {
        it('deve formatar nome corretamente', () => {
            expect(formatName('JOÃO SILVA')).toBe('João Silva')
        })

        it('deve tratar nome em minúsculo', () => {
            expect(formatName('maria santos')).toBe('Maria Santos')
        })

        it('deve tratar nome misto', () => {
            expect(formatName('ANA mArIa DOS sAnToS')).toBe(
                'Ana Maria Dos Santos'
            )
        })

        it('deve tratar nome vazio', () => {
            expect(formatName('')).toBe('')
        })
    })

    describe('formatInitials', () => {
        it('deve retornar iniciais de nome completo', () => {
            expect(formatInitials('João Silva')).toBe('JS')
        })

        it('deve retornar iniciais de nome com mais de 2 palavras', () => {
            expect(formatInitials('Ana Maria Santos')).toBe('AM')
        })

        it('deve retornar inicial de nome único', () => {
            expect(formatInitials('João')).toBe('J')
        })

        it('deve tratar nome vazio', () => {
            expect(formatInitials('')).toBe('')
        })
    })

    describe('formatSpecialty', () => {
        it('deve formatar especialidade corretamente', () => {
            expect(formatSpecialty('CARDIOLOGIA')).toBe('Cardiologia')
        })

        it('deve tratar especialidade em minúsculo', () => {
            expect(formatSpecialty('dermatologia')).toBe('Dermatologia')
        })

        it('deve tratar especialidade vazia', () => {
            expect(formatSpecialty('')).toBe('')
        })
    })

    describe('formatPlaceholder', () => {
        it('deve manter texto menor que o limite', () => {
            expect(formatPlaceholder('Texto curto', 20)).toBe('Texto curto')
        })

        it('deve truncar texto maior que o limite', () => {
            expect(formatPlaceholder('Este é um texto muito longo', 10)).toBe(
                'Este é um...'
            )
        })

        it('deve usar limite padrão de 100', () => {
            const longText = 'a'.repeat(150)
            const result = formatPlaceholder(longText)
            expect(result).toBe('a'.repeat(100) + '...')
        })
    })

    describe('formatCPF', () => {
        it('deve formatar CPF corretamente', () => {
            expect(formatCPF('12345678901')).toBe('123.456.789-01')
        })

        it('deve manter CPF já formatado', () => {
            expect(formatCPF('123.456.789-01')).toBe('123.456.789-01')
        })

        it('deve retornar original para CPF inválido', () => {
            expect(formatCPF('123')).toBe('123')
        })
    })

    describe('formatPhone', () => {
        it('deve formatar telefone com 11 dígitos', () => {
            expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
        })

        it('deve formatar telefone com 10 dígitos', () => {
            expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
        })

        it('deve retornar original para telefone inválido', () => {
            expect(formatPhone('123')).toBe('123')
        })
    })

    describe('formatEmail', () => {
        it('deve converter email para minúsculo', () => {
            expect(formatEmail('TESTE@EMAIL.COM')).toBe('teste@email.com')
        })

        it('deve remover espaços', () => {
            expect(formatEmail(' teste@email.com ')).toBe('teste@email.com')
        })

        it('deve tratar email já formatado', () => {
            expect(formatEmail('teste@email.com')).toBe('teste@email.com')
        })
    })
})
