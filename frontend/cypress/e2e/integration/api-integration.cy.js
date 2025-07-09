/**
 * TESTES DE INTEGRAÇÃO - API + FRONTEND
 * 
 * Testa a comunicação entre frontend e backend
 * Valida fluxos de dados completos
 */

describe('API Integration Tests', () => {
  beforeEach(() => {
    cy.setupApiInterceptors()
  })

  describe('Authentication Integration', () => {
    it('Should handle complete authentication flow', () => {
      // Test login flow with real API
      cy.visit('/login')

      cy.get('[data-testid="email-input"]').type('joao.patient@email.com')
      cy.get('[data-testid="password-input"]').type('Password123')
      cy.get('[data-testid="login-button"]').click()

      // Verify API call was made
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.request.body).to.deep.include({
          email: 'joao.patient@email.com',
          password: 'Password123'
        })
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('token')
        expect(interception.response.body).to.have.property('user')
      })

      // Verify frontend handles response correctly
      cy.shouldBeOnDashboard()
      cy.window().its('localStorage.token').should('exist')
    })

    it('Should handle token refresh flow', () => {
      cy.loginAsPatient()

      // Mock expired token scenario
      cy.intercept('GET', '**/appointments', {
        statusCode: 401,
        body: { error: 'Token expired' }
      }).as('expiredToken')

      cy.intercept('POST', '**/auth/refresh-token', {
        statusCode: 200,
        body: {
          token: 'new-token',
          refreshToken: 'new-refresh-token'
        }
      }).as('refreshToken')

      cy.visit('/appointments')

      // Should automatically refresh token
      cy.wait('@expiredToken')
      cy.wait('@refreshToken')

      // Should retry original request
      cy.get('[data-testid="appointments-page"]').should('be.visible')
    })
  })

  describe('Appointments Integration', () => {
    beforeEach(() => {
      cy.loginAsPatient()
    })

    it('Should handle complete appointment creation flow', () => {
      cy.visit('/appointments/new')

      // Load doctors
      cy.wait('@getDoctors').then((interception) => {
        expect(interception.response.statusCode).to.eq(200)
        expect(interception.response.body).to.have.property('doctors')
      })

      // Select doctor and date
      cy.get('[data-testid="doctor-select"]').select('Dr. Maria Silva')

      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)
      cy.get('[data-testid="date-picker"]').type(futureDate.toISOString().split('T')[0])

      // Load available slots
      cy.get('[data-testid="time-slot"]').first().click()
      cy.get('[data-testid="schedule-button"]').click()

      // Verify appointment creation
      cy.wait('@createAppointment').then((interception) => {
        expect(interception.request.body).to.have.property('doctorId')
        expect(interception.request.body).to.have.property('date')
        expect(interception.response.statusCode).to.eq(201)
      })

      cy.checkToast('Consulta agendada com sucesso')
    })

    it('Should handle appointment cancellation flow', () => {
      // Mock existing appointment
      cy.intercept('GET', '**/appointments', {
        body: {
          appointments: [{
            id: 'test-appointment',
            status: 'SCHEDULED',
            doctor: { name: 'Dr. Test' },
            date: new Date().toISOString()
          }]
        }
      }).as('getAppointments')

      cy.visit('/appointments')
      cy.wait('@getAppointments')

      cy.get('[data-testid="cancel-appointment"]').first().click()
      cy.get('[data-testid="confirm-cancel"]').click()

      cy.wait('@cancelAppointment').then((interception) => {
        expect(interception.request.method).to.eq('PUT')
        expect(interception.request.url).to.include('/cancel')
        expect(interception.response.statusCode).to.eq(200)
      })
    })
  })

  describe('Error Handling Integration', () => {
    it('Should handle network errors gracefully', () => {
      cy.intercept('POST', '**/auth/login', { forceNetworkError: true }).as('networkError')

      cy.visit('/login')
      cy.fillLoginForm('test@email.com', 'password')
      cy.get('[data-testid="login-button"]').click()

      cy.wait('@networkError')
      cy.shouldShowError('Erro de conexão. Tente novamente.')
    })

    it('Should handle server errors (500)', () => {
      cy.intercept('GET', '**/appointments', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      }).as('serverError')

      cy.loginAsPatient()
      cy.visit('/appointments')

      cy.wait('@serverError')
      cy.shouldShowError('Erro interno do servidor')
    })
  })

  describe('Real-time Data Integration', () => {
    it('Should update UI when data changes', () => {
      cy.loginAsPatient()

      // Initial load
      cy.intercept('GET', '**/appointments', {
        body: { appointments: [] }
      }).as('emptyAppointments')

      cy.visit('/appointments')
      cy.wait('@emptyAppointments')
      cy.get('[data-testid="no-appointments"]').should('be.visible')

      // Simulate new appointment added
      cy.intercept('GET', '**/appointments', {
        body: {
          appointments: [{
            id: '1',
            status: 'SCHEDULED',
            doctor: { name: 'Dr. New' },
            date: new Date().toISOString()
          }]
        }
      }).as('newAppointments')

      // Refresh or trigger refetch
      cy.get('[data-testid="refresh-appointments"]').click()
      cy.wait('@newAppointments')

      cy.get('[data-testid="appointment-card"]').should('have.length', 1)
    })
  })
}) 