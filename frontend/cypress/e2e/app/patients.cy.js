/// <reference types="cypress" />

describe('Patients use case', () => {
  beforeEach(() => {
    cy.intercept('GET', '/users/patients', [
      { id: '1', name: 'Carlos', email: 'c@example.com' }
    ]);
    cy.intercept('GET', '/appointments', []);
  });

  it('principal flow - list patients for doctor', () => {
    cy.setCookie('token', 'doctor');
    cy.visit('/patients');
    cy.contains('Carlos');
  });

  it('alternative flow - search by name', () => {
    cy.setCookie('token', 'doctor');
    cy.visit('/patients');
    cy.get('input[placeholder="Buscar paciente por nome ou email..."]').type('Carlos');
    cy.contains('Carlos');
  });

  it('exception flow - redirect patient user', () => {
    cy.setCookie('token', 'patient');
    cy.visit('/patients');
    cy.url().should('include', '/dashboard');
  });
});
