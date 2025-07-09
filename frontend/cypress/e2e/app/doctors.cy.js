/// <reference types="cypress" />

describe('Doctors Listing - Patient View', () => {
  beforeEach(() => {
    // Login como paciente para ver médicos
    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type('maria.patient@email.com')
    cy.get('[data-testid="password-input"]').type('Password123')
    cy.get('[data-testid="login-button"]').click()

    cy.url().should('include', '/dashboard')
    cy.visit('/doctors')
    cy.wait(2000) // Aguarda carregamento completo
  })

  it('should display complete list of doctors with specialties', () => {
    // Deve mostrar página de médicos
    cy.contains('Médicos').should('be.visible')
    cy.contains('Encontre o médico ideal para sua consulta').should('be.visible')

    // Deve mostrar Dr. João Silva (Cardiologia)
    cy.contains('Dr. João Silva').should('be.visible')
    cy.contains('Cardiologia').should('be.visible')
    cy.contains('CRM-SP 12345').should('be.visible')

    // Deve mostrar Dra. Ana Costa (Dermatologia)
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')
    cy.contains('CRM-SP 67890').should('be.visible')

    // Deve mostrar Dra. Maria Santos (Pediatria)
    cy.contains('Dra. Maria Santos').should('be.visible')
    cy.contains('Pediatria').should('be.visible')
    cy.contains('CRM-SP 11223').should('be.visible')

    // Deve mostrar informações adicionais
    cy.contains('anos de experiência').should('be.visible')
    cy.contains('Disponível').should('be.visible')
  })

  it('should filter doctors by specialty - Dermatologia', () => {
    // Testa filtro por especialidade
    cy.get('input[placeholder*="Buscar médico"]').should('be.visible')
    cy.get('input[placeholder*="Buscar médico"]').type('Dermatologia')
    cy.wait(500)

    // Deve mostrar apenas Dra. Ana Costa
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')

    // Não deve mostrar outros médicos
    cy.get('body').should('not.contain', 'Dr. João Silva')
    cy.get('body').should('not.contain', 'Cardiologia')
  })

  it('should filter doctors by specialty - Cardiologia', () => {
    // Testa filtro por Cardiologia
    cy.get('input[placeholder*="Buscar médico"]').type('Cardiologia')
    cy.wait(500)

    // Deve mostrar apenas Dr. João Silva
    cy.contains('Dr. João Silva').should('be.visible')
    cy.contains('Cardiologia').should('be.visible')

    // Não deve mostrar outros médicos
    cy.get('body').should('not.contain', 'Dra. Ana Costa')
    cy.get('body').should('not.contain', 'Dermatologia')
  })

  it('should search doctors by name', () => {
    // Busca por nome específico
    cy.get('input[placeholder*="Buscar médico"]').clear().type('Ana')
    cy.wait(500)

    // Deve mostrar apenas Dra. Ana Costa
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')

    // Não deve mostrar outros médicos
    cy.get('body').should('not.contain', 'Dr. João Silva')
    cy.get('body').should('not.contain', 'Dra. Maria Santos')
  })

  it('should display doctor availability status', () => {
    // Verifica status de disponibilidade
    cy.contains('Disponível').should('be.visible')

    // Verifica se tem botão para agendar
    cy.get('button').contains('Agendar Consulta').should('be.visible')
    cy.get('button').contains('Agendar Consulta').should('have.length.at.least', 3)
  })

  it('should show doctor detailed information', () => {
    // Verifica informações detalhadas dos médicos

    // Dr. João Silva (Cardiologia)
    cy.contains('Dr. João Silva').parent().within(() => {
      cy.contains('Cardiologia').should('be.visible')
      cy.contains('15 anos de experiência').should('be.visible')
      cy.contains('Especialista em doenças cardíacas').should('be.visible')
      cy.contains('Segunda a Sexta: 08:00 - 17:00').should('be.visible')
    })

    // Dra. Ana Costa (Dermatologia)
    cy.contains('Dra. Ana Costa').parent().within(() => {
      cy.contains('Dermatologia').should('be.visible')
      cy.contains('10 anos de experiência').should('be.visible')
      cy.contains('Especialista em dermatologia clínica').should('be.visible')
      cy.contains('Segunda a Sexta: 09:00 - 18:00').should('be.visible')
    })

    // Dra. Maria Santos (Pediatria)
    cy.contains('Dra. Maria Santos').parent().within(() => {
      cy.contains('Pediatria').should('be.visible')
      cy.contains('12 anos de experiência').should('be.visible')
      cy.contains('Especialista em pediatria geral').should('be.visible')
      cy.contains('Segunda a Sexta: 07:00 - 16:00').should('be.visible')
    })
  })

  it('should navigate to appointment scheduling when clicking "Agendar Consulta"', () => {
    // Clica no botão de agendar da Dra. Ana Costa
    cy.contains('Dra. Ana Costa').parent().within(() => {
      cy.get('button').contains('Agendar Consulta').click()
    })

    // Deve redirecionar para página de agendamento
    cy.url().should('include', '/appointments/new')

    // Deve ter pré-selecionado a Dra. Ana Costa
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dermatologia').should('be.visible')
  })

  it('should clear search filter', () => {
    // Aplica filtro
    cy.get('input[placeholder*="Buscar médico"]').type('Cardiologia')
    cy.wait(500)

    // Deve mostrar apenas Dr. João Silva
    cy.contains('Dr. João Silva').should('be.visible')
    cy.get('body').should('not.contain', 'Dra. Ana Costa')

    // Limpa filtro
    cy.get('input[placeholder*="Buscar médico"]').clear()
    cy.wait(500)

    // Deve mostrar todos os médicos novamente
    cy.contains('Dr. João Silva').should('be.visible')
    cy.contains('Dra. Ana Costa').should('be.visible')
    cy.contains('Dra. Maria Santos').should('be.visible')
  })

  it('should show no results message for invalid search', () => {
    // Busca por especialidade inexistente
    cy.get('input[placeholder*="Buscar médico"]').type('Neurologia')
    cy.wait(500)

    // Deve mostrar mensagem de "nenhum resultado"
    cy.contains('Nenhum médico encontrado').should('be.visible')
    cy.contains('Tente buscar por outra especialidade').should('be.visible')
  })

  it('should handle API errors gracefully', () => {
    // Mock de erro na API
    cy.intercept('GET', '**/api/doctors*', {
      statusCode: 500,
      body: { error: 'Server error' }
    }).as('doctorsError')

    // Recarrega página para disparar erro
    cy.reload()
    cy.wait('@doctorsError')

    // Deve mostrar estado de erro
    cy.contains('Erro ao carregar médicos').should('be.visible')
    cy.contains('Tente novamente mais tarde').should('be.visible')
  })

  it('should show loading state while fetching doctors', () => {
    // Mock de resposta lenta
    cy.intercept('GET', '**/api/doctors*', {
      statusCode: 200,
      body: [],
      delay: 2000
    }).as('slowDoctors')

    // Recarrega página
    cy.reload()

    // Deve mostrar estado de carregamento
    cy.get('.animate-spin').should('be.visible')
    cy.contains('Carregando médicos').should('be.visible')

    // Aguarda resposta
    cy.wait('@slowDoctors')
  })

  it('should display correct doctor count', () => {
    // Verifica contador de médicos
    cy.contains('3 médicos disponíveis').should('be.visible')

    // Aplica filtro e verifica contador atualizado
    cy.get('input[placeholder*="Buscar médico"]').type('Dermatologia')
    cy.wait(500)

    cy.contains('1 médico encontrado').should('be.visible')
  })
})
