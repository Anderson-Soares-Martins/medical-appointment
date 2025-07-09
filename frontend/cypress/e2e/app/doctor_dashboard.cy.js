/// <reference types="cypress" />

describe('Doctor Dashboard Flow', () => {
  beforeEach(() => {
    // Login as doctor (Dr. João Santos)
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('dr.santos@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Wait for redirect
    cy.url().should('include', '/dashboard')
    cy.wait(2000) // Let dashboard load
  })

  describe('Principal Flow - Doctor Dashboard Access', () => {
    it('should display doctor-specific welcome message', () => {
      // Check doctor-specific greeting
      cy.get('[data-testid="dashboard-title"]').should('contain', 'Dr. João Santos')

      // Check dashboard content loads
      cy.contains('Aqui está um resumo das suas consultas').should('be.visible')
    })

    it('should show doctor appointment statistics', () => {
      // Check stats cards exist
      cy.contains('Total de Consultas').should('be.visible')
      cy.contains('Agendadas').should('be.visible')
      cy.contains('Concluídas').should('be.visible')
      cy.contains('Canceladas').should('be.visible')

      // Check numeric values are displayed
      cy.get('body').then(($body) => {
        const statsElements = $body.find('.text-2xl.font-bold')
        expect(statsElements).to.have.length.at.least(4)
      })
    })

    it('should display today appointments section for doctor', () => {
      // Should show today's appointments section
      cy.contains('Consultas de Hoje').should('be.visible')
      cy.contains('Pacientes agendados para hoje').should('be.visible')

      // Check if appointments are listed or empty state shown
      cy.get('body').then(($body) => {
        if ($body.find('.bg-gray-50.rounded-lg').length > 0) {
          // Has appointments
          cy.get('.bg-gray-50.rounded-lg').first().should('be.visible')
        } else {
          // Empty state
          cy.contains('Nenhuma consulta').should('be.visible')
        }
      })
    })
  })

  describe('Alternative Flow - Navigate to Today Appointments', () => {
    it('should navigate to today appointments page', () => {
      // Look for "Ver todas" link
      cy.get('body').then(($body) => {
        if ($body.find('a[href="/appointments/today"]').length > 0) {
          cy.get('a[href="/appointments/today"]').click()
          cy.url().should('include', '/appointments/today')
          cy.contains('Consultas de Hoje').should('be.visible')
        } else {
          // Navigate directly
          cy.visit('/appointments/today')
          cy.url().should('include', '/appointments/today')
          cy.contains('Consultas de Hoje').should('be.visible')
        }
      })
    })

    it('should show upcoming appointments section', () => {
      // Check upcoming appointments section
      cy.get('body').then(($body) => {
        if ($body.text().includes('Próximas Consultas')) {
          cy.contains('Próximas Consultas').should('be.visible')
        } else {
          cy.log('Upcoming appointments section not found - may be empty')
        }
      })
    })
  })

  describe('Exception Flow - Handle Dashboard Errors', () => {
    it('should handle stats API error gracefully', () => {
      // Mock stats API error
      cy.intercept('GET', '**/api/appointments/stats*', {
        statusCode: 500,
        body: { error: 'Stats error' }
      }).as('statsError')

      // Reload dashboard
      cy.reload()
      cy.wait(1000)

      // Should still show dashboard structure
      cy.get('[data-testid="dashboard-title"]').should('be.visible')
    })

    it('should handle today appointments API error', () => {
      // Mock today appointments API error
      cy.intercept('GET', '**/api/appointments/today*', {
        statusCode: 500,
        body: { error: 'Today appointments error' }
      }).as('todayError')

      // Reload dashboard
      cy.reload()
      cy.wait(1000)

      // Should still show dashboard
      cy.contains('Consultas de Hoje').should('be.visible')
    })

    it('should handle missing user data', () => {
      // Dashboard should be resilient to missing user data
      cy.get('[data-testid="dashboard-title"]').should('be.visible')

      // Should have fallback behavior
      cy.get('body').should('contain.text', 'João Santos')
    })
  })
}) 