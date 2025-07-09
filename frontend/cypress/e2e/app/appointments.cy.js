/// <reference types="cypress" />

describe('Appointments use case', () => {
  beforeEach(() => {
    cy.intercept('GET', '/appointments', {
      appointments: [
        { id: '1', status: 'SCHEDULED', date: '2024-01-01T10:00', doctor: { name: 'Ana', specialty: 'Cardio' } }
      ]
    });
  });

  it('principal flow - list appointments', () => {
    cy.setCookie('token', 'patient');
    cy.visit('/appointments');
    cy.get('[data-testid="appointment-card"]').should('have.length', 1);
  });

  it('alternative flow - cancel appointment', () => {
    cy.setCookie('token', 'patient');
    cy.intercept('DELETE', '/appointments/1', {});
    cy.visit('/appointments');
    cy.get('[data-testid="cancel-appointment"]').click();
    cy.get('[data-testid="confirm-cancel"]').click();
  });

  it('exception flow - empty state', () => {
    cy.intercept('GET', '/appointments', { appointments: [] }).as('noAppt');
    cy.setCookie('token', 'patient');
    cy.visit('/appointments');
    cy.wait('@noAppt');
    cy.get('[data-testid="no-appointments"]').should('exist');
  });
});
