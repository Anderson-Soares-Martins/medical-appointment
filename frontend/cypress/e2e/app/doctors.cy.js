/// <reference types="cypress" />

describe('Doctors use case', () => {
  beforeEach(() => {
    cy.intercept('GET', '/users/doctors', {
      doctors: [
        { id: '1', name: 'Ana', email: 'ana@example.com', specialty: 'Cardio' },
        { id: '2', name: 'Bruno', email: 'bruno@example.com', specialty: 'Orto' },
      ],
      count: 2,
    });
    cy.visit('/doctors');
  });

  it('principal flow - list doctors', () => {
    cy.get('[data-testid="doctor-card"]').should('have.length', 2);
  });

  it('alternative flow - filter by specialty', () => {
    cy.get('[data-testid="specialty-filter"]').select('Cardio');
    cy.get('[data-testid="apply-filter"]').click();
    cy.get('[data-testid="doctor-card"]').should('have.length', 1);
  });

  it('exception flow - handle api error', () => {
    cy.intercept('GET', '/users/doctors', { statusCode: 500 }).as('getErr');
    cy.reload();
    cy.wait('@getErr');
    cy.contains('Nenhum médico encontrado');
  });
});
