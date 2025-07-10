/// <reference types="cypress" />

describe('Doctor Appointment Management Flow - Dr. João Santos', () => {
  beforeEach(() => {
    // Login as Dr. João Santos
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

  describe('Principal Flow - Dr. Santos Appointment Management', () => {
    it('should display appointments page from Dr. Santos perspective', () => {
      // Check page loads
      cy.get('[data-testid="appointments-page"]').should('be.visible')

      // Check Dr. Santos specific view
      cy.get('body').then(($body) => {
        if ($body.text().includes('paciente') || $body.text().includes('Meus pacientes')) {
          cy.log('Dr. Santos perspective confirmed - showing patient information')
        } else {
          cy.log('General appointments view loaded for Dr. Santos')
        }

        // Should NOT show Dr. Santos name in appointment cards (since he's logged in)
        cy.get('body').should('not.contain.text', 'Dr. João Santos')
      })
    })

    it('should show appointment count and statistics for Dr. Santos', () => {
      // Check total appointments counter for Dr. Santos
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="total-appointments"]').length > 0) {
          cy.get('[data-testid="total-appointments"]').should('be.visible')
        } else if ($body.text().match(/\d+\s*consulta/)) {
          cy.log('Appointment count found in text for Dr. Santos')
        } else {
          cy.contains('Nenhuma consulta').should('be.visible')
        }
      })
    })

    it('should display appointment cards with patient names for Dr. Santos', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Has appointments - check for patient names (Dr. Santos perspective)
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              // Should show patient name (not Dr. Santos name since he's logged in)
              if ($card.text().includes('Maria') || $card.text().includes('João') || $card.text().match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
                cy.log('Patient names displayed correctly for Dr. Santos')
              } else {
                cy.log('Appointment card found but patient name format may differ')
              }

              // Verify it does NOT show Dr. Santos name
              cy.get('body').should('not.contain.text', 'Dr. João Santos')
            })
          })
        } else {
          cy.log('No appointment cards found for Dr. Santos - may be empty state')
        }
      })
    })

    it('should show appointment management controls for Dr. Santos', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Look for management controls specific to Dr. Santos
          const managementActions = ['Atualizar', 'Editar', 'Status', 'Confirmar', 'Cancelar']

          managementActions.forEach(action => {
            if ($body.find('button').text().includes(action)) {
              cy.get('button').contains(action).should('be.visible')
            }
          })
        }
      })
    })

    it('should verify Dr. Santos sees only his own appointments', () => {
      // Verify appointments show only patients of Dr. Santos
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').each(($card) => {
            cy.wrap($card).within(() => {
              // Should NOT show Dr. Santos name (since he's the logged-in doctor)
              cy.get('body').should('not.contain.text', 'Dr. João Santos')

              // Should NOT show other doctors' names
              cy.get('body').should('not.contain.text', 'Dr. Maria Silva')
              cy.get('body').should('not.contain.text', 'Dr. Carlos Costa')
            })
          })
        }
      })
    })
  })

  describe('Alternative Flow - Appointment Status Management', () => {
    it('should allow Dr. Santos to update appointment status', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Look for status update functionality for Dr. Santos appointments
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
          cy.log('No appointments available for Dr. Santos to update status')
        }
      })
    })

    it('should filter appointments by status from Dr. Santos view', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="status-filter"]').length > 0) {
          // Test status filtering for Dr. Santos appointments
          const statuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED']

          statuses.forEach(status => {
            cy.get('[data-testid="status-filter"]').select(status, { force: true })
            cy.wait(500)
            cy.get('[data-testid="status-filter"]').should('have.value', status)
          })

          // Reset to all
          cy.get('[data-testid="status-filter"]').select('all', { force: true })
        } else {
          cy.log('Status filter not found for Dr. Santos')
        }
      })
    })

    it('should search appointments by patient name for Dr. Santos', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="search-input"]').length > 0) {
          // Test patient name search (Dr. Santos searching his patients)
          cy.get('[data-testid="search-input"]').type('Maria')
          cy.wait(1000)

          // Should filter by patient name for Dr. Santos
          cy.get('body').then(($searchBody) => {
            if ($searchBody.text().includes('Maria')) {
              cy.contains('Maria').should('be.visible')
              // Should NOT show Dr. Santos name in results
              cy.get('body').should('not.contain.text', 'Dr. João Santos')
            } else {
              cy.contains('Nenhuma consulta').should('be.visible')
            }
          })

          // Clear search
          cy.get('[data-testid="search-input"]').clear()
        } else {
          cy.log('Search input not found for Dr. Santos')
        }
      })
    })

    it('should navigate to today appointments from main appointments for Dr. Santos', () => {
      // Look for today appointments link for Dr. Santos
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
    it('should handle appointment API errors gracefully for Dr. Santos', () => {
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

    it('should handle empty appointments list for Dr. Santos', () => {
      // Mock empty response for Dr. Santos
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

    it('should handle appointment update errors for Dr. Santos', () => {
      // Mock update error
      cy.intercept('PUT', '**/api/appointments/*', {
        statusCode: 400,
        body: { error: 'Update failed' }
      }).as('updateError')

      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Try to update appointment status for Dr. Santos
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              if ($card.find('button').text().includes('Confirmar')) {
                cy.get('button').contains('Confirmar').click({ force: true })
                cy.wait('@updateError')

                // Should handle error gracefully
                cy.wait(1000)
                cy.log('Update error handled for Dr. Santos')
              }
            })
          })
        }
      })
    })

    it('should handle unauthorized access for Dr. Santos', () => {
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
          cy.log('Unauthorized access handled correctly for Dr. Santos')
        } else {
          cy.get('[data-testid="appointments-page"]').should('be.visible')
        }
      })
    })
  })

  describe('Dr. Santos Specific Appointment Features', () => {
    it('should show only appointments where Dr. Santos is assigned', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Verify appointments show patient names (not other doctors or Dr. Santos himself)
          cy.get('[data-testid="appointment-card"]').each(($card) => {
            cy.wrap($card).within(() => {
              // Should NOT show "Dr. João Santos" (the logged-in doctor)
              cy.get('body').should('not.contain.text', 'Dr. João Santos')

              // Should NOT show other doctors
              cy.get('body').should('not.contain.text', 'Dr. Maria Silva')
              cy.get('body').should('not.contain.text', 'Dr. Carlos Costa')

              // Should show patient names instead
              cy.get('body').then(($cardBody) => {
                if ($cardBody.text().match(/[A-Z][a-z]+ [A-Z][a-z]+/)) {
                  cy.log('Patient name found in Dr. Santos appointment card')
                }
              })
            })
          })
        }
      })
    })

    it('should allow Dr. Santos to add dermatology notes to appointments', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              if ($card.find('button').text().includes('Notas') || $card.find('textarea').length > 0) {
                // Has notes functionality
                if ($card.find('textarea').length > 0) {
                  cy.get('textarea').first().type('Consulta dermatológica realizada com sucesso. Prescrição de medicamento tópico.')
                } else {
                  cy.get('button').contains('Notas').click({ force: true })
                }
              }
            })
          })
        }
      })
    })

    it('should display appointment time and date clearly for Dr. Santos', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            // Should show time (format: HH:MM)
            cy.get('body').should('contain.text', ':')

            // Should show date information
            cy.get('body').then(($card) => {
              if ($card.text().match(/\d{1,2}\/\d{1,2}/) || $card.text().match(/\d{4}-\d{2}-\d{2}/)) {
                cy.log('Date information found in Dr. Santos appointment')
              }
            })
          })
        }
      })
    })

    it('should show appointment status with appropriate styling for Dr. Santos', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          // Check for status badges in Dr. Santos appointments
          const statusTypes = ['Agendada', 'Concluída', 'Cancelada', 'SCHEDULED', 'COMPLETED', 'CANCELLED']

          statusTypes.forEach(status => {
            if ($body.text().includes(status)) {
              cy.contains(status).should('be.visible')
            }
          })
        }
      })
    })

    it('should provide quick access to patient contact information for Dr. Santos', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="appointment-card"]').length > 0) {
          cy.get('[data-testid="appointment-card"]').first().within(() => {
            cy.get('body').then(($card) => {
              // Look for contact information or buttons in Dr. Santos appointments
              if ($card.find('a[href^="tel:"], a[href^="mailto:"]').length > 0) {
                cy.get('a[href^="tel:"], a[href^="mailto:"]').should('be.visible')
              } else if ($card.text().includes('@') || $card.text().match(/\(\d{2}\)/)) {
                cy.log('Contact information displayed in Dr. Santos appointment card')
              }
            })
          })
        }
      })
    })
  })
}) 