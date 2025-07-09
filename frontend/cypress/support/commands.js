// Custom commands for the medical appointment system

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type(email)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()
    cy.url().should('include', '/dashboard')
  })
})

// Login as specific user types
Cypress.Commands.add('loginAsPatient', () => {
  cy.login('joao.patient@email.com', 'Password123')
})

Cypress.Commands.add('loginAsDoctor', () => {
  cy.login('dr.silva@clinic.com', 'Password123')
})

// API interceptors
Cypress.Commands.add('setupApiInterceptors', () => {
  cy.intercept('POST', '**/auth/login').as('loginRequest')
  cy.intercept('POST', '**/auth/register').as('registerRequest')
  cy.intercept('GET', '**/appointments').as('getAppointments')
  cy.intercept('POST', '**/appointments').as('createAppointment')
  cy.intercept('PUT', '**/appointments/*/cancel').as('cancelAppointment')
  cy.intercept('GET', '**/users/doctors').as('getDoctors')
})

// Check toast message
Cypress.Commands.add('checkToast', (message) => {
  cy.get('[data-testid="toast"]', { timeout: 5000 })
    .should('be.visible')
    .and('contain', message)
})

// Form helpers
Cypress.Commands.add('fillLoginForm', (email, password) => {
  cy.get('[data-testid="email-input"]').clear().type(email)
  cy.get('[data-testid="password-input"]').clear().type(password)
})

// Assertions helpers
Cypress.Commands.add('shouldBeOnDashboard', () => {
  cy.url().should('include', '/dashboard')
  cy.get('[data-testid="dashboard-title"]').should('be.visible')
})

Cypress.Commands.add('shouldShowError', (message) => {
  cy.get('[data-testid="error-message"]')
    .should('be.visible')
    .and('contain', message)
}) 