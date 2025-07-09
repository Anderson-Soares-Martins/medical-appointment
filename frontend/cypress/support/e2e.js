// Import commands.js using ES2015 syntax:
import './commands'

// Global error handling
Cypress.on('uncaught:exception', (err) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// Setup before each test
beforeEach(() => {
  // Clear local storage
  cy.clearLocalStorage()
}) 