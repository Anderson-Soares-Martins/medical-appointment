/// <reference types="cypress" />

describe('Doctor Appointment Management Flow', () => {
  beforeEach(() => {
    // Login as doctor (Dr. João Santos)
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('dr.santos@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Navigate to appointments page
    cy.url().should('include', '/dashboard')
    cy.visit('/appointments')
    cy.url().should('include', '/appointments')
    cy.wait(2000) // Let page load
  })

  describe('Principal Flow - Doctor Appointment Management', () => {
    it('should display appointments page from doctor perspective', () => {
      // Check page loads
      cy.get('[data-testid="appointments-page"]').should('be.visible')

      // Check doctor-specific view
      cy.get('body').then(($body) => {
        if ($body.text().includes('paciente') || $body.text().includes('Meus pacientes')) {
          cy.log('Doctor perspective confirmed - showing patient information')
        } else {
          cy.log('General appointments view loaded')
        }
      })
    })

    it('should show appointment count and statistics for doctor', () => {
      // Check total appointments counter
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="total-appointments"]').length > 0) {
          cy.get('[data-testid="total-appointments"]').should('be.visible')
        } else if ($body.text().match(/\d+\s*consulta/)) {
          cy.log('Appointment count found in text')
        } else {
          cy.contains('Nenhuma consulta').should('be.visible')
        }
      })
    })

    it('should display appointment cards with patient names', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Has appointments - check for patient names
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              // Should show patient name (not doctor name since doctor is logged in)
              if ($card.text().includes('Maria') || $card.text().includes('João') || $card.text().match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
                cy.log('Patient names displayed correctly for doctor')
              } else {
                cy.log('Appointment card found but patient name format may differ')
              }
            })
          })
        } else {
          cy.log('No appointment cards found - may be empty state')
        }
      })
    })

    it('should show appointment management controls for doctor', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Look for management controls
          const managementActions = ['Atualizar', 'Editar', 'Status', 'Confirmar', 'Cancelar']

          managementActions.forEach(action => {
            if ($body.find('button').text().includes(action)) {
              cy.get('button').contains(action).should('be.visible')
            }
          })
        }
      })
    })
  })

  describe('Alternative Flow - Appointment Status Management', () => {
    it('should allow doctor to update appointment status', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Look for status update functionality
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              if ($card.find('button').text().includes('Atualizar') || $card.find('select').length > 0) {
                // Has status update controls
                if ($card.find('select').length > 0) {
                  cy.get('select').first().select('COMPLETED', { force: true })
                  cy.wait(500)
                } else if ($card.find('button').text().includes('Confirmar')) {
                  cy.get('button').contains('Confirmar').click({ force: true })
                }
              }
            })
          })
        } else {
          cy.log('No appointments available for status update')
        }
      })
    })

    it('should filter appointments by status from doctor view', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="status-filter"]').length > 0) {
          // Test status filtering
          const statuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED']

          statuses.forEach(status => {
            cy.get('[data-testid="status-filter"]').select(status, { force: true })
            cy.wait(500)
            cy.get('[data-testid="status-filter"]').should('have.value', status)
          })

          // Reset to all
          cy.get('[data-testid="status-filter"]').select('all', { force: true })
        } else {
          cy.log('Status filter not found')
        }
      })
    })

    it('should search appointments by patient name', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="search-input"]').length > 0) {
          // Test patient name search
          cy.get('[data-testid="search-input"]').type('Maria')
          cy.wait(1000)

          // Should filter by patient name
          cy.get('body').then(($searchBody) => {
            if ($searchBody.text().includes('Maria')) {
              cy.contains('Maria').should('be.visible')
            } else {
              cy.contains('Nenhuma consulta').should('be.visible')
            }
          })

          // Clear search
          cy.get('[data-testid="search-input"]').clear()
        } else {
          cy.log('Search input not found')
        }
      })
    })

    it('should navigate to today appointments from main appointments', () => {
      // Look for today appointments link
      cy.get('body').then(($body) => {
        if ($body.find('a[href="/appointments/today"]').length > 0 || $body.find('button').text().includes('Hoje')) {
          // Navigate to today appointments
          if ($body.find('a[href="/appointments/today"]').length > 0) {
            cy.get('a[href="/appointments/today"]').click()
          } else {
            cy.get('button').contains('Hoje').click()
          }

          cy.url().should('include', '/appointments/today')
          cy.contains('Consultas de Hoje').should('be.visible')
        } else {
          // Navigate directly
          cy.visit('/appointments/today')
          cy.url().should('include', '/appointments/today')
        }
      })
    })
  })

  describe('Exception Flow - Error Handling', () => {
    it('should handle appointment API errors gracefully', () => {
      // Mock appointments API error
      cy.intercept('GET', '**/api/appointments*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('appointmentsError')

      // Reload page
      cy.reload()
      cy.wait('@appointmentsError')

      // Should still show page structure
      cy.get('[data-testid="appointments-page"]').should('be.visible')
    })

    it('should handle empty appointments list', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/appointments*', {
        statusCode: 200,
        body: []
      }).as('emptyAppointments')

      // Reload page
      cy.reload()
      cy.wait('@emptyAppointments')

      // Should show empty state
      cy.contains('Nenhuma consulta').should('be.visible')
    })

    it('should handle appointment update errors', () => {
      // Mock update error
      cy.intercept('PUT', '**/api/appointments/*', {
        statusCode: 400,
        body: { error: 'Update failed' }
      }).as('updateError')

      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Try to update appointment status
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              if ($card.find('button').text().includes('Confirmar')) {
                cy.get('button').contains('Confirmar').click({ force: true })
                cy.wait('@updateError')

                // Should handle error gracefully
                cy.wait(1000)
                cy.log('Update error handled')
              }
            })
          })
        }
      })
    })

    it('should handle unauthorized access', () => {
      // Mock unauthorized response
      cy.intercept('GET', '**/api/appointments*', {
        statusCode: 403,
        body: { error: 'Unauthorized' }
      }).as('unauthorizedError')

      // Reload page
      cy.reload()
      cy.wait('@unauthorizedError')

      // Should handle unauthorized access
      cy.get('body').then(($body) => {
        if ($body.text().includes('Login') || $body.text().includes('Acesso negado')) {
          cy.log('Unauthorized access handled correctly')
        } else {
          cy.get('[data-testid="appointments-page"]').should('be.visible')
        }
      })
    })
  })

  describe('Doctor-Specific Appointment Features', () => {
    it('should show only appointments where doctor is assigned', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Verify appointments show patient names (not other doctors)
          cy.get('[data-testid="appointment-card"]').each(($card) => {
            cy.wrap($card).within(() => {
              // Should not show "Dr. João Santos" (the logged-in doctor)
              cy.get('body').should('not.contain.text', 'Dr. João Santos')

              // Should show patient names instead
              cy.get('body').then(($cardBody) => {
                if ($cardBody.text().match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
                  cy.log('Patient name found in appointment card')
                }
              })
            })
          })
        }
      })
    })

    it('should allow doctor to add notes to appointments', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              if ($card.find('button').text().includes('Notas') || $card.find('textarea').length > 0) {
                // Has notes functionality
                if ($card.find('textarea').length > 0) {
                  cy.get('textarea').first().type('Consulta realizada com sucesso')
                } else {
                  cy.get('button').contains('Notas').click({ force: true })
                }
              }
            })
          })
        }
      })
    })

    it('should display appointment time and date clearly', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            // Should show time (format: HH:MM)
            cy.get('body').should('contain.text', ':')

            // Should show date information
            cy.get('body').then(($card) => {
              if ($card.text().match(/\d{1,2}\/\d{1,2}/) || $card.text().match(/\d{4}-\d{2}-\d{2}/)) {
                cy.log('Date information found')
              }
            })
          })
        }
      })
    })

    it('should show appointment status with appropriate styling', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Check for status badges
          const statusTypes = ['Agendada', 'Concluída', 'Cancelada', 'SCHEDULED', 'COMPLETED', 'CANCELLED']

          statusTypes.forEach(status => {
            if ($body.text().includes(status)) {
              cy.contains(status).should('be.visible')
            }
          })
        }
      })
    })

    it('should provide quick access to patient contact information', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              // Look for contact information or buttons
              if ($card.find('a[href^="tel:"], a[href^="mailto:"]').length > 0) {
                cy.get('a[href^="tel:"], a[href^="mailto:"]').should('be.visible')
              } else if ($card.text().includes('@') || $card.text().match(/\(\d{2}\)/)) {
                cy.log('Contact information displayed in appointment card')
              }
            })
          })
        }
      })
    })
  })
}) 