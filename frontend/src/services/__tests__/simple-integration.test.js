// Testes de Integração - Simulação de APIs
// Requisito: Automatização de Testes de Integração

describe('Serviços de API - Testes de Integração', () => {

  // Mock simples do fetch
  const mockFetch = (mockResponse) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      })
    )
  }

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  // Teste 1: Login API
  test('deve realizar login com sucesso', async () => {
    const mockResponse = {
      user: { id: '1', name: 'João Silva', role: 'PATIENT' },
      token: 'jwt-token'
    }
    mockFetch(mockResponse)

    // Simulação do serviço de login
    const loginService = async (credentials) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      return response.json()
    }

    const result = await loginService({
      email: 'joao@email.com',
      password: '123456'
    })

    expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'joao@email.com',
        password: '123456'
      })
    })
    expect(result).toEqual(mockResponse)
  })

  // Teste 2: Buscar Consultas API  
  test('deve buscar consultas do usuário', async () => {
    const mockResponse = {
      appointments: [
        { id: '1', doctorName: 'Dr. Silva', date: '2024-01-15', status: 'SCHEDULED' },
        { id: '2', doctorName: 'Dr. Santos', date: '2024-01-20', status: 'COMPLETED' }
      ]
    }
    mockFetch(mockResponse)

    // Simulação do serviço de consultas
    const appointmentsService = async (token) => {
      const response = await fetch('/api/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      return response.json()
    }

    const result = await appointmentsService('jwt-token')

    expect(fetch).toHaveBeenCalledWith('/api/appointments', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer jwt-token',
        'Content-Type': 'application/json'
      }
    })
    expect(result.appointments).toHaveLength(2)
    expect(result.appointments[0].doctorName).toBe('Dr. Silva')
  })

  // Teste 3: Criar Consulta API
  test('deve criar nova consulta', async () => {
    const mockResponse = {
      appointment: {
        id: 'new-123',
        doctorId: 'doctor-1',
        date: '2024-01-25',
        status: 'SCHEDULED'
      }
    }
    mockFetch(mockResponse)

    // Simulação do serviço de criação de consulta
    const createAppointmentService = async (appointmentData, token) => {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      })
      return response.json()
    }

    const appointmentData = {
      doctorId: 'doctor-1',
      date: '2024-01-25',
      time: '09:00',
      notes: 'Consulta de rotina'
    }

    const result = await createAppointmentService(appointmentData, 'jwt-token')

    expect(fetch).toHaveBeenCalledWith('/api/appointments', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer jwt-token',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(appointmentData)
    })
    expect(result.appointment.id).toBe('new-123')
    expect(result.appointment.status).toBe('SCHEDULED')
  })

  // Teste 4: Buscar Médicos API
  test('deve buscar lista de médicos', async () => {
    const mockResponse = {
      doctors: [
        { id: '1', name: 'Dr. João Silva', specialty: 'Cardiologia' },
        { id: '2', name: 'Dr. Maria Santos', specialty: 'Dermatologia' }
      ]
    }
    mockFetch(mockResponse)

    // Simulação do serviço de médicos
    const doctorsService = async () => {
      const response = await fetch('/api/users/doctors', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      return response.json()
    }

    const result = await doctorsService()

    expect(fetch).toHaveBeenCalledWith('/api/users/doctors', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    expect(result.doctors).toHaveLength(2)
    expect(result.doctors[0].specialty).toBe('Cardiologia')
    expect(result.doctors[1].specialty).toBe('Dermatologia')
  })

  // Teste 5: Tratamento de erro de API
  test('deve tratar erro de API corretamente', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Token inválido' })
      })
    )

    // Simulação do serviço com tratamento de erro
    const protectedService = async (token) => {
      const response = await fetch('/api/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      return response.json()
    }

    await expect(protectedService('invalid-token')).rejects.toThrow('Token inválido')
  })
}) 