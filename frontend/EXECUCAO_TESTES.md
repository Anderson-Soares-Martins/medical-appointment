# 🧪 EXECUÇÃO DOS TESTES - Sistema de Agendamento de Consultas

## 📋 RESUMO IMPLEMENTADO

### ✅ PLANO DE TESTES COMPLETO

-   **24 Casos de Teste** cobrindo todos os casos de uso
-   **9 Testes de Sistema Obrigatórios** implementados
-   **Testes de Integração** API + Frontend
-   **Testes Unitários** para componentes, hooks e services

### ✅ ESTRUTURA IMPLEMENTADA

```
frontend/
├── cypress/
│   ├── e2e/
│   │   ├── 01-authentication.cy.js        # UC01 - 3 testes obrigatórios
│   │   ├── 02-appointment-scheduling.cy.js # UC03 - 3 testes obrigatórios
│   │   ├── 03-appointment-management.cy.js # UC04 - 3 testes obrigatórios
│   │   └── integration/
│   │       └── api-integration.cy.js       # Testes de integração
│   ├── fixtures/
│   │   └── users.json                      # Dados de teste
│   └── support/
│       ├── commands.js                     # Comandos customizados
│       └── e2e.js                          # Setup global
├── src/__tests__/
│   ├── services/
│   │   └── auth.service.test.ts            # Testes unitários
│   └── hooks/
│       └── use-auth.test.tsx               # Testes de hooks
├── cypress.config.js                       # Configuração Cypress
├── jest.config.js                          # Configuração Jest
├── jest.setup.js                           # Setup Jest
└── PLANO_DE_TESTES.md                      # Plano completo
```

## 🚀 COMO EXECUTAR

### 1. Pré-requisitos

```bash
# No diretório frontend/
npm install
# ou
pnpm install

# Instalar dependências de teste (se não instaladas)
npm install --save-dev cypress @cypress/code-coverage nyc
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event ts-jest
```

### 2. Backend Rodando

```bash
# Terminal 1 - Backend (porta 3001)
cd backend/
npm run dev

# Terminal 2 - Frontend (porta 3000)
cd frontend/
npm run dev
```

### 3. Executar Testes

#### 🎯 Testes de Sistema (9 Obrigatórios)

```bash
# Executar apenas os 9 testes de sistema obrigatórios
npm run test:system

# Detalhado:
cypress run --spec "cypress/e2e/01-authentication.cy.js,cypress/e2e/02-appointment-scheduling.cy.js,cypress/e2e/03-appointment-management.cy.js"
```

#### 🔗 Testes de Integração

```bash
# Executar testes de integração API + Frontend
npm run test:integration

# Detalhado:
cypress run --spec "cypress/e2e/integration/**/*.cy.js"
```

#### 🧩 Testes Unitários

```bash
# Executar todos os testes unitários
npm run test

# Executar com watch mode
npm run test:watch

# Executar com cobertura de código
npm run test:coverage
```

#### 🎭 Interface Gráfica do Cypress

```bash
# Abrir interface gráfica para desenvolvimento
npm run cypress:open
```

#### 🚀 Executar Todos os Testes

```bash
# Executar pipeline completo
npm run test:all

# Para CI/CD (headless)
npm run test:ci
```

## 📊 CASOS DE TESTE IMPLEMENTADOS

### 🔐 UC01 - AUTENTICAÇÃO (3 testes obrigatórios)

#### ✅ CT001 - Login com Credenciais Válidas (Fluxo Principal)

```bash
cypress/e2e/01-authentication.cy.js
```

-   **Pré-condições**: Usuário cadastrado no sistema
-   **Ação**: Login com email/senha válidos
-   **Resultado**: Redirecionamento para dashboard + token armazenado

#### ✅ CT002 - Registro de Novo Usuário (Fluxo Alternativo)

```bash
cypress/e2e/01-authentication.cy.js
```

-   **Pré-condições**: Email não cadastrado
-   **Ação**: Preencher formulário de registro
-   **Resultado**: Conta criada + login automático

#### ✅ CT003 - Login com Credenciais Inválidas (Fluxo de Exceção)

```bash
cypress/e2e/01-authentication.cy.js
```

-   **Pré-condições**: Sistema disponível
-   **Ação**: Inserir credenciais inválidas
-   **Resultado**: Mensagem de erro + permanece na página

### 📅 UC03 - AGENDAMENTO DE CONSULTAS (3 testes obrigatórios)

#### ✅ CT010 - Agendar Consulta com Médico Disponível (Fluxo Principal)

```bash
cypress/e2e/02-appointment-scheduling.cy.js
```

-   **Pré-condições**: Paciente logado + médicos disponíveis
-   **Ação**: Selecionar médico, data e horário
-   **Resultado**: Consulta agendada + redirecionamento

#### ✅ CT011 - Buscar Médicos por Especialidade (Fluxo Alternativo)

```bash
cypress/e2e/02-appointment-scheduling.cy.js
```

-   **Pré-condições**: Paciente logado
-   **Ação**: Filtrar médicos por especialidade
-   **Resultado**: Lista filtrada + médico selecionável

#### ✅ CT012 - Tentar Agendar em Horário Indisponível (Fluxo de Exceção)

```bash
cypress/e2e/02-appointment-scheduling.cy.js
```

-   **Pré-condições**: Sistema com restrições
-   **Ação**: Tentar agendar em horário ocupado/inválido
-   **Resultado**: Erro de conflito + permanece na página

### 📋 UC04 - GESTÃO DE CONSULTAS (3 testes obrigatórios)

#### ✅ CT014 - Visualizar Lista de Consultas (Fluxo Principal)

```bash
cypress/e2e/03-appointment-management.cy.js
```

-   **Pré-condições**: Usuário com consultas agendadas
-   **Ação**: Navegar para página de consultas
-   **Resultado**: Lista exibida corretamente + estatísticas

#### ✅ CT015 - Cancelar Consulta Agendada (Fluxo Alternativo)

```bash
cypress/e2e/03-appointment-management.cy.js
```

-   **Pré-condições**: Consulta com status SCHEDULED
-   **Ação**: Cancelar consulta + confirmar
-   **Resultado**: Status atualizado + mensagem de sucesso

#### ✅ CT016 - Tentar Cancelar Consulta Já Realizada (Fluxo de Exceção)

```bash
cypress/e2e/03-appointment-management.cy.js
```

-   **Pré-condições**: Consulta com status COMPLETED
-   **Ação**: Tentar cancelar consulta realizada
-   **Resultado**: Operação bloqueada + erro exibido

## 🔧 COMANDOS ÚTEIS

### Debug e Desenvolvimento

```bash
# Executar teste específico
npx cypress run --spec "cypress/e2e/01-authentication.cy.js"

# Executar com debug
npx cypress run --spec "cypress/e2e/01-authentication.cy.js" --headed --no-exit

# Executar apenas um teste
npx cypress run --spec "cypress/e2e/01-authentication.cy.js" --grep "CT001"
```

### Cobertura de Código

```bash
# Gerar relatório detalhado
npm run test:coverage

# Ver relatório HTML
open coverage/lcov-report/index.html
```

### Dados de Teste

```bash
# Usuários de teste disponíveis:
# - joao.patient@email.com (Paciente)
# - dr.silva@clinic.com (Médico)
# - Senha: Password123

# Novos usuários criados dinamicamente pelos testes
```

## 📈 MÉTRICAS DE COBERTURA

### Meta de Cobertura

-   **Branches**: 70%
-   **Functions**: 70%
-   **Lines**: 70%
-   **Statements**: 70%

### Relatórios

-   **Jest Coverage**: `coverage/lcov-report/index.html`
-   **Cypress Screenshots**: `cypress/screenshots/`
-   **Cypress Videos**: `cypress/videos/`

## 🎯 CRITÉRIOS DE ACEITAÇÃO

### ✅ Implementado

-   [x] **24 Casos de Teste** planejados
-   [x] **9 Testes de Sistema** obrigatórios implementados
-   [x] **Testes de Integração** funcionais
-   [x] **Testes Unitários** estruturados
-   [x] **Cobertura de Código** configurada
-   [x] **Pipeline de Testes** automatizado
-   [x] **Comandos Customizados** do Cypress
-   [x] **Dados de Teste** organizados
-   [x] **Documentação Completa**

### 🎉 RESULTADO FINAL

**Sistema de testes completo e funcional pronto para execução!**

Todos os requisitos de Engenharia de Software foram atendidos:

-   ✅ Cobertura de todos os casos de uso
-   ✅ 9 testes de sistema automatizados (3 casos de uso × 3 fluxos)
-   ✅ Testes de unidade, integração e sistema implementados
-   ✅ Ferramentas profissionais (Cypress + Jest)
-   ✅ Pipeline de CI/CD pronto
