/// <reference types="cypress" />

describe('Patient Appointments Management', () => {
  beforeEach(() => {
    // Login como paciente Maria
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Aguarda redirecionamento e visita página de consultas
    cy.url().should('include', '/dashboard')
    cy.visit('/appointments')
    cy.url().should('include', '/appointments')
    cy.wait(3000) // Aguarda carregamento completo
  })

  it('should display complete list of patient appointments', () => {
    // Verifica se página de consultas carregou
    cy.get('[data-testid="appointments-page"]').should('be.visible')
    cy.contains('Minhas Consultas').should('be.visible')
    cy.contains('Gerencie suas consultas médicas').should('be.visible')

    // Verifica se há consultas ou estado vazio
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="appointment-card"]').length > 0) {
        // Tem consultas - verifica estrutura
        cy.get('[data-testid="appointment-card"]').should('have.length.at.least', 1)

        // Verifica contador de consultas
        cy.get('[data-testid="total-appointments"]').should('be.visible')
        cy.contains('consulta').should('be.visible')

        // Verifica informações das consultas
        cy.get('[data-testid="appointment-card"]').first().within(() => {
          cy.contains('Dra.').should('be.visible') // Nome do médico
          cy.contains(':').should('be.visible') // Horário
          cy.contains('2024').should('be.visible') // Data
        })
      } else {
        // Estado vazio
        cy.contains('Nenhuma consulta agendada').should('be.visible')
        cy.contains('Que tal agendar sua primeira consulta?').should('be.visible')
        cy.get('[data-testid="schedule-first-appointment"]').should('be.visible')
      }
    })
  })

  it('should show specific appointment details with Dra. Ana Costa', () => {
    // Mock de consulta específica com Dra. Ana Costa
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-001',
          doctorId: 'doc-ana-123',
          doctorName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          date: '2024-02-15',
          time: '09:00',
          status: 'SCHEDULED',
          reason: 'Consulta dermatológica de rotina',
          location: 'Consultório 201'
        },
        {
          id: 'apt-002',
          doctorId: 'doc-joao-456',
          doctorName: 'Dr. João Silva',
          specialty: 'Cardiologia',
          date: '2024-02-20',
          time: '14:30',
          status: 'SCHEDULED',
          reason: 'Consulta cardiológica - dor no peito',
          location: 'Consultório 105'
        }
      ]
    }).as('appointmentsList')

    // Recarrega página para pegar dados mockados
    cy.reload()
    cy.wait('@appointmentsList')

    // Verifica consulta com Dra. Ana Costa
    cy.get('[data-testid="appointment-card"]').contains('Dra. Ana Costa').parent().within(() => {
      cy.contains('Dra. Ana Costa').should('be.visible')
      cy.contains('Dermatologia').should('be.visible')
      cy.contains('09:00').should('be.visible')
      cy.contains('15/02/2024').should('be.visible')
      cy.contains('Agendada').should('be.visible')
      cy.contains('Consulta dermatológica de rotina').should('be.visible')
      cy.contains('Consultório 201').should('be.visible')
    })

    // Verifica consulta com Dr. João Silva
    cy.get('[data-testid="appointment-card"]').contains('Dr. João Silva').parent().within(() => {
      cy.contains('Dr. João Silva').should('be.visible')
      cy.contains('Cardiologia').should('be.visible')
      cy.contains('14:30').should('be.visible')
      cy.contains('20/02/2024').should('be.visible')
      cy.contains('Agendada').should('be.visible')
      cy.contains('Consulta cardiológica - dor no peito').should('be.visible')
      cy.contains('Consultório 105').should('be.visible')
    })
  })

  it('should cancel appointment with specific reason', () => {
    // Mock de consulta para cancelar
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-cancel-001',
          doctorName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          date: '2024-02-25',
          time: '10:00',
          status: 'SCHEDULED',
          reason: 'Consulta de rotina'
        }
      ]
    }).as('appointmentsToCancel')

    // Mock de cancelamento bem-sucedido
    cy.intercept('PUT', '**/api/appointments/apt-cancel-001/cancel', {
      statusCode: 200,
      body: {
        message: 'Consulta cancelada com sucesso',
        appointment: {
          id: 'apt-cancel-001',
          status: 'CANCELLED'
        }
      }
    }).as('cancelAppointment')

    cy.reload()
    cy.wait('@appointmentsToCancel')

    // Clica no botão de cancelar da consulta com Dra. Ana Costa
    cy.get('[data-testid="appointment-card"]').contains('Dra. Ana Costa').parent().within(() => {
      cy.get('[data-testid="cancel-button"]').click()
    })

    // Verifica modal de cancelamento
    cy.get('[data-testid="cancel-modal"]').should('be.visible')
    cy.contains('Cancelar Consulta').should('be.visible')
    cy.contains('Tem certeza que deseja cancelar').should('be.visible')

    // Seleciona motivo do cancelamento
    cy.get('[data-testid="cancel-reason"]').select('Conflito de agenda')
    cy.get('[data-testid="cancel-reason"]').should('have.value', 'Conflito de agenda')

    // Adiciona observação
    cy.get('[data-testid="cancel-notes"]').type('Preciso remarcar devido a compromisso de trabalho')

    // Confirma cancelamento
    cy.get('[data-testid="confirm-cancel"]').click()

    cy.wait('@cancelAppointment')

    // Verifica sucesso do cancelamento
    cy.contains('Consulta cancelada com sucesso').should('be.visible')
    cy.contains('Dra. Ana Costa').should('be.visible')

    // Status deve ter mudado para cancelada
    cy.get('[data-testid="appointment-card"]').contains('Dra. Ana Costa').parent().within(() => {
      cy.contains('Cancelada').should('be.visible')
      cy.get('[data-testid="cancel-button"]').should('not.exist')
    })
  })

  it('should filter appointments by status', () => {
    // Mock de consultas com diferentes status
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-001',
          doctorName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          date: '2024-02-15',
          time: '09:00',
          status: 'SCHEDULED'
        },
        {
          id: 'apt-002',
          doctorName: 'Dr. João Silva',
          specialty: 'Cardiologia',
          date: '2024-02-10',
          time: '14:00',
          status: 'COMPLETED'
        },
        {
          id: 'apt-003',
          doctorName: 'Dra. Maria Santos',
          specialty: 'Pediatria',
          date: '2024-02-05',
          time: '11:00',
          status: 'CANCELLED'
        }
      ]
    }).as('appointmentsWithStatus')

    cy.reload()
    cy.wait('@appointmentsWithStatus')

    // Verifica filtro por status
    cy.get('[data-testid="status-filter"]').should('be.visible')
    cy.get('[data-testid="status-filter"]').select('SCHEDULED')
    cy.wait(500)

    // Deve mostrar apenas consultas agendadas
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Agendada').should('be.visible')
    cy.get('body').should('not.contain', 'Concluída')
    cy.get('body').should('not.contain', 'Cancelada')

    // Filtra por consultas concluídas
    cy.get('[data-testid="status-filter"]').select('COMPLETED')
    cy.wait(500)

    // Deve mostrar apenas consultas concluídas
    cy.contains('Dr. João Silva').should('be.visible')
    cy.contains('Concluída').should('be.visible')
    cy.get('body').should('not.contain', 'Agendada')

    // Filtra por consultas canceladas
    cy.get('[data-testid="status-filter"]').select('CANCELLED')
    cy.wait(500)

    // Deve mostrar apenas consultas canceladas
    cy.contains('Dra. Maria Santos').should('be.visible')
    cy.contains('Cancelada').should('be.visible')
    cy.get('body').should('not.contain', 'Agendada')

    // Volta para mostrar todas
    cy.get('[data-testid="status-filter"]').select('ALL')
    cy.wait(500)

    // Deve mostrar todas as consultas
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dr. João Silva').should('be.visible')
    cy.contains('Dra. Maria Santos').should('be.visible')
  })

  it('should search appointments by doctor name', () => {
    // Mock de consultas para busca
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-001',
          doctorName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          date: '2024-02-15',
          time: '09:00',
          status: 'SCHEDULED'
        },
        {
          id: 'apt-002',
          doctorName: 'Dr. João Silva',
          specialty: 'Cardiologia',
          date: '2024-02-20',
          time: '14:00',
          status: 'SCHEDULED'
        }
      ]
    }).as('appointmentsForSearch')

    cy.reload()
    cy.wait('@appointmentsForSearch')

    // Busca por "Ana"
    cy.get('[data-testid="search-input"]').should('be.visible')
    cy.get('[data-testid="search-input"]').type('Ana')
    cy.wait(1000)

    // Deve mostrar apenas consultas com Dra. Ana Costa
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')
    cy.get('body').should('not.contain', 'Dr. João Silva')

    // Limpa busca
    cy.get('[data-testid="search-input"]').clear()
    cy.wait(500)

    // Deve mostrar todas as consultas novamente
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dr. João Silva').should('be.visible')

    // Busca por especialidade
    cy.get('[data-testid="search-input"]').type('Cardiologia')
    cy.wait(1000)

    // Deve mostrar apenas consultas de Cardiologia
    cy.contains('Dr. João Silva').should('be.visible')
    cy.contains('Cardiologia').should('be.visible')
    cy.get('body').should('not.contain', 'Dra. Ana Costa')
  })

  it('should show appointment details when clicked', () => {
    // Mock de consulta detalhada
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-details-001',
          doctorName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          date: '2024-02-15',
          time: '09:00',
          status: 'SCHEDULED',
          reason: 'Consulta dermatológica de rotina',
          location: 'Consultório 201',
          notes: 'Avaliação de manchas na pele'
        }
      ]
    }).as('appointmentDetails')

    cy.reload()
    cy.wait('@appointmentDetails')

    // Clica na consulta para ver detalhes
    cy.get('[data-testid="appointment-card"]').contains('Dra. Ana Costa').click()

    // Verifica modal de detalhes
    cy.get('[data-testid="appointment-details-modal"]').should('be.visible')
    cy.contains('Detalhes da Consulta').should('be.visible')

    // Verifica informações detalhadas
    cy.get('[data-testid="appointment-details-modal"]').within(() => {
      cy.contains('Dra. Ana Costa').should('be.visible')
      cy.contains('Dermatologia').should('be.visible')
      cy.contains('15/02/2024').should('be.visible')
      cy.contains('09:00').should('be.visible')
      cy.contains('Agendada').should('be.visible')
      cy.contains('Consulta dermatológica de rotina').should('be.visible')
      cy.contains('Consultório 201').should('be.visible')
      cy.contains('Avaliação de manchas na pele').should('be.visible')
    })

    // Fecha modal
    cy.get('[data-testid="close-details"]').click()
    cy.get('[data-testid="appointment-details-modal"]').should('not.exist')
  })

  it('should navigate to schedule new appointment', () => {
    // Clica no botão de agendar nova consulta
    cy.get('[data-testid="schedule-new-appointment"]').click()

    // Deve redirecionar para página de agendamento
    cy.url().should('include', '/appointments/new')
    cy.contains('Agendar Nova Consulta').should('be.visible')
  })

  it('should handle empty appointments state', () => {
    // Mock de lista vazia
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: []
    }).as('emptyAppointments')

    cy.reload()
    cy.wait('@emptyAppointments')

    // Verifica estado vazio
    cy.contains('Nenhuma consulta agendada').should('be.visible')
    cy.contains('Que tal agendar sua primeira consulta?').should('be.visible')
    cy.get('[data-testid="schedule-first-appointment"]').should('be.visible')

    // Clica para agendar primeira consulta
    cy.get('[data-testid="schedule-first-appointment"]').click()
    cy.url().should('include', '/appointments/new')
  })

  it('should handle appointment API errors gracefully', () => {
    // Mock de erro na API
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('appointmentsError')

    cy.reload()
    cy.wait('@appointmentsError')

    // Verifica estado de erro
    cy.contains('Erro ao carregar consultas').should('be.visible')
    cy.contains('Tente novamente mais tarde').should('be.visible')
    cy.get('[data-testid="retry-button"]').should('be.visible')

    // Tenta novamente
    cy.get('[data-testid="retry-button"]').click()
    cy.wait(1000)
  })

  it('should show loading state while fetching appointments', () => {
    // Mock de resposta lenta
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [],
      delay: 2000
    }).as('slowAppointments')

    cy.reload()

    // Verifica estado de carregamento
    cy.get('[data-testid="loading-spinner"]').should('be.visible')
    cy.contains('Carregando consultas...').should('be.visible')

    cy.wait('@slowAppointments')

    // Loading deve desaparecer
    cy.get('[data-testid="loading-spinner"]').should('not.exist')
  })

  it('should prevent canceling past appointments', () => {
    // Mock de consulta passada
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-past-001',
          doctorName: 'Dra. Ana Costa',
          specialty: 'Dermatologia',
          date: '2024-01-15', // Data passada
          time: '09:00',
          status: 'COMPLETED'
        }
      ]
    }).as('pastAppointments')

    cy.reload()
    cy.wait('@pastAppointments')

    // Consulta passada não deve ter botão de cancelar
    cy.get('[data-testid="appointment-card"]').contains('Dra. Ana Costa').parent().within(() => {
      cy.contains('Concluída').should('be.visible')
      cy.get('[data-testid="cancel-button"]').should('not.exist')
    })
  })

  it('should show upcoming appointments first', () => {
    // Mock de consultas ordenadas
    cy.intercept('GET', '**/api/appointments*', {
      statusCode: 200,
      body: [
        {
          id: 'apt-002',
          doctorName: 'Dr. João Silva',
          date: '2024-02-20',
          time: '14:00',
          status: 'SCHEDULED'
        },
        {
          id: 'apt-001',
          doctorName: 'Dra. Ana Costa',
          date: '2024-02-15',
          time: '09:00',
          status: 'SCHEDULED'
        }
      ]
    }).as('orderedAppointments')

    cy.reload()
    cy.wait('@orderedAppointments')

    // Primeira consulta deve ser a mais próxima (15/02)
    cy.get('[data-testid="appointment-card"]').first().within(() => {
      cy.contains('Dra. Ana Costa').should('be.visible')
      cy.contains('15/02/2024').should('be.visible')
    })

    // Segunda consulta deve ser a mais distante (20/02)
    cy.get('[data-testid="appointment-card"]').eq(1).within(() => {
      cy.contains('Dr. João Silva').should('be.visible')
      cy.contains('20/02/2024').should('be.visible')
    })
  })
})
