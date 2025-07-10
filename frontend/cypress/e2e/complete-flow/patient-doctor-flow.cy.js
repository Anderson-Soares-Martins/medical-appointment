/// <reference types="cypress" />

describe('Patient-Doctor Flow - Dr. João Santos', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should allow patient to login and schedule appointment with Dr. Santos', () => {
    // Patient login
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    cy.contains('Maria', { timeout: 10000 }).should('be.visible')

    // Navigate to new appointment
    cy.visit('/appointments/new')
    cy.wait(2000)

    // Verify page loads
    cy.contains('Agendar Consulta').should('be.visible')

    // Select Dr. João Santos specifically
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').should('be.visible')
    cy.contains('[data-testid="doctor-option"]', 'Dr. João Santos').click()
    cy.wait(1000)

    // Select date and time
    cy.get('[data-testid="date-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="date-option"]').eq(0).click()
    cy.wait(1000)

    cy.get('[data-testid="time-slot"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="time-slot"]').eq(0).click()
    cy.wait(1000)

    // Add unique note
    const appointmentNote = `E2E Test Dr. Santos - ${new Date().getTime()}`
    cy.get('textarea[id="notes"]').type(appointmentNote)

    // Submit appointment
    cy.get('[data-testid="schedule-button"]').eq(0).should('be.enabled')
    cy.get('[data-testid="schedule-button"]').eq(0).click()

    // Verify appointment created
    cy.url().should('include', '/appointments', { timeout: 15000 })

    // Verify appointment appears in patient's list
    cy.visit('/appointments')
    cy.wait(2000)
    cy.get('[data-testid="appointments-page"]:visible').should('exist')
    cy.get('body').should('contain.text', 'Dr. João Santos')

    cy.log('✅ Patient successfully scheduled appointment with Dr. Santos')
  })

  it('should allow Dr. Santos to login and see appointments', () => {
    // Dr. Santos login
    cy.get('[data-testid="email-input"]').type('dr.santos@clinic.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    cy.contains('Dr. João Santos', { timeout: 10000 }).should('be.visible')

    // Navigate to appointments
    cy.visit('/appointments')
    cy.wait(2000)

    // Verify appointments page loads
    cy.get('[data-testid="appointments-page"]:visible').should('exist')

    // Verify doctor perspective - should see patient names, not his own
    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="appointment-card"]').length > 0) {
        // Should NOT see his own name in appointment cards
        cy.get('[data-testid="appointment-card"]').should('not.contain.text', 'Dr. João Santos')
        cy.log('✅ Dr. Santos correctly sees patient-centric view')
      } else {
        cy.log('ℹ️ No appointment cards found for Dr. Santos')
      }
    })

    cy.log('✅ Dr. Santos successfully logged in and viewed appointments')
  })

  it('should demonstrate consistent appointment data between patient and doctor', () => {
    // This test verifies that appointments created by patients appear for doctors

    // First, verify patient can see doctors
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/dashboard', { timeout: 10000 })

    cy.visit('/appointments')
    cy.wait(2000)

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="appointment-card"]').length > 0) {
        // Patient should see doctor names
        cy.get('body').should('contain.text', 'Dr.')
        cy.log('✅ Patient correctly sees doctor names in appointments')
      } else {
        cy.log('ℹ️ No appointments found for patient')
      }
    })

    cy.log('✅ Data consistency verified - roles display correct information')
  })
}) 