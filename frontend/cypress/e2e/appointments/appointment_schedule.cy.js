/// <reference types="cypress" />

describe('Appointment Scheduling - Complete Flow with Dr. João Santos', () => {
  beforeEach(() => {
    // Login usando o botão de login
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Aguarda redirecionamento
    cy.url().should('include', '/dashboard', { timeout: 15000 })
    cy.wait(3000)

    // Navega para página de agendamento
    cy.visit('/appointments/new')
    cy.url().should('include', '/appointments/new')
    cy.wait(3000)
  })

  it('should complete appointment scheduling flow with Dr. João Santos', () => {
    // Verifica se página de agendamento carregou
    cy.contains('Agendar Consulta').should('be.visible')

    // Aguarda carregar médicos reais do banco
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Passo 1: Seleciona especificamente Dr. João Santos (Dermatologia)
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').click()
    cy.wait(2000)

    // Aguarda carregar datas disponíveis
    cy.get('[data-testid="date-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Passo 2: Seleciona primeira data disponível
    cy.get('[data-testid="date-option"]').eq(0).click()
    cy.wait(2000)

    // Aguarda carregar horários disponíveis reais
    cy.get('[data-testid="time-slot"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Passo 3: Seleciona primeiro horário disponível
    cy.get('[data-testid="time-slot"]').eq(0).click()
    cy.wait(2000)

    // Passo 4: Adiciona observações específicas para identificar a consulta
    const testNote = `E2E Test with Dr. Santos - ${new Date().getTime()}`
    cy.get('textarea[id="notes"]').type(testNote)

    // Confirma agendamento
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.enabled')
    cy.get('[data-testid="schedule-button"]').eq(0).click()

    // Aguarda criação real da consulta e redirecionamento
    cy.url().should('include', '/appointments', { timeout: 15000 })

    // Navega diretamente para verificar se a consulta foi criada
    cy.visit('/appointments')
    cy.wait(3000)

    // Verifica se está na página de consultas
    cy.get('[data-testid="appointments-page"]:visible').should('exist')
    cy.get('h1:visible').should('contain', 'Consultas')

    // Verifica se a consulta aparece na lista
    cy.get('body').should('contain.text', 'Dr. João Santos')
  })

  it('should validate Dr. João Santos is selected correctly', () => {
    // Verifica se página carregou
    cy.contains('Agendar Consulta').should('be.visible')

    // Aguarda carregar médicos reais
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Verifica se Dr. João Santos está disponível
    cy.contains('Dr. João Santos').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')

    // Seleciona Dr. João Santos especificamente
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').click()
    cy.wait(1000)

    // Verifica se foi selecionado (deve ter classe de selecionado ou ícone de check)
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').should('have.class', 'border-blue-500')
  })

  it('should show validation errors for required fields', () => {
    // Verifica se página carregou
    cy.contains('Agendar Consulta').should('be.visible')

    // Aguarda carregar médicos reais
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Botão deve estar desabilitado sem seleções
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.disabled')

    // Seleciona Dr. João Santos
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').click()
    cy.wait(1000)

    // Ainda deve estar desabilitado (falta data e horário)
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.disabled')

    // Aguarda e seleciona data
    cy.get('[data-testid="date-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="date-option"]').eq(0).click()
    cy.wait(1000)

    // Ainda deve estar desabilitado (falta horário)
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.disabled')

    // Aguarda e seleciona horário
    cy.get('[data-testid="time-slot"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="time-slot"]').eq(0).click()
    cy.wait(1000)

    // Agora deve estar habilitado
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.enabled')
  })

  it('should show real doctors from database including Dr. João Santos', () => {
    // Verifica se página carregou
    cy.contains('Agendar Consulta').should('be.visible')

    // Aguarda carregar médicos reais do banco
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Verifica se Dr. João Santos aparece
    cy.contains('Dr. João Santos').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')

    // Verifica se Dr. Maria Silva também aparece
    cy.contains('Dr. Maria Silva').should('be.visible')
    cy.contains('Cardiologia').should('be.visible')

    // Verifica que temos múltiplos médicos
    cy.get('[data-testid="doctor-option"]').should('have.length.at.least', 2)
  })

  it('should allow canceling appointment creation', () => {
    // Aguarda carregar médicos reais
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Verifica se há botão cancelar
    cy.contains('Cancelar').should('be.visible')

    // Clica no botão cancelar
    cy.contains('Cancelar').click()

    // Deve redirecionar para lista de consultas
    cy.url().should('include', '/appointments')
  })

  it('should create appointment with Dr. Santos and verify it appears in appointments list', () => {
    // Fluxo completo de agendamento com Dr. João Santos
    cy.contains('Agendar Consulta').should('be.visible')

    // Aguarda e seleciona especificamente Dr. João Santos
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').click()
    cy.wait(1000)

    // Aguarda e seleciona data
    cy.get('[data-testid="date-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="date-option"]').eq(0).click()
    cy.wait(1000)

    // Aguarda e seleciona horário
    cy.get('[data-testid="time-slot"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="time-slot"]').eq(0).click()
    cy.wait(1000)

    // Adiciona observação única para identificar a consulta
    const testNote = `E2E Test Dr. Santos - ${new Date().getTime()}`
    cy.get('textarea[id="notes"]').type(testNote)

    // Confirma agendamento
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.enabled')
    cy.get('[data-testid="schedule-button"]').eq(0).click()

    // Aguarda redirecionamento e navega diretamente para lista
    cy.url().should('include', '/appointments', { timeout: 15000 })
    cy.visit('/appointments')
    cy.wait(3000)

    // Verifica se está na página de consultas
    cy.get('[data-testid="appointments-page"]:visible').should('exist')
    cy.get('h1:visible').should('contain', 'Consultas')

    // Verifica se a consulta com Dr. João Santos aparece
    cy.get('body').should('contain.text', 'Dr. João Santos')

    // Verifica se há consultas na lista
    cy.get('[data-testid="total-appointments"]:visible').should('not.contain', '0')
  })
}) 