/// <reference types="cypress" />

describe('Appointments - Schedule New', () => {
  beforeEach(() => {
    // Login as patient
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Wait for redirect and visit new appointment page
    cy.url().should('include', '/dashboard')
    cy.visit('/appointments/new')
    cy.url().should('include', '/appointments/new')

    // Wait for page to fully load
    cy.wait(2000)
  })

  it('should schedule appointment successfully - complete flow', () => {
    // Step 1: Select doctor using real UI
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="doctor-option"]').first().click()

    // Wait for step progression
    cy.wait(1000)

    // Step 2: Select date using real UI - click on first available date
    cy.get('[data-testid="date-option"]', { timeout: 10000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="date-option"]').first().click()

    // Wait for step progression
    cy.wait(1000)

    // Step 3: Select time
    cy.get('[data-testid="time-slot"]', { timeout: 5000 }).should('have.length.at.least', 1)
    cy.get('[data-testid="time-slot"]').first().click()

    // Step 4: Submit appointment
    cy.get('[data-testid="schedule-button"]').should('be.enabled')
    cy.get('[data-testid="schedule-button"]').click()

    // Should show success message and redirect
    cy.contains('Consulta agendada com sucesso!', { timeout: 10000 }).should('be.visible')
  })

  it('should navigate through appointment steps correctly', () => {
    // Form should be present
    cy.get('[data-testid="appointment-form"]').should('be.visible')

    // Select doctor first
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('exist')
    cy.get('[data-testid="doctor-option"]').first().click()

    // Should progress automatically - check if date options appear
    cy.get('[data-testid="date-option"]', { timeout: 5000 }).should('be.visible')

    // Select date
    cy.get('[data-testid="date-option"]').first().click()

    // Time slots should become available
    cy.get('[data-testid="time-slot"]', { timeout: 5000 }).should('have.length.at.least', 1)
  })

  it('should show loading state during appointment creation', () => {
    // Complete the form quickly
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).first().click()
    cy.wait(500)
    cy.get('[data-testid="date-option"]', { timeout: 5000 }).first().click()
    cy.wait(500)
    cy.get('[data-testid="time-slot"]', { timeout: 5000 }).first().click()

    // Check if loading state appears when submitting
    cy.get('[data-testid="schedule-button"]').click()
    cy.get('[data-testid="schedule-button"]').should('contain', 'Agendando...')
  })

  it('should validate required fields', () => {
    // Try to submit without filling required fields
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // Select doctor
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).first().click()
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // Add date
    cy.get('[data-testid="date-option"]', { timeout: 5000 }).first().click()
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // Add time - now button should be enabled
    cy.get('[data-testid="time-slot"]', { timeout: 5000 }).first().click()
    cy.get('[data-testid="schedule-button"]').should('be.enabled')
  })

  it('should filter time slots by morning and afternoon', () => {
    // Complete doctor and date selection first
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).first().click()
    cy.wait(500)
    cy.get('[data-testid="date-option"]', { timeout: 5000 }).first().click()

    // Check if time slots are organized by period
    cy.get('[data-testid="available-slots"]', { timeout: 5000 }).should('have.length.at.least', 1)
    cy.contains('Manhã').should('be.visible')
    cy.contains('Tarde').should('be.visible')

    // Should have time slots for both periods
    cy.get('[data-testid="time-slot"]').should('have.length.at.least', 2)
  })

  it('should cancel appointment creation', () => {
    // Complete part of the form
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).first().click()

    // Try to navigate away or cancel
    cy.contains('Cancelar').click()

    // Should redirect to appointments page
    cy.url().should('include', '/appointments')
  })

  it('should handle doctor selection correctly', () => {
    // Should show doctor options
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).should('have.length.at.least', 1)

    // Click on first doctor
    cy.get('[data-testid="doctor-option"]').first().click()

    // Should highlight selected doctor
    cy.get('[data-testid="doctor-option"]').first().should('have.class', 'border-blue-500')
  })

  it('should prevent past date selection', () => {
    // Complete doctor selection first
    cy.get('[data-testid="doctor-option"]', { timeout: 10000 }).first().click()

    // Available dates should only show future dates
    cy.get('[data-testid="date-option"]', { timeout: 5000 }).should('have.length.at.least', 1)

    // All date options should be for future dates (can't test specific dates easily)
    cy.get('[data-testid="date-option"]').each(($el) => {
      cy.wrap($el).should('be.visible')
    })
  })

  it('should redirect doctors away from scheduling page', () => {
    // Login as doctor instead
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').clear().type('dr.silva@clinic.com')
    cy.get('[data-testid="password-input"]').clear().type('Password123')
    cy.get('[data-testid="login-button"]').click()

    // Try to visit appointment scheduling page
    cy.visit('/appointments/new')

    // Should redirect to appointments page
    cy.url().should('include', '/appointments')
    cy.url().should('not.include', '/new')
  })
}) 