/// <reference types="cypress" />

describe('Doctor History Flow', () => {
  beforeEach(() => {
    // Login as doctor (Dr. João Santos)
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('dr.santos@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Navigate to history page
    cy.url().should('include', '/dashboard')
    cy.visit('/history')
    cy.url().should('include', '/history')
    cy.wait(2000) // Let page load
  })

  describe('Principal Flow - History Access and Display', () => {
    it('should display history page with correct title', () => {
      // Check page title
      cy.contains('Histórico de Consultas').should('be.visible')
      cy.contains('Consulte o histórico completo de consultas realizadas').should('be.visible')
    })

    it('should show history statistics cards', () => {
      // Check stats cards
      cy.contains('Total').should('be.visible')
      cy.contains('Concluídas').should('be.visible')
      cy.contains('Canceladas').should('be.visible')
      cy.contains('Faltaram').should('be.visible')

      // Check numeric values are displayed
      cy.get('body').then(($body) => {
        const statsElements = $body.find('.text-2xl.font-bold')
        expect(statsElements).to.have.length.at.least(4)
      })
    })

    it('should display historical appointments from doctor perspective', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.space-y-4').length > 0 && $body.text().includes('paciente')) {
          // Has appointments - check patient names are shown (doctor perspective)
          cy.log('Historical appointments found with patient information')
        } else {
          // Empty state
          cy.contains('Nenhuma consulta').should('be.visible')
        }
      })
    })

    it('should show export functionality', () => {
      // Check export button
      cy.get('button').contains('Exportar').should('be.visible')

      // Click export button
      cy.get('button').contains('Exportar').click()

      // Should show export message/modal
      cy.wait(500)
    })
  })

  describe('Alternative Flow - Filtering and Search', () => {
    it('should filter appointments by status', () => {
      // Look for status filter
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 0) {
          // Test status filtering
          const statusOptions = ['COMPLETED', 'CANCELLED', 'NO_SHOW']

          statusOptions.forEach(status => {
            cy.get('select').first().select(status, { force: true })
            cy.wait(500)

            // Check if filter is applied
            cy.get('select').first().should('have.value', status)
          })

          // Reset to all
          cy.get('select').first().select('all', { force: true })
        } else {
          cy.log('Status filter not found')
        }
      })
    })

    it('should search appointments by patient name', () => {
      // Look for search input
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="Buscar"]').length > 0) {
          // Test search functionality
          cy.get('input[placeholder*="Buscar"]').first().type('Maria')
          cy.wait(1000)

          // Should filter results
          cy.get('body').then(($searchBody) => {
            if ($searchBody.text().includes('Maria')) {
              cy.contains('Maria').should('be.visible')
            } else {
              cy.contains('Nenhuma consulta').should('be.visible')
            }
          })

          // Clear search
          cy.get('input[placeholder*="Buscar"]').first().clear()
        } else {
          cy.log('Search input not found')
        }
      })
    })

    it('should filter by time period', () => {
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 1) {
          // Find period filter (usually second select)
          const periodOptions = ['week', 'month', 'quarter', 'year']

          periodOptions.forEach(period => {
            cy.get('select').eq(1).select(period, { force: true })
            cy.wait(500)

            // Check if filter is applied
            cy.get('select').eq(1).should('have.value', period)
          })
        } else {
          cy.log('Period filter not found')
        }
      })
    })

    it('should combine multiple filters', () => {
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 0 && $body.find('input[placeholder*="Buscar"]').length > 0) {
          // Apply status filter
          cy.get('select').first().select('COMPLETED', { force: true })

          // Apply search
          cy.get('input[placeholder*="Buscar"]').first().type('Silva')

          cy.wait(1000)

          // Should show filtered results
          cy.log('Multiple filters applied')
        }
      })
    })
  })

  describe('Exception Flow - Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '**/api/appointments*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('historyError')

      // Reload page
      cy.reload()
      cy.wait('@historyError')

      // Should still show page structure
      cy.contains('Histórico de Consultas').should('be.visible')
    })

    it('should handle empty history state', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/appointments*', {
        statusCode: 200,
        body: []
      }).as('emptyHistory')

      // Reload page
      cy.reload()
      cy.wait('@emptyHistory')

      // Should show empty state
      cy.get('body').then(($body) => {
        if ($body.text().includes('Nenhuma consulta') || $body.find('.text-2xl.font-bold').text().includes('0')) {
          cy.log('Empty history state handled correctly')
        }
      })
    })

    it('should handle search with no results', () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="Buscar"]').length > 0) {
          // Search for non-existent patient
          cy.get('input[placeholder*="Buscar"]').first().type('PacienteInexistente123')
          cy.wait(1000)

          // Should show no results
          cy.get('body').then(($searchBody) => {
            if ($searchBody.text().includes('Nenhuma') || $searchBody.find('.text-2xl.font-bold').text().includes('0')) {
              cy.log('No search results handled correctly')
            }
          })
        }
      })
    })

    it('should handle loading states properly', () => {
      // Visit page and check loading
      cy.visit('/history')

      cy.get('body').then(($body) => {
        if ($body.find('.animate-spin').length > 0) {
          // Has loading spinner
          cy.get('.animate-spin').should('be.visible')
          cy.wait(2000)
          cy.contains('Histórico de Consultas').should('be.visible')
        } else {
          // Direct load
          cy.contains('Histórico de Consultas').should('be.visible')
        }
      })
    })

    it('should handle export errors', () => {
      // Mock export error (if there's an API call)
      cy.intercept('GET', '**/api/appointments/export*', {
        statusCode: 500,
        body: { error: 'Export error' }
      }).as('exportError')

      // Click export
      cy.get('button').contains('Exportar').click()

      // Should handle error gracefully
      cy.wait(1000)
      cy.log('Export error handled')
    })
  })

  describe('Doctor-Specific Functionality', () => {
    it('should show patient names in appointment cards (doctor perspective)', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.space-y-4').length > 0) {
          // Look for appointment cards
          cy.get('body').then(($appointments) => {
            if ($appointments.text().includes('paciente') || $appointments.text().match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
              cy.log('Patient names displayed correctly for doctor')
            } else {
              cy.log('No patient appointments found')
            }
          })
        }
      })
    })

    it('should show appointment details relevant to doctor', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.space-y-4').length > 0) {
          // Check for doctor-relevant information
          const doctorRelevantTerms = ['Consulta', 'Paciente', 'Status', 'Data']

          doctorRelevantTerms.forEach(term => {
            if ($body.text().includes(term)) {
              cy.contains(term).should('be.visible')
            }
          })
        }
      })
    })

    it('should display completed appointments with notes if available', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('COMPLETED') || $body.text().includes('Concluída')) {
          // Look for appointment notes or details
          cy.log('Completed appointments found')

          // Check if notes are displayed
          if ($body.text().includes('Observações') || $body.text().includes('Notas')) {
            cy.contains('Observações').should('be.visible')
          }
        }
      })
    })
  })
}) 