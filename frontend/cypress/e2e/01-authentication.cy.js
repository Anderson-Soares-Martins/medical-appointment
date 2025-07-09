/**
 * TESTES DE SISTEMA - UC01: AUTENTICAÇÃO
 * 
 * CT001 - Login com Credenciais Válidas (Fluxo Principal)
 * CT002 - Registro de Novo Usuário (Fluxo Alternativo)  
 * CT003 - Login com Credenciais Inválidas (Fluxo de Exceção)
 */

describe('UC01 - Autenticação', () => {
  beforeEach(() => {
    cy.setupApiInterceptors()
  })

  /**
   * CT001 - Login com Credenciais Válidas (Fluxo Principal)
   * Tipo: Sistema ✅
   */
  it('CT001 - Should login successfully with valid credentials (Fluxo Principal)', () => {
    cy.fixture('users').then((users) => {
      // Given: Usuário na página de login
      cy.visit('/login')
      cy.get('[data-testid="login-form"]').should('be.visible')

      // When: Inserir credenciais válidas e fazer login
      cy.fillLoginForm(users.validPatient.email, users.validPatient.password)
      cy.get('[data-testid="login-button"]').click()

      // Then: Deve redirecionar para dashboard
      cy.shouldBeOnDashboard()

      // And: Deve mostrar mensagem de sucesso (se implementado)
      // cy.checkToast('Login realizado com sucesso')
    })
  })

  /**
   * CT002 - Registro de Novo Usuário (Fluxo Alternativo)
   * Tipo: Sistema ✅
   */
  it('CT002 - Should register new user successfully (Fluxo Alternativo)', () => {
    cy.fixture('users').then((users) => {
      const newUser = {
        ...users.newPatient,
        email: `test-${Date.now()}@email.com` // Email único
      }

      // Given: Usuário na página de registro
      cy.visit('/register')
      cy.get('[data-testid="register-form"]').should('be.visible')

      // When: Preencher formulário com dados válidos
      cy.get('[data-testid="name-input"]').type(newUser.name)
      cy.get('[data-testid="email-input"]').type(newUser.email)
      cy.get('[data-testid="password-input"]').type(newUser.password)
      // Role defaults to PATIENT which matches newUser.role, so no need to change it
      cy.get('[data-testid="register-button"]').click()

      // Then: Deve ser redirecionado para dashboard (login automático)
      cy.shouldBeOnDashboard()
    })
  })

  /**
   * CT003 - Login com Credenciais Inválidas (Fluxo de Exceção)
   * Tipo: Sistema ✅
   */
  it('CT003 - Should show error with invalid credentials (Fluxo de Exceção)', () => {
    cy.fixture('users').then((users) => {
      // Given: Usuário na página de login
      cy.visit('/login')
      cy.get('[data-testid="login-form"]').should('be.visible')

      // When: Inserir credenciais inválidas
      cy.fillLoginForm(users.invalidCredentials.email, users.invalidCredentials.password)
      cy.get('[data-testid="login-button"]').click()

      // Then: Deve permanecer na página de login
      cy.url().should('include', '/login')

      // And: Deve exibir mensagem de erro (verificar se existe)
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text().toLowerCase()
        return text.includes('inválido') || text.includes('incorreto') || text.includes('erro')
      })
    })
  })
}) 