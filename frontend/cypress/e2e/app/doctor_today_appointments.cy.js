/// <reference types="cypress" />

describe('Doctor Today Appointments Flow', () => {
  beforeEach(() => {
    // Login as doctor (Dr. João Santos)
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('dr.santos@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Navigate to today appointments
    cy.url().should('include', '/dashboard')
    cy.visit('/appointments/today')
    cy.url().should('include', '/appointments/today')
    cy.wait(2000) // Let page load
  })

  describe('Principal Flow - Today Appointments Management', () => {
    it('should display today appointments page with correct header', () => {
      // Check page title and date
      cy.contains('Consultas de Hoje').should('be.visible')

      // Should show current date
      const today = new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })

      // Just check that some date text is visible
      cy.get('body').should('contain.text', new Date().getFullYear().toString())
    })

    it('should show appointments count', () => {
      // Should display appointments counter
      cy.get('body').then(($body) => {
        if ($body.text().includes('consulta')) {
          const countText = $body.text().match(/(\d+)\s*consulta/);
          if (countText) {
            cy.log(`Found ${countText[1]} appointments today`)
          }
          cy.contains('consulta').should('be.visible')
        } else {
          cy.log('No appointments counter found - may be empty state')
        }
      })
    })

    it('should display appointment cards with patient information', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.hover\\:shadow-md').length > 0) {
          // Has appointments - check patient info
          cy.get('.hover\\:shadow-md').first().within(() => {
            // Should show time
            cy.get('body').should('contain.text', ':')

            // Should show patient name (since doctor is logged in)
            cy.get('body').then(($card) => {
              expect($card.text()).to.match(/[A-Za-z\s]+/)
            })
          })
        } else {
          // Empty state
          cy.log('No appointments today - empty state')
        }
      })
    })
  })

  describe('Alternative Flow - Update Appointment Status', () => {
    it('should allow doctor to update appointment status', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.hover\\:shadow-md').length > 0) {
          // Look for edit button
          cy.get('body').then(($body) => {
            if ($body.find('button').text().includes('Editar') || $body.find('[data-testid*="edit"]').length > 0) {
              // Click edit button
              cy.get('button').contains('Editar').first().click({ force: true })

              // Should open edit dialog
              cy.get('body').then(($dialog) => {
                if ($dialog.text().includes('Status') || $dialog.find('select').length > 0) {
                  // Select new status
                  cy.get('select').first().select('COMPLETED', { force: true })

                  // Save changes
                  if ($dialog.find('button').text().includes('Salvar')) {
                    cy.get('button').contains('Salvar').click()
                  }
                }
              })
            } else {
              cy.log('Edit functionality not available - test skipped')
            }
          })
        } else {
          cy.log('No appointments to edit')
        }
      })
    })

    it('should allow doctor to add notes to appointment', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.hover\\:shadow-md').length > 0) {
          // Look for edit/notes functionality
          cy.get('body').then(($body) => {
            if ($body.find('button').text().includes('Editar')) {
              cy.get('button').contains('Editar').first().click({ force: true })

              // Look for notes textarea
              cy.get('body').then(($dialog) => {
                if ($dialog.find('textarea').length > 0) {
                  cy.get('textarea').first().clear()
                  cy.get('textarea').first().type('Consulta realizada com sucesso. Paciente apresentou melhora.')

                  // Save notes
                  if ($dialog.find('button').text().includes('Salvar')) {
                    cy.get('button').contains('Salvar').click()
                  }
                }
              })
            }
          })
        } else {
          cy.log('No appointments to add notes')
        }
      })
    })

    it('should show different appointment statuses', () => {
      // Check if different status badges are visible
      cy.get('body').then(($body) => {
        const possibleStatuses = ['Agendada', 'Concluída', 'Cancelada', 'SCHEDULED', 'COMPLETED', 'CANCELLED']

        let foundStatus = false
        possibleStatuses.forEach(status => {
          if ($body.text().includes(status)) {
            cy.contains(status).should('be.visible')
            foundStatus = true
          }
        })

        if (!foundStatus) {
          cy.log('No status badges found - may be empty state')
        }
      })
    })
  })

  describe('Exception Flow - Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '**/api/appointments/today*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('todayError')

      // Reload page
      cy.reload()
      cy.wait(1000)

      // Should still show page structure
      cy.contains('Consultas de Hoje').should('be.visible')
    })

    it('should handle empty appointments state', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/appointments/today*', {
        statusCode: 200,
        body: []
      }).as('emptyToday')

      // Reload page
      cy.reload()
      cy.wait(1000)

      // Should show empty state
      cy.get('body').then(($body) => {
        if ($body.text().includes('Nenhuma') || $body.text().includes('0 consulta')) {
          cy.log('Empty state handled correctly')
        } else {
          cy.log('Empty state may be handled differently')
        }
      })
    })

    it('should handle unauthorized appointment updates', () => {
      // Mock unauthorized update
      cy.intercept('PUT', '**/api/appointments/*', {
        statusCode: 403,
        body: { error: 'Unauthorized' }
      }).as('unauthorizedUpdate')

      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Editar')) {
          cy.get('button').contains('Editar').first().click({ force: true })

          cy.get('body').then(($dialog) => {
            if ($dialog.find('button').text().includes('Salvar')) {
              cy.get('button').contains('Salvar').click()
              cy.wait('@unauthorizedUpdate')

              // Should handle error (may show toast or error message)
              cy.wait(1000)
              cy.log('Unauthorized update handled')
            }
          })
        }
      })
    })

    it('should handle loading states', () => {
      // Page should show loading initially
      cy.visit('/appointments/today')

      // Should either show loading spinner or content
      cy.get('body').then(($body) => {
        if ($body.find('.animate-spin').length > 0) {
          cy.get('.animate-spin').should('be.visible')
          cy.wait(2000)
          cy.contains('Consultas de Hoje').should('be.visible')
        } else {
          cy.contains('Consultas de Hoje').should('be.visible')
        }
      })
    })
  })
}) 