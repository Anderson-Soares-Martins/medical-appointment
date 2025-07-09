/**
 * TESTES DE SISTEMA - UC04: GESTÃO DE CONSULTAS
 * 
 * CT014 - Visualizar Lista de Consultas (Fluxo Principal)
 * CT015 - Cancelar Consulta Agendada (Fluxo Alternativo)
 * CT016 - Tentar Cancelar Consulta Já Realizada (Fluxo de Exceção)
 */

describe('UC04 - Gestão de Consultas', () => {
  beforeEach(() => {
    cy.setupApiInterceptors()
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  /**
   * CT014 - Visualizar Lista de Consultas (Fluxo Principal)
   * Tipo: Sistema ✅
   */
  it('CT014 - Should display appointments list correctly (Fluxo Principal)', () => {
    // Given: Paciente logado com consultas agendadas
    cy.loginAsPatient()

    // Mock appointments data
    cy.intercept('GET', '**/appointments', {
      statusCode: 200,
      body: {
        appointments: [
          {
            id: '1',
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            status: 'SCHEDULED',
            doctor: {
              id: 'doctor1',
              name: 'Dr. Maria Silva',
              specialty: 'Cardiologia'
            }
          },
          {
            id: '2',
            date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            status: 'SCHEDULED',
            doctor: {
              id: 'doctor2',
              name: 'Dr. João Santos',
              specialty: 'Dermatologia'
            }
          }
        ]
      }
    }).as('getAppointments')

    // When: Navegar para página de consultas
    cy.visit('/appointments')
    cy.get('[data-testid="appointments-page"]').should('be.visible')

    // Wait for appointments to load
    cy.waitForApi('@getAppointments')

    // Then: Deve exibir lista de consultas
    cy.get('[data-testid="appointment-card"]').should('have.length', 2)

    // And: Deve mostrar informações corretas da primeira consulta
    cy.get('[data-testid="appointment-card"]').first().within(() => {
      cy.get('[data-testid="doctor-name"]').should('contain', 'Dr. Maria Silva')
      cy.get('[data-testid="doctor-specialty"]').should('contain', 'Cardiologia')
      cy.get('[data-testid="appointment-status"]').should('contain', 'Agendada')
      cy.get('[data-testid="appointment-date"]').should('exist')
    })

    // And: Deve mostrar informações corretas da segunda consulta
    cy.get('[data-testid="appointment-card"]').eq(1).within(() => {
      cy.get('[data-testid="doctor-name"]').should('contain', 'Dr. João Santos')
      cy.get('[data-testid="doctor-specialty"]').should('contain', 'Dermatologia')
      cy.get('[data-testid="appointment-status"]').should('contain', 'Agendada')
    })

    // And: Deve mostrar controles de ação para consultas agendadas
    cy.get('[data-testid="cancel-appointment"]').should('have.length', 2)
    cy.get('[data-testid="view-details"]').should('have.length', 2)

    // And: Deve exibir estatísticas
    cy.get('[data-testid="total-appointments"]').should('contain', '2')
    cy.get('[data-testid="scheduled-count"]').should('contain', '2')
  })

  /**
   * CT015 - Cancelar Consulta Agendada (Fluxo Alternativo)
   * Tipo: Sistema ✅
   */
  it('CT015 - Should cancel scheduled appointment successfully (Fluxo Alternativo)', () => {
    // Given: Paciente logado com consulta agendada
    cy.loginAsPatient()

    // Mock appointment data
    cy.intercept('GET', '**/appointments', {
      statusCode: 200,
      body: {
        appointments: [
          {
            id: 'appointment-1',
            date: new Date(Date.now() + 86400000).toISOString(),
            status: 'SCHEDULED',
            doctor: {
              name: 'Dr. Maria Silva',
              specialty: 'Cardiologia'
            }
          }
        ]
      }
    }).as('getAppointments')

    // Mock cancel appointment response
    cy.intercept('PUT', '**/appointments/appointment-1/cancel', {
      statusCode: 200,
      body: { message: 'Consulta cancelada com sucesso' }
    }).as('cancelAppointment')

    // And: Paciente na página de consultas
    cy.visit('/appointments')
    cy.waitForApi('@getAppointments')

    // When: Clicar no botão de cancelar
    cy.get('[data-testid="cancel-appointment"]').first().click()

    // And: Confirmar cancelamento no modal
    cy.get('[data-testid="cancel-modal"]').should('be.visible')
    cy.get('[data-testid="cancel-reason"]').select('Conflito de agenda')
    cy.get('[data-testid="confirm-cancel"]').click()

    // Wait for cancel API response
    cy.waitForApi('@cancelAppointment')

    // Then: Deve mostrar mensagem de sucesso
    cy.checkToast('Consulta cancelada com sucesso', 'success')

    // And: Modal deve fechar
    cy.get('[data-testid="cancel-modal"]').should('not.exist')

    // And: Status da consulta deve ser atualizado
    cy.get('[data-testid="appointment-status"]').first().should('contain', 'Cancelada')

    // And: Botão de cancelar deve ser removido/desabilitado
    cy.get('[data-testid="cancel-appointment"]').first().should('be.disabled')

    // And: Estatísticas devem ser atualizadas
    cy.get('[data-testid="cancelled-count"]').should('contain', '1')
    cy.get('[data-testid="scheduled-count"]').should('contain', '0')
  })

  /**
   * CT016 - Tentar Cancelar Consulta Já Realizada (Fluxo de Exceção)
   * Tipo: Sistema ✅
   */
  it('CT016 - Should prevent cancelling completed appointment (Fluxo de Exceção)', () => {
    // Given: Paciente logado com consulta já realizada
    cy.loginAsPatient()

    // Mock appointment with completed status
    cy.intercept('GET', '**/appointments', {
      statusCode: 200,
      body: {
        appointments: [
          {
            id: 'completed-appointment',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            status: 'COMPLETED',
            doctor: {
              name: 'Dr. Maria Silva',
              specialty: 'Cardiologia'
            },
            notes: 'Consulta realizada com sucesso'
          }
        ]
      }
    }).as('getAppointments')

    // Mock error response for cancel attempt
    cy.intercept('PUT', '**/appointments/completed-appointment/cancel', {
      statusCode: 400,
      body: { error: 'Não é possível cancelar consulta já realizada' }
    }).as('cancelError')

    // When: Navegar para página de consultas
    cy.visit('/appointments')
    cy.waitForApi('@getAppointments')

    // Then: Consulta concluída deve ser exibida
    cy.get('[data-testid="appointment-card"]').should('exist')
    cy.get('[data-testid="appointment-status"]').should('contain', 'Concluída')

    // And: Botão de cancelar não deve estar disponível
    cy.get('[data-testid="cancel-appointment"]').should('not.exist')

    // And: Deve mostrar indicador de consulta não cancelável
    cy.get('[data-testid="non-cancellable"]').should('be.visible')
    cy.get('[data-testid="non-cancellable"]').should('contain', 'Consulta realizada')

    // When: Tentar cancelar via API diretamente (simulação de tentativa maliciosa)
    cy.request({
      method: 'PUT',
      url: `${Cypress.env('apiUrl')}/appointments/completed-appointment/cancel`,
      failOnStatusCode: false,
      headers: {
        'Authorization': 'Bearer fake-token'
      }
    }).then((response) => {
      // Then: Deve retornar erro 400
      expect(response.status).to.eq(400)
      expect(response.body.error).to.contain('Não é possível cancelar')
    })

    // And: Deve mostrar informações da consulta realizada
    cy.get('[data-testid="appointment-notes"]').should('contain', 'Consulta realizada com sucesso')
    cy.get('[data-testid="completion-date"]').should('exist')
  })

  /**
   * Teste Adicional: Filtrar consultas por status
   */
  it('Should filter appointments by status', () => {
    cy.loginAsPatient()

    // Mock mixed appointments
    cy.intercept('GET', '**/appointments', {
      statusCode: 200,
      body: {
        appointments: [
          {
            id: '1',
            status: 'SCHEDULED',
            doctor: { name: 'Dr. Silva' },
            date: new Date().toISOString()
          },
          {
            id: '2',
            status: 'COMPLETED',
            doctor: { name: 'Dr. Santos' },
            date: new Date().toISOString()
          },
          {
            id: '3',
            status: 'CANCELLED',
            doctor: { name: 'Dr. Costa' },
            date: new Date().toISOString()
          }
        ]
      }
    }).as('getAllAppointments')

    cy.visit('/appointments')
    cy.waitForApi('@getAllAppointments')

    // All appointments should be visible initially
    cy.get('[data-testid="appointment-card"]').should('have.length', 3)

    // Filter by scheduled
    cy.get('[data-testid="status-filter"]').select('SCHEDULED')
    cy.get('[data-testid="appointment-card"]').should('have.length', 1)
    cy.get('[data-testid="appointment-status"]').should('contain', 'Agendada')

    // Filter by completed
    cy.get('[data-testid="status-filter"]').select('COMPLETED')
    cy.get('[data-testid="appointment-card"]').should('have.length', 1)
    cy.get('[data-testid="appointment-status"]').should('contain', 'Concluída')
  })

  /**
   * Teste Adicional: Visualizar detalhes da consulta
   */
  it('Should show appointment details', () => {
    cy.loginAsPatient()

    cy.intercept('GET', '**/appointments', {
      statusCode: 200,
      body: {
        appointments: [
          {
            id: '1',
            status: 'SCHEDULED',
            doctor: {
              name: 'Dr. Maria Silva',
              specialty: 'Cardiologia'
            },
            date: new Date(Date.now() + 86400000).toISOString(),
            notes: 'Consulta de rotina'
          }
        ]
      }
    }).as('getAppointments')

    cy.visit('/appointments')
    cy.waitForApi('@getAppointments')

    // Click on appointment details
    cy.get('[data-testid="view-details"]').first().click()

    // Details modal should open
    cy.get('[data-testid="appointment-details-modal"]').should('be.visible')
    cy.get('[data-testid="detail-doctor"]').should('contain', 'Dr. Maria Silva')
    cy.get('[data-testid="detail-specialty"]').should('contain', 'Cardiologia')
    cy.get('[data-testid="detail-notes"]').should('contain', 'Consulta de rotina')
  })
}) 