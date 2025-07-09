# PLANO DE TESTES - Sistema de Agendamento de Consultas Médicas

## 📋 VISÃO GERAL

Este plano de testes cobre todos os casos de uso do sistema de agendamento de consultas médicas, garantindo cobertura completa dos fluxos principais, alternativos e de exceção.

## 🎯 OBJETIVOS

-   **Cobertura Completa**: Todos os casos de uso possuem ao menos um caso de teste
-   **Automatização**: Testes de unidade, integração e sistema
-   **Qualidade**: Garantir funcionamento correto de todas as funcionalidades

## 📊 CASOS DE USO E COBERTURA

### UC01 - AUTENTICAÇÃO E AUTORIZAÇÃO

#### CT001 - Login com Credenciais Válidas (Fluxo Principal)

-   **Pré-condições**: Usuário cadastrado no sistema
-   **Passos**:
    1. Acessar página de login
    2. Inserir email válido
    3. Inserir senha válida
    4. Clicar em "Entrar"
-   **Resultado Esperado**: Redirecionamento para dashboard
-   **Tipo**: Sistema ✅

#### CT002 - Registro de Novo Usuário (Fluxo Alternativo)

-   **Pré-condições**: Email não cadastrado
-   **Passos**:
    1. Acessar página de registro
    2. Preencher dados válidos
    3. Selecionar role (PATIENT/DOCTOR)
    4. Clicar em "Cadastrar"
-   **Resultado Esperado**: Conta criada e login automático
-   **Tipo**: Sistema ✅

#### CT003 - Login com Credenciais Inválidas (Fluxo de Exceção)

-   **Pré-condições**: Sistema disponível
-   **Passos**:
    1. Acessar página de login
    2. Inserir credenciais inválidas
    3. Clicar em "Entrar"
-   **Resultado Esperado**: Mensagem de erro
-   **Tipo**: Sistema ✅

#### CT004 - Logout do Sistema

-   **Pré-condições**: Usuário logado
-   **Passos**:
    1. Clicar no menu do usuário
    2. Selecionar "Sair"
-   **Resultado Esperado**: Redirecionamento para página inicial
-   **Tipo**: Integração

#### CT005 - Acesso a Página Protegida sem Autenticação

-   **Pré-condições**: Usuário não logado
-   **Passos**:
    1. Tentar acessar /dashboard diretamente
-   **Resultado Esperado**: Redirecionamento para login
-   **Tipo**: Integração

### UC02 - GESTÃO DE PERFIL

#### CT006 - Visualizar Perfil do Usuário (Fluxo Principal)

-   **Pré-condições**: Usuário logado
-   **Passos**:
    1. Navegar para página de configurações
    2. Verificar dados do perfil
-   **Resultado Esperado**: Dados corretos exibidos
-   **Tipo**: Integração

#### CT007 - Atualizar Dados do Perfil (Fluxo Alternativo)

-   **Pré-condições**: Usuário logado
-   **Passos**:
    1. Navegar para configurações
    2. Alterar nome/especialidade
    3. Salvar alterações
-   **Resultado Esperado**: Dados atualizados com sucesso
-   **Tipo**: Integração

#### CT008 - Troca de Senha com Senha Incorreta (Fluxo de Exceção)

-   **Pré-condições**: Usuário logado
-   **Passos**:
    1. Navegar para configurações
    2. Inserir senha atual incorreta
    3. Inserir nova senha
    4. Tentar salvar
-   **Resultado Esperado**: Erro de senha atual incorreta
-   **Tipo**: Integração

#### CT009 - Troca de Senha com Sucesso

-   **Pré-condições**: Usuário logado
-   **Passos**:
    1. Navegar para configurações
    2. Inserir senha atual correta
    3. Inserir nova senha válida
    4. Salvar
-   **Resultado Esperado**: Senha alterada com sucesso
-   **Tipo**: Integração

### UC03 - AGENDAMENTO DE CONSULTAS

#### CT010 - Agendar Consulta com Médico Disponível (Fluxo Principal)

-   **Pré-condições**: Paciente logado, médicos disponíveis
-   **Passos**:
    1. Navegar para nova consulta
    2. Selecionar médico
    3. Escolher data/hora disponível
    4. Confirmar agendamento
-   **Resultado Esperado**: Consulta agendada com sucesso
-   **Tipo**: Sistema ✅

#### CT011 - Buscar Médicos por Especialidade (Fluxo Alternativo)

-   **Pré-condições**: Paciente logado
-   **Passos**:
    1. Acessar página de médicos
    2. Filtrar por especialidade
    3. Visualizar resultados
-   **Resultado Esperado**: Lista filtrada de médicos
-   **Tipo**: Sistema ✅

#### CT012 - Tentar Agendar em Horário Indisponível (Fluxo de Exceção)

-   **Pré-condições**: Paciente logado
-   **Passos**:
    1. Tentar agendar em horário ocupado
    2. Confirmar agendamento
-   **Resultado Esperado**: Erro de conflito de horário
-   **Tipo**: Sistema ✅

#### CT013 - Visualizar Disponibilidade de Médico

-   **Pré-condições**: Sistema com dados
-   **Passos**:
    1. Selecionar médico
    2. Escolher data
    3. Verificar horários disponíveis
-   **Resultado Esperado**: Horários livres exibidos
-   **Tipo**: Integração

### UC04 - GESTÃO DE CONSULTAS

#### CT014 - Visualizar Lista de Consultas (Fluxo Principal)

-   **Pré-condições**: Usuário com consultas agendadas
-   **Passos**:
    1. Navegar para página de consultas
    2. Verificar lista
-   **Resultado Esperado**: Consultas exibidas corretamente
-   **Tipo**: Sistema ✅

#### CT015 - Cancelar Consulta Agendada (Fluxo Alternativo)

-   **Pré-condições**: Consulta agendada
-   **Passos**:
    1. Acessar lista de consultas
    2. Clicar em cancelar
    3. Confirmar cancelamento
-   **Resultado Esperado**: Consulta cancelada
-   **Tipo**: Sistema ✅

#### CT016 - Tentar Cancelar Consulta Já Realizada (Fluxo de Exceção)

-   **Pré-condições**: Consulta com status COMPLETED
-   **Passos**:
    1. Tentar cancelar consulta finalizada
-   **Resultado Esperado**: Erro de operação inválida
-   **Tipo**: Sistema ✅

#### CT017 - Filtrar Consultas por Status/Data

-   **Pré-condições**: Múltiplas consultas
-   **Passos**:
    1. Aplicar filtros na lista
    2. Verificar resultados
-   **Resultado Esperado**: Lista filtrada corretamente
-   **Tipo**: Integração

### UC05 - DASHBOARD E ESTATÍSTICAS

#### CT018 - Visualizar Dashboard com Estatísticas (Fluxo Principal)

-   **Pré-condições**: Usuário logado com dados
-   **Passos**:
    1. Acessar dashboard
    2. Verificar estatísticas
-   **Resultado Esperado**: Dados estatísticos corretos
-   **Tipo**: Integração

#### CT019 - Navegar entre Seções do Dashboard (Fluxo Alternativo)

-   **Pré-condições**: Usuário logado
-   **Passos**:
    1. Usar navegação lateral
    2. Acessar diferentes seções
-   **Resultado Esperado**: Navegação funcional
-   **Tipo**: Integração

#### CT020 - Acesso ao Dashboard sem Dados (Fluxo de Exceção)

-   **Pré-condições**: Usuário novo sem consultas
-   **Passos**:
    1. Acessar dashboard
-   **Resultado Esperado**: Estado vazio exibido
-   **Tipo**: Integração

### UC06 - FUNCIONALIDADES MÉDICAS

#### CT021 - Atualizar Status de Consulta (Médico) (Fluxo Principal)

-   **Pré-condições**: Médico logado com consultas
-   **Passos**:
    1. Acessar consultas do dia
    2. Atualizar status para COMPLETED
    3. Adicionar observações
-   **Resultado Esperado**: Status atualizado
-   **Tipo**: Integração

#### CT022 - Visualizar Lista de Pacientes (Fluxo Alternativo)

-   **Pré-condições**: Médico logado
-   **Passos**:
    1. Navegar para página de pacientes
    2. Visualizar lista
-   **Resultado Esperado**: Pacientes listados
-   **Tipo**: Integração

#### CT023 - Paciente Tentando Atualizar Status (Fluxo de Exceção)

-   **Pré-condições**: Paciente logado
-   **Passos**:
    1. Tentar acessar funcionalidade de médico
-   **Resultado Esperado**: Acesso negado
-   **Tipo**: Integração

#### CT024 - Visualizar Consultas do Dia

-   **Pré-condições**: Médico com consultas hoje
-   **Passos**:
    1. Acessar "Consultas de Hoje"
    2. Verificar lista
-   **Resultado Esperado**: Consultas do dia listadas
-   **Tipo**: Integração

## 🔧 AUTOMATIZAÇÃO DOS TESTES

### Testes de Sistema (9 Obrigatórios)

#### Caso de Uso 1: Autenticação

1. **CT001** - Login com Credenciais Válidas (Fluxo Principal)
2. **CT002** - Registro de Novo Usuário (Fluxo Alternativo)
3. **CT003** - Login com Credenciais Inválidas (Fluxo de Exceção)

#### Caso de Uso 2: Agendamento de Consultas

4. **CT010** - Agendar Consulta com Médico Disponível (Fluxo Principal)
5. **CT011** - Buscar Médicos por Especialidade (Fluxo Alternativo)
6. **CT012** - Tentar Agendar em Horário Indisponível (Fluxo de Exceção)

#### Caso de Uso 3: Gestão de Consultas

7. **CT014** - Visualizar Lista de Consultas (Fluxo Principal)
8. **CT015** - Cancelar Consulta Agendada (Fluxo Alternativo)
9. **CT016** - Tentar Cancelar Consulta Já Realizada (Fluxo de Exceção)

### Testes de Integração

-   Integração Frontend + Backend API
-   Integração Backend + Banco de Dados
-   Integração entre Componentes React
-   Fluxos de autenticação JWT
-   Validações de dados

### Testes de Unidade

-   Componentes React isolados
-   Hooks customizados
-   Services e APIs
-   Funções de validação
-   Utilitários

## 📊 COBERTURA DE TESTES

| Tipo                 | Quantidade | Status           |
| -------------------- | ---------- | ---------------- |
| Casos de Teste       | 24         | ✅ Planejados    |
| Testes de Sistema    | 9          | 🚧 A implementar |
| Testes de Integração | 15         | 🚧 A implementar |
| Testes de Unidade    | ~50        | 🚧 A implementar |

## 🛠️ FERRAMENTAS

-   **Cypress**: Testes E2E e de Sistema
-   **Jest**: Testes de Unidade
-   **React Testing Library**: Testes de Componentes
-   **MSW**: Mock Service Worker para APIs
-   **Cypress Code Coverage**: Cobertura de código

## 📝 EXECUÇÃO

```bash
# Instalar dependências
npm install --save-dev cypress @cypress/code-coverage nyc

# Executar testes E2E
npm run cypress:open

# Executar testes unitários
npm test

# Executar todos os testes
npm run test:all

# Gerar relatório de cobertura
npm run coverage
```

## ✅ CRITÉRIOS DE ACEITAÇÃO

-   ✅ Todos os casos de uso cobertos
-   ✅ Mínimo 9 testes de sistema implementados
-   ✅ Fluxos principal, alternativo e exceção testados
-   ✅ Testes automatizados funcionais
-   ✅ Cobertura de código > 80%
