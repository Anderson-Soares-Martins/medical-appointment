/// <reference types="cypress" />

describe('Appointment Scheduling - Complete Flow', () => {
  beforeEach(() => {
    // Mock do endpoint de médicos ANTES da navegação
    cy.intercept('GET', '**/users/doctors', {
      statusCode: 200,
      body: {
        doctors: [
          {
            id: 'doctor-1',
            name: 'Maria Silva',
            specialty: 'Cardiologia',
            email: 'dr.silva@clinic.com'
          },
          {
            id: 'doctor-2',
            name: 'João Santos',
            specialty: 'Dermatologia',
            email: 'dr.joao@clinic.com'
          }
        ],
        count: 2
      }
    }).as('getDoctors')

    // Login usando o form submit em vez de apenas clicar
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-form"]').submit()

    // Aguarda redirecionamento
    cy.url().should('include', '/dashboard', { timeout: 15000 })
    cy.wait(3000)

    // Navega para página de agendamento
    cy.visit('/appointments/new')
    cy.url().should('include', '/appointments/new')
    cy.wait(3000)
  })

  it('should complete appointment scheduling flow', () => {
    // Aguarda carregar médicos
    cy.wait('@getDoctors')

    // Verifica se página de agendamento carregou
    cy.contains('Agendar Consulta').should('be.visible')

    // Passo 1: Seleciona médico (usa multiple: true)
    cy.get('[data-testid="doctor-option"]').first().click({ multiple: true })
    cy.wait(2000)

    // Passo 2: Seleciona data (usa multiple: true)
    cy.get('[data-testid="date-option"]').first().click({ multiple: true })
    cy.wait(2000)

    // Passo 3: Seleciona horário (usa multiple: true)
    cy.get('[data-testid="time-slot"]').first().click({ multiple: true })
    cy.wait(2000)

    // Mock de criação de consulta
    cy.intercept('POST', '**/appointments', {
      statusCode: 201,
      body: {
        id: 'appointment-123',
        doctorId: 'doctor-1',
        patientId: 'patient-123',
        date: new Date().toISOString(),
        status: 'SCHEDULED',
        notes: 'Consulta de rotina'
      }
    }).as('createAppointment')

    // Passo 4: Adiciona observações (opcional)
    cy.get('textarea[id="notes"]').type('Consulta de rotina - cardiologia')

    // Confirma agendamento
    cy.get('[data-testid="schedule-button"]').should('be.enabled')
    cy.get('[data-testid="schedule-button"]').click()
    cy.wait('@createAppointment')

    // Verifica redirecionamento para lista de consultas
    cy.url().should('include', '/appointments')
  })

  it('should show validation errors for required fields', () => {
    // Aguarda carregar médicos
    cy.wait('@getDoctors')

    // Verifica se página carregou
    cy.contains('Agendar Consulta').should('be.visible')

    // Botão deve estar desabilitado sem seleções
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // Seleciona médico
    cy.get('[data-testid="doctor-option"]').first().click()
    cy.wait(1000)

    // Ainda deve estar desabilitado (falta data e horário)
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // Seleciona data
    cy.get('[data-testid="date-option"]').first().click()
    cy.wait(1000)

    // Ainda deve estar desabilitado (falta horário)
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // Seleciona horário
    cy.get('[data-testid="time-slot"]').first().click()
    cy.wait(1000)

    // Agora deve estar habilitado
    cy.get('[data-testid="schedule-button"]').should('be.enabled')
  })

  it('should show different time slots', () => {
    // Aguarda carregar médicos
    cy.wait('@getDoctors')

    // Seleciona médico
    cy.get('[data-testid="doctor-option"]').first().click()
    cy.wait(1000)

    // Seleciona data
    cy.get('[data-testid="date-option"]').first().click()
    cy.wait(1000)

    // Verifica se há slots de horário disponíveis
    cy.get('[data-testid="time-slot"]').should('have.length.at.least', 2)

    // Verifica se há slots para manhã e tarde
    cy.contains('Manhã').should('be.visible')
    cy.contains('Tarde').should('be.visible')
  })

  it('should handle appointment creation errors', () => {
    // Aguarda carregar médicos
    cy.wait('@getDoctors')

    // Navega pelos passos
    cy.get('[data-testid="doctor-option"]').first().click()
    cy.wait(500)

    cy.get('[data-testid="date-option"]').first().click()
    cy.wait(500)

    cy.get('[data-testid="time-slot"]').first().click()
    cy.wait(500)

    // Mock de erro na criação
    cy.intercept('POST', '**/appointments', {
      statusCode: 409,
      body: {
        error: 'Horário não disponível',
        message: 'Este horário já foi agendado por outro paciente'
      }
    }).as('createAppointmentError')

    // Tenta criar consulta
    cy.get('[data-testid="schedule-button"]').click()
    cy.wait('@createAppointmentError')

    // Verifica que não houve redirecionamento
    cy.url().should('include', '/appointments/new')
  })

  it('should allow canceling appointment creation', () => {
    // Aguarda carregar médicos
    cy.wait('@getDoctors')

    // Verifica se há botão cancelar
    cy.contains('Cancelar').should('be.visible')

    // Clica no botão cancelar
    cy.contains('Cancelar').click()

    // Deve redirecionar para lista de consultas
    cy.url().should('include', '/appointments')
  })
}) 