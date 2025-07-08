import type { User } from '../types'

// Usuários de teste
const mockUsers = {
    'paciente@exemplo.com': {
        id: '1',
        name: 'Maria Silva',
        email: 'paciente@exemplo.com',
        role: 'PATIENT' as const,
    },
    'medico@exemplo.com': {
        id: '2',
        name: 'Dr. Carlos Mendes',
        email: 'medico@exemplo.com',
        role: 'DOCTOR' as const,
        specialty: 'Cardiologia',
        crm: '12345-SP',
    },
}

// Senhas de teste (em uma aplicação real, isso seria armazenado de forma segura no backend)
const mockPasswords = {
    'paciente@exemplo.com': '123456',
    'medico@exemplo.com': '123456',
}

export const mockAuthApi = {
    login: async (
        email: string,
        password: string
    ): Promise<{ user: User; token: string }> => {
        // Simula um delay de rede
        await new Promise((resolve) => setTimeout(resolve, 500))

        const user = mockUsers[email as keyof typeof mockUsers]
        const correctPassword =
            mockPasswords[email as keyof typeof mockPasswords]

        if (!user || password !== correctPassword) {
            throw new Error('Credenciais inválidas')
        }

        return {
            user,
            token: 'mock-jwt-token',
        }
    },
}
