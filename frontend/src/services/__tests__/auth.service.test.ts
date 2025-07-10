import { authService } from '../auth.service'
import { LoginRequest, RegisterRequest } from '@/types'

// Mock do módulo API
jest.mock('../api', () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
        get: jest.fn(),
    },
}))

import api from '../api'

const mockApi = api as jest.Mocked<typeof api>

describe('AuthService - Testes de Integração', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('login', () => {
        it('deve fazer login com sucesso', async () => {
            const mockResponse = {
                data: {
                    user: {
                        id: '1',
                        name: 'João Silva',
                        email: 'joao@email.com',
                        role: 'PATIENT',
                    },
                    token: 'jwt-token',
                    refreshToken: 'refresh-token',
                },
            }

            mockApi.post.mockResolvedValue(mockResponse)

            const loginData: LoginRequest = {
                email: 'joao@email.com',
                password: '123456',
            }

            const result = await authService.login(loginData)

            expect(mockApi.post).toHaveBeenCalledWith('/auth/login', loginData)
            expect(result).toEqual(mockResponse.data)
        })

        it('deve rejeitar login com credenciais inválidas', async () => {
            const mockError = new Error('Credenciais inválidas')
            mockApi.post.mockRejectedValue(mockError)

            const loginData: LoginRequest = {
                email: 'joao@email.com',
                password: 'senha-errada',
            }

            await expect(authService.login(loginData)).rejects.toThrow(
                'Credenciais inválidas'
            )
            expect(mockApi.post).toHaveBeenCalledWith('/auth/login', loginData)
        })
    })

    describe('register', () => {
        it('deve registrar paciente com sucesso', async () => {
            const mockResponse = {
                data: {
                    user: {
                        id: '2',
                        name: 'Maria Santos',
                        email: 'maria@email.com',
                        role: 'PATIENT',
                    },
                    token: 'jwt-token',
                    refreshToken: 'refresh-token',
                },
            }

            mockApi.post.mockResolvedValue(mockResponse)

            const registerData: RegisterRequest = {
                name: 'Maria Santos',
                email: 'maria@email.com',
                password: '123456',
                role: 'PATIENT',
            }

            const result = await authService.register(registerData)

            expect(mockApi.post).toHaveBeenCalledWith(
                '/auth/register',
                registerData
            )
            expect(result).toEqual(mockResponse.data)
        })

        it('deve registrar médico com especialidade', async () => {
            const mockResponse = {
                data: {
                    user: {
                        id: '3',
                        name: 'Dr. João Silva',
                        email: 'dr.joao@email.com',
                        role: 'DOCTOR',
                        specialty: 'Cardiologia',
                    },
                    token: 'jwt-token',
                    refreshToken: 'refresh-token',
                },
            }

            mockApi.post.mockResolvedValue(mockResponse)

            const registerData: RegisterRequest = {
                name: 'Dr. João Silva',
                email: 'dr.joao@email.com',
                password: '123456',
                role: 'DOCTOR',
                specialty: 'Cardiologia',
            }

            const result = await authService.register(registerData)

            expect(mockApi.post).toHaveBeenCalledWith(
                '/auth/register',
                registerData
            )
            expect(result).toEqual(mockResponse.data)
        })
    })

    describe('getProfile', () => {
        it('deve buscar perfil do usuário', async () => {
            const mockResponse = {
                data: {
                    id: '1',
                    name: 'João Silva',
                    email: 'joao@email.com',
                    role: 'PATIENT',
                },
            }

            mockApi.get.mockResolvedValue(mockResponse)

            const result = await authService.getProfile()

            expect(mockApi.get).toHaveBeenCalledWith('/auth/profile')
            expect(result).toEqual(mockResponse.data)
        })

        it('deve tratar erro de token inválido', async () => {
            const mockError = new Error('Token inválido')
            mockApi.get.mockRejectedValue(mockError)

            await expect(authService.getProfile()).rejects.toThrow(
                'Token inválido'
            )
            expect(mockApi.get).toHaveBeenCalledWith('/auth/profile')
        })
    })

    describe('logout', () => {
        it('deve fazer logout com sucesso', async () => {
            const mockResponse = {
                data: { message: 'Logout realizado com sucesso' },
            }
            mockApi.post.mockResolvedValue(mockResponse)

            const result = await authService.logout()

            expect(mockApi.post).toHaveBeenCalledWith('/auth/logout')
            expect(result).toEqual(mockResponse.data)
        })
    })

    describe('refreshToken', () => {
        it('deve renovar token com sucesso', async () => {
            const mockResponse = {
                data: {
                    token: 'novo-jwt-token',
                    refreshToken: 'novo-refresh-token',
                },
            }

            mockApi.post.mockResolvedValue(mockResponse)

            const result = await authService.refreshToken('refresh-token')

            expect(mockApi.post).toHaveBeenCalledWith('/auth/refresh', {
                refreshToken: 'refresh-token',
            })
            expect(result).toEqual(mockResponse.data)
        })
    })
})
