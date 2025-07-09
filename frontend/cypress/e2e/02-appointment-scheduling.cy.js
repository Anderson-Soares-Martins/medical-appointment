/**
 * TESTES DE SISTEMA - UC03: AGENDAMENTO DE CONSULTAS
 * 
 * CT010 - Agendar Consulta com Médico Disponível (Fluxo Principal)
 * CT011 - Buscar Médicos por Especialidade (Fluxo Alternativo)
 * CT012 - Tentar Agendar em Horário Indisponível (Fluxo de Exceção)
 */

describe('UC03 - Agendamento de Consultas', () => {
  beforeEach(() => {
    cy.setupApiInterceptors()
    cy.loginAsPatient()
  })

  afterEach(() => {
    cy.cleanupTestData()
  })

  /**
   * CT010 - Agendar Consulta com Médico Disponível (Fluxo Principal)
   * Tipo: Sistema ✅
   */
  it('CT010 - Should schedule appointment with available doctor (Fluxo Principal)', () => {
    // Given: Paciente logado na página de novo agendamento
    cy.visit('/appointments/new')
    cy.get('[data-testid="appointment-form"]').should('be.visible')

    // And: Médicos disponíveis carregados
    cy.waitForApi('@getDoctors')
    cy.get('[data-testid="doctor-select"]').should('not.be.empty')

    // When: Selecionar médico disponível
    cy.get('[data-testid="doctor-select"]').select('Dr. Maria Silva')

    // And: Selecionar data futura
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7) // 7 dias no futuro
    const dateString = futureDate.toISOString().split('T')[0]

    cy.get('[data-testid="date-picker"]').type(dateString)

    // And: Aguardar carregamento dos horários disponíveis
    cy.get('[data-testid="loading-slots"]', { timeout: 5000 }).should('not.exist')
    cy.get('[data-testid="available-slots"]').should('be.visible')

    // And: Selecionar primeiro horário disponível
    cy.get('[data-testid="time-slot"]').first().click()
    cy.get('[data-testid="time-slot"].selected').should('exist')

    // And: Confirmar agendamento
    cy.get('[data-testid="schedule-button"]').should('not.be.disabled').click()

    // Wait for API response
    cy.waitForApi('@createAppointment')

    // Then: Deve mostrar mensagem de sucesso
    cy.checkToast('Consulta agendada com sucesso', 'success')

    // And: Deve redirecionar para lista de consultas
    cy.url().should('include', '/appointments')

    // And: Nova consulta deve aparecer na lista
    cy.get('[data-testid="appointment-card"]').should('exist')
    cy.get('[data-testid="appointment-card"]').first().should('contain', 'Dr. Maria Silva')

    // And: Status deve ser SCHEDULED
    cy.get('[data-testid="appointment-status"]').first().should('contain', 'Agendada')
  })

  /**
   * CT011 - Buscar Médicos por Especialidade (Fluxo Alternativo)
   * Tipo: Sistema ✅
   */
  it('CT011 - Should filter doctors by specialty (Fluxo Alternativo)', () => {
    // Given: Paciente na página de médicos
    cy.visit('/doctors')
    cy.get('[data-testid="doctors-page"]').should('be.visible')

    // And: Lista de médicos carregada
    cy.waitForApi('@getDoctors')
    cy.get('[data-testid="doctor-card"]').should('have.length.at.least', 1)

    // When: Filtrar por especialidade específica
    cy.get('[data-testid="specialty-filter"]').select('Cardiologia')

    // And: Aplicar filtro
    cy.get('[data-testid="apply-filter"]').click()

    // Then: Deve mostrar apenas médicos da especialidade
    cy.get('[data-testid="doctor-card"]').each(($card) => {
      cy.wrap($card).find('[data-testid="doctor-specialty"]').should('contain', 'Cardiologia')
    })

    // And: Contador deve ser atualizado
    cy.get('[data-testid="results-count"]').should('contain', 'médicos encontrados')

    // When: Selecionar médico da lista filtrada
    cy.get('[data-testid="doctor-card"]').first().find('[data-testid="schedule-with-doctor"]').click()

    // Then: Deve redirecionar para agendamento com médico pré-selecionado
    cy.url().should('include', '/appointments/new')
    cy.get('[data-testid="doctor-select"]').should('have.value', 'dr-maria-silva')
  })

  /**
   * CT012 - Tentar Agendar em Horário Indisponível (Fluxo de Exceção)
   * Tipo: Sistema ✅
   */
  it('CT012 - Should show error when trying to schedule unavailable time (Fluxo de Exceção)', () => {
    // Given: Paciente na página de agendamento
    cy.visit('/appointments/new')
    cy.get('[data-testid="appointment-form"]').should('be.visible')

    // When: Selecionar médico
    cy.get('[data-testid="doctor-select"]').select('Dr. Maria Silva')

    // And: Tentar selecionar data no passado
    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 1) // 1 dia no passado
    const pastDateString = pastDate.toISOString().split('T')[0]

    cy.get('[data-testid="date-picker"]').type(pastDateString)

    // Then: Deve mostrar erro de data inválida
    cy.get('[data-testid="date-error"]').should('contain', 'Data deve ser futura')
    cy.get('[data-testid="schedule-button"]').should('be.disabled')

    // When: Selecionar data válida mas em fim de semana
    const weekend = new Date()
    weekend.setDate(weekend.getDate() + (7 - weekend.getDay())) // Próximo domingo
    const weekendString = weekend.toISOString().split('T')[0]

    cy.get('[data-testid="date-picker"]').clear().type(weekendString)

    // Then: Deve mostrar mensagem de indisponibilidade
    cy.get('[data-testid="no-slots-message"]').should('contain', 'Não há horários disponíveis')
    cy.get('[data-testid="available-slots"]').should('not.exist')

    // When: Simular conflito de horário (mock API response)
    cy.intercept('POST', '**/appointments', {
      statusCode: 409,
      body: { error: 'Horário já ocupado' }
    }).as('conflictAppointment')

    // And: Selecionar data e horário válidos
    const validDate = new Date()
    validDate.setDate(validDate.getDate() + 7)
    const validDateString = validDate.toISOString().split('T')[0]

    cy.get('[data-testid="date-picker"]').clear().type(validDateString)
    cy.get('[data-testid="time-slot"]').first().click()
    cy.get('[data-testid="schedule-button"]').click()

    // Wait for conflict response
    cy.wait('@conflictAppointment')

    // Then: Deve mostrar erro de conflito
    cy.shouldShowError('Horário já ocupado')
    cy.url().should('include', '/appointments/new') // Permanece na página
  })

  /**
   * Teste Adicional: Validação de formulário de agendamento
   */
  it('Should validate appointment form fields', () => {
    cy.visit('/appointments/new')

    // Tentar agendar sem selecionar médico
    cy.get('[data-testid="schedule-button"]').click()

    cy.get('[data-testid="doctor-error"]').should('contain', 'Selecione um médico')
    cy.get('[data-testid="date-error"]').should('contain', 'Selecione uma data')
  })

  /**
   * Teste Adicional: Visualizar disponibilidade
   */
  it('Should show doctor availability correctly', () => {
    cy.visit('/appointments/new')

    // Selecionar médico
    cy.get('[data-testid="doctor-select"]').select('Dr. Maria Silva')

    // Selecionar data
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)
    const dateString = futureDate.toISOString().split('T')[0]

    cy.get('[data-testid="date-picker"]').type(dateString)

    // Verificar se horários são exibidos
    cy.get('[data-testid="available-slots"]').should('be.visible')
    cy.get('[data-testid="time-slot"]').should('have.length.at.least', 1)

    // Verificar formato dos horários (HH:MM)
    cy.get('[data-testid="time-slot"]').first().should('match', /\d{2}:\d{2}/)
  })
}) 