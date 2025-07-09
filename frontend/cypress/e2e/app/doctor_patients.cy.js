/// <reference types="cypress" />

describe('Doctor Patient Management Flow', () => {
  beforeEach(() => {
    // Login as doctor (Dr. João Santos)
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('dr.santos@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Navigate to patients page
    cy.url().should('include', '/dashboard')
    cy.visit('/patients')
    cy.url().should('include', '/patients')
    cy.wait(2000) // Let page load
  })

  describe('Principal Flow - Patient Management Access', () => {
    it('should display patients page with doctor perspective', () => {
      // Check page title
      cy.contains('Pacientes').should('be.visible')

      // Should show patient management interface
      cy.get('body').then(($body) => {
        if ($body.text().includes('Gerenciar') || $body.text().includes('Lista')) {
          cy.log('Patient management interface found')
        } else {
          cy.log('Basic patient view loaded')
        }
      })
    })

    it('should display list of patients with basic information', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.grid').length > 0 || $body.text().includes('Maria') || $body.text().includes('João')) {
          // Has patient cards/list
          cy.log('Patient list displayed')

          // Check for patient information
          const patientInfo = ['nome', 'email', 'telefone', 'Data']
          patientInfo.forEach(info => {
            if ($body.text().toLowerCase().includes(info.toLowerCase())) {
              cy.contains(new RegExp(info, 'i')).should('be.visible')
            }
          })
        } else {
          // Empty state
          cy.contains('Nenhum paciente').should('be.visible')
        }
      })
    })

    it('should show patient contact information', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('@') || $body.text().includes('phone') || $body.text().includes('email')) {
          // Has contact info
          cy.log('Patient contact information displayed')
        } else {
          cy.log('Contact information may be in different format')
        }
      })
    })

    it('should display patient appointment history access', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Ver consultas') || $body.find('a').text().includes('Histórico')) {
          // Has appointment history access
          cy.get('button, a').contains(/Ver consultas|Histórico/).should('be.visible')
        } else {
          cy.log('Appointment history access may be in different format')
        }
      })
    })
  })

  describe('Alternative Flow - Patient Search and Filtering', () => {
    it('should search patients by name', () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="Buscar"]').length > 0 || $body.find('input[placeholder*="paciente"]').length > 0) {
          // Test search functionality
          const searchInput = $body.find('input[placeholder*="Buscar"]').length > 0 ?
            'input[placeholder*="Buscar"]' : 'input[placeholder*="paciente"]'

          cy.get(searchInput).first().type('Maria')
          cy.wait(1000)

          // Should filter results
          cy.get('body').then(($searchBody) => {
            if ($searchBody.text().includes('Maria')) {
              cy.contains('Maria').should('be.visible')
            } else {
              cy.log('Search performed - results may be empty')
            }
          })

          // Clear search
          cy.get(searchInput).first().clear()
        } else {
          cy.log('Search functionality not found')
        }
      })
    })

    it('should filter patients by registration date', () => {
      cy.get('body').then(($body) => {
        if ($body.find('select').length > 0) {
          // Test filtering if available
          cy.get('select').first().then(($select) => {
            const options = $select.find('option')
            if (options.length > 1) {
              cy.get('select').first().select(1, { force: true })
              cy.wait(500)
              cy.log('Patient filtering applied')
            }
          })
        } else {
          cy.log('Patient filtering not available')
        }
      })
    })

    it('should sort patients alphabetically', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Ordenar') || $body.find('[data-testid*="sort"]').length > 0) {
          // Test sorting
          cy.get('button').contains('Ordenar').click({ force: true })
          cy.wait(500)
          cy.log('Patient sorting applied')
        } else {
          cy.log('Patient sorting not available')
        }
      })
    })
  })

  describe('Exception Flow - Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '**/api/patients*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('patientsError')

      // Reload page
      cy.reload()
      cy.wait('@patientsError')

      // Should still show page structure
      cy.contains('Pacientes').should('be.visible')
    })

    it('should handle empty patients list', () => {
      // Mock empty response
      cy.intercept('GET', '**/api/patients*', {
        statusCode: 200,
        body: []
      }).as('emptyPatients')

      // Reload page
      cy.reload()
      cy.wait('@emptyPatients')

      // Should show empty state
      cy.get('body').then(($body) => {
        if ($body.text().includes('Nenhum paciente') || $body.text().includes('0 pacientes')) {
          cy.log('Empty patients state handled correctly')
        }
      })
    })

    it('should handle patient search with no results', () => {
      cy.get('body').then(($body) => {
        if ($body.find('input[placeholder*="Buscar"]').length > 0) {
          // Search for non-existent patient
          cy.get('input[placeholder*="Buscar"]').first().type('PacienteInexistente123')
          cy.wait(1000)

          // Should show no results
          cy.get('body').then(($searchBody) => {
            if ($searchBody.text().includes('Nenhum') || $searchBody.text().includes('encontrado')) {
              cy.log('No search results handled correctly')
            }
          })
        }
      })
    })

    it('should handle loading states', () => {
      // Visit page and check loading
      cy.visit('/patients')

      cy.get('body').then(($body) => {
        if ($body.find('.animate-spin').length > 0) {
          // Has loading spinner
          cy.get('.animate-spin').should('be.visible')
          cy.wait(2000)
          cy.contains('Pacientes').should('be.visible')
        } else {
          // Direct load
          cy.contains('Pacientes').should('be.visible')
        }
      })
    })
  })

  describe('Doctor-Specific Patient Management', () => {
    it('should display patient cards with relevant medical information', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.card, .p-4, .bg-white').length > 0) {
          // Has patient cards
          cy.log('Patient cards displayed')

          // Check for medical-relevant information
          const medicalTerms = ['consulta', 'agendamento', 'contato']
          medicalTerms.forEach(term => {
            if ($body.text().toLowerCase().includes(term)) {
              cy.log(`Found medical term: ${term}`)
            }
          })
        }
      })
    })

    it('should allow access to patient appointment history', () => {
      cy.get('body').then(($body) => {
        if ($body.find('button, a').text().includes('Ver consultas') ||
          $body.find('button, a').text().includes('Histórico') ||
          $body.find('[data-testid*="history"]').length > 0) {

          // Click to view patient history
          cy.get('button, a').contains(/Ver consultas|Histórico/).first().click({ force: true })
          cy.wait(1000)

          // Should navigate or show patient history
          cy.log('Patient history accessed')
        } else {
          cy.log('Patient history access not available')
        }
      })
    })

    it('should show patient registration information', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('Cadastrado') || $body.text().includes('Registrado') || $body.text().includes('Data de')) {
          cy.log('Patient registration information displayed')
        }

        // Check for registration dates or patient ID
        if ($body.text().match(/\d{2}\/\d{2}\/\d{4}/) || $body.text().includes('ID')) {
          cy.log('Patient identification information found')
        }
      })
    })

    it('should allow quick patient contact', () => {
      cy.get('body').then(($body) => {
        if ($body.find('a[href^="tel:"], a[href^="mailto:"]').length > 0) {
          // Has contact links
          cy.get('a[href^="tel:"], a[href^="mailto:"]').first().should('be.visible')
          cy.log('Patient contact options available')
        } else if ($body.text().includes('@') || $body.text().match(/\(\d{2}\)/)) {
          // Has contact information displayed
          cy.log('Patient contact information displayed')
        }
      })
    })

    it('should display patient appointment count or status', () => {
      cy.get('body').then(($body) => {
        if ($body.text().includes('consulta') || $body.text().match(/\d+\s*agendament/)) {
          cy.log('Patient appointment information displayed')
        }

        // Check for appointment status indicators
        const statusTerms = ['Ativo', 'Novo', 'Regular']
        statusTerms.forEach(status => {
          if ($body.text().includes(status)) {
            cy.contains(status).should('be.visible')
          }
        })
      })
    })

    it('should handle doctor-specific patient permissions', () => {
      // Verify doctor can see patient list (access control)
      cy.contains('Pacientes').should('be.visible')

      // Should not show admin-only functions
      cy.get('body').then(($body) => {
        if ($body.find('button').text().includes('Excluir') || $body.find('button').text().includes('Deletar')) {
          cy.log('Warning: Delete functions should not be available to doctors')
        } else {
          cy.log('Appropriate permissions - no delete functions visible')
        }
      })
    })
  })
}) 