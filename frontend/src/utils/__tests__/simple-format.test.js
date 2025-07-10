// Testes Unitários - Funções de Formatação
// Requisito: Automatização de Testes Unitários

describe('Formatação de Status - Testes Unitários', () => {

  // Teste 1: Formatação de status de consulta
  test('deve formatar status SCHEDULED para Agendada', () => {
    const formatAppointmentStatus = (status) => {
      const statusMap = {
        'SCHEDULED': 'Agendada',
        'COMPLETED': 'Concluída',
        'CANCELLED': 'Cancelada',
        'NO_SHOW': 'Faltou',
      }
      return statusMap[status] || status
    }

    expect(formatAppointmentStatus('SCHEDULED')).toBe('Agendada')
    expect(formatAppointmentStatus('COMPLETED')).toBe('Concluída')
    expect(formatAppointmentStatus('CANCELLED')).toBe('Cancelada')
    expect(formatAppointmentStatus('NO_SHOW')).toBe('Faltou')
  })

  // Teste 2: Formatação de cores por status
  test('deve retornar cor correta para cada status', () => {
    const getStatusColor = (status) => {
      const colorMap = {
        'SCHEDULED': 'blue',
        'COMPLETED': 'green',
        'CANCELLED': 'red',
        'NO_SHOW': 'yellow',
      }
      return colorMap[status] || 'gray'
    }

    expect(getStatusColor('SCHEDULED')).toBe('blue')
    expect(getStatusColor('COMPLETED')).toBe('green')
    expect(getStatusColor('CANCELLED')).toBe('red')
    expect(getStatusColor('NO_SHOW')).toBe('yellow')
    expect(getStatusColor('UNKNOWN')).toBe('gray')
  })

  // Teste 3: Formatação de nomes
  test('deve formatar nomes corretamente', () => {
    const formatName = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }

    expect(formatName('JOÃO SILVA')).toBe('João Silva')
    expect(formatName('maria santos')).toBe('Maria Santos')
    expect(formatName('ANA mArIa DOS sAnToS')).toBe('Ana Maria Dos Santos')
  })

  // Teste 4: Formatação de iniciais
  test('deve extrair iniciais corretamente', () => {
    const formatInitials = (name) => {
      return name
        .split(' ')
        .map(word => word.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase()
    }

    expect(formatInitials('João Silva')).toBe('JS')
    expect(formatInitials('Ana Maria Santos')).toBe('AM')
    expect(formatInitials('Pedro')).toBe('P')
  })

  // Teste 5: Validação de email
  test('deve validar email corretamente', () => {
    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    expect(isValidEmail('test@email.com')).toBe(true)
    expect(isValidEmail('user@domain.org')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
  })
}) 