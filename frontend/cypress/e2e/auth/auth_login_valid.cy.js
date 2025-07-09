/// <reference types="cypress" />

describe('Authentication - Valid Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should login successfully with valid credentials', () => {
    // Use real login flow
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    // Should show user name or dashboard elements
    cy.contains('Maria', { timeout: 10000 }).should('be.visible')
  })

  it('should show loading state during login', () => {
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Should show loading state
    cy.get('[data-testid="login-button"]').should('contain', 'Entrando...')
  })

  it('should handle doctor login correctly', () => {
    // Mock doctor login response  
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        message: "Login successful",
        user: {
          id: "doc-123",
          email: "dr.silva@clinic.com",
          name: "Dr. Silva",
          role: "DOCTOR",
          specialty: "Cardiologia"
        },
        token: "jwt-token",
        refreshToken: "refresh-token"
      }
    }).as('doctorLogin')

    cy.get('[data-testid="email-input"]').type('dr.silva@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@doctorLogin')

    // Should redirect to dashboard
    cy.url().should('include', '/dashboard', { timeout: 10000 })
  })
}) 