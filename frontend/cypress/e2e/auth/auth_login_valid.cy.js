/// <reference types="cypress" />

describe('Authentication - Valid Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should login successfully with patient credentials', () => {
    // Login como paciente Maria
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Deve redirecionar para dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    // Deve mostrar nome do usuário e role
    cy.contains('Maria', { timeout: 10000 }).should('be.visible')
  })

  it('should login successfully with doctor credentials - Dr. Silva', () => {
    // Login como Dr. Silva (Cardiologia)
    cy.get('[data-testid="email-input"]').type('dr.silva@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Deve redirecionar para dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    // Deve mostrar nome do médico completo como retornado pelo backend
    cy.contains('Dr. Maria Silva', { timeout: 10000 }).should('be.visible')
  })

  it('should show loading state during login', () => {
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Deve mostrar estado de carregamento
    cy.get('[data-testid="login-button"]').should('contain', 'Entrando...')
  })

  it('should handle doctor login with complete mock data', () => {
    // Mock completo de login do médico
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        message: "Login successful",
        user: {
          id: "doc-silva-123",
          email: "dr.silva@clinic.com",
          name: "Dr. Maria Silva",
          role: "DOCTOR",
          specialty: "Cardiologia"
        },
        token: "jwt-token-silva",
        refreshToken: "refresh-token-silva"
      }
    }).as('doctorSilvaLogin')

    cy.get('[data-testid="email-input"]').type('dr.silva@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@doctorSilvaLogin')

    // Deve redirecionar para dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    // Deve mostrar dados específicos do médico
    cy.contains('Dr. Maria Silva').should('be.visible')
  })

  it('should handle patient login with complete mock data', () => {
    // Mock completo de login do paciente
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        message: "Login successful",
        user: {
          id: "patient-maria-456",
          email: "maria.patient@email.com",
          name: "Maria Santos",
          role: "PATIENT",
          specialty: null
        },
        token: "jwt-token-maria",
        refreshToken: "refresh-token-maria"
      }
    }).as('patientMariaLogin')

    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@patientMariaLogin')

    // Deve redirecionar para dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    // Deve mostrar dados específicos da paciente
    cy.contains('Maria Santos').should('be.visible')
  })
}) 