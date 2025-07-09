# 🧪 Testes E2E - Sistema MedConsult

## 📋 Visão Geral

Este documento descreve os testes E2E melhorados do sistema MedConsult, que incluem fluxos realistas e dados específicos para validar tanto a jornada do **paciente** quanto a do **médico**.

## 👥 Personas de Teste

### **Pacientes**

-   **Maria Silva Santos** (`maria.patient@email.com`) - Paciente principal
-   **João Pedro Oliveira** - Paciente fictício para consultas
-   **Carlos Eduardo Silva** - Paciente fictício para consultas

### **Médicos**

-   **Dra. Ana Costa** (`dra.ana@clinic.com`) - **Dermatologia** - CRM-SP 67890
-   **Dr. João Silva** (`dr.silva@clinic.com`) - **Cardiologia** - CRM-SP 12345
-   **Dra. Maria Santos** (`dra.maria@clinic.com`) - **Pediatria** - CRM-SP 11223

## 🗂️ Ordem Recomendada de Execução

### **1️⃣ AUTENTICAÇÃO** (Base para tudo)

```bash
# Testa login válido com diferentes usuários
cypress run --spec "cypress/e2e/auth/auth_login_valid.cy.js"

# Testa cadastro de novos usuários
cypress run --spec "cypress/e2e/auth/auth_register_patient.cy.js"

# Testa cenários de erro
cypress run --spec "cypress/e2e/auth/auth_invalid_credentials.cy.js"
```

### **2️⃣ JORNADA DO PACIENTE** (Criação de dados)

```bash
# Paciente visualiza médicos disponíveis
cypress run --spec "cypress/e2e/app/doctors.cy.js"

# Paciente agenda consulta com Dra. Ana Costa
cypress run --spec "cypress/e2e/appointments/appointment_schedule.cy.js"

# Paciente visualiza suas consultas
cypress run --spec "cypress/e2e/app/appointments.cy.js"
```

### **3️⃣ JORNADA DO MÉDICO** (Uso dos dados criados)

```bash
# Dra. Ana Costa vê dashboard
cypress run --spec "cypress/e2e/app/doctor_dashboard.cy.js"

# Dra. Ana Costa gerencia consultas de hoje
cypress run --spec "cypress/e2e/app/doctor_today_appointments.cy.js"

# Dra. Ana Costa gerencia todas as consultas
cypress run --spec "cypress/e2e/app/doctor_appointments.cy.js"

# Dra. Ana Costa consulta histórico
cypress run --spec "cypress/e2e/app/doctor_history.cy.js"

# Dra. Ana Costa gerencia pacientes
cypress run --spec "cypress/e2e/app/doctor_patients.cy.js"
```

### **4️⃣ CONTROLE DE ACESSO**

```bash
# Valida que pacientes não acessem dados de outros pacientes
cypress run --spec "cypress/e2e/app/patients.cy.js"
```

## 📄 Detalhes dos Testes

### **🔐 Autenticação**

#### `auth_login_valid.cy.js`

-   ✅ Login de paciente (Maria Silva Santos)
-   ✅ Login de médico (Dr. Silva e Dra. Ana Costa)
-   ✅ Verificação de navegação específica por role
-   ✅ Validação de dados completos do usuário

#### `auth_register_patient.cy.js`

-   ✅ Cadastro de paciente
-   ✅ Cadastro de médico com especialidade
-   ✅ Validação de campos obrigatórios
-   ✅ Toggle de visualização de senha

#### `auth_invalid_credentials.cy.js`

-   ❌ Login com credenciais inválidas
-   ❌ Tratamento de erros de servidor
-   ❌ Validação de formato de email
-   ❌ Campos obrigatórios

### **👤 Jornada do Paciente**

#### `doctors.cy.js`

-   📋 Lista completa de médicos com especialidades
-   🔍 Filtros por especialidade (Dermatologia, Cardiologia, Pediatria)
-   🔎 Busca por nome do médico
-   📊 Informações detalhadas (CRM, experiência, horários)
-   🎯 Navegação para agendamento

#### `appointment_schedule.cy.js`

-   📝 **Fluxo completo de agendamento com Dra. Ana Costa**:
    1. Seleção de médico (Dra. Ana Costa - Dermatologia)
    2. Escolha de data disponível
    3. Seleção de horário (09:00 - 18:00)
    4. Preenchimento do motivo da consulta
    5. Confirmação do agendamento
-   ⏰ Horários específicos por médico
-   ✅ Validação de campos obrigatórios
-   🚫 Prevenção de agendamento em datas passadas
-   ⚠️ Tratamento de conflitos de horário

#### `appointments.cy.js`

-   📋 Lista de consultas do paciente
-   📊 **Consultas específicas**:
    -   Dra. Ana Costa (Dermatologia) - 15/02/2024 09:00
    -   Dr. João Silva (Cardiologia) - 20/02/2024 14:30
-   ❌ Cancelamento com motivo e observações
-   🔍 Filtros por status (Agendada, Concluída, Cancelada)
-   🔎 Busca por nome do médico
-   👁️ Visualização de detalhes da consulta

### **👨‍⚕️ Jornada do Médico (Dra. Ana Costa)**

#### `doctor_dashboard.cy.js`

-   🏠 **Dashboard personalizado da Dra. Ana Costa**
-   📊 Estatísticas específicas (45 consultas, 12 agendadas, 28 concluídas)
-   📅 **Consultas de hoje** com pacientes reais:
    -   Maria Silva Santos (09:00) - Avaliação de manchas
    -   João Pedro Oliveira (10:30) - Tratamento de acne
    -   Carlos Eduardo Silva (14:00) - Avaliação de psoríase
    -   Ana Paula Costa (15:30) - Check-up dermatológico
-   🎯 Ações rápidas para navegação
-   📈 Métricas de performance (satisfação 4.8/5)

#### `doctor_today_appointments.cy.js`

-   📅 Gerenciamento de consultas do dia atual
-   👥 Lista de pacientes com horários
-   ✏️ Edição de status das consultas
-   📝 Adição de anotações
-   🏷️ Badges de status (Agendada, Concluída, Cancelada)

#### `doctor_appointments.cy.js`

-   📋 Gerenciamento de todas as consultas
-   👤 Visualização de nomes dos pacientes
-   🔄 Atualização de status das consultas
-   🔍 Filtros por status
-   🔎 Busca por nome do paciente

#### `doctor_history.cy.js`

-   📈 Histórico completo de consultas
-   📊 Estatísticas históricas
-   📤 Exportação de relatórios
-   🔍 Filtros por status e período
-   🔎 Busca por paciente

#### `doctor_patients.cy.js`

-   👥 Lista de pacientes do médico
-   📧 Informações de contato
-   🔍 Busca por nome
-   📅 Filtros por data de cadastro
-   📊 Histórico de consultas por paciente

### **🛡️ Controle de Acesso**

#### `patients.cy.js`

-   🚫 Impede acesso de pacientes a dados de outros pacientes
-   ✅ Permite acesso de médicos à lista de pacientes
-   🔍 Funcionalidade de busca

## 🎯 Cenários de Teste Específicos

### **Consultas com Dra. Ana Costa**

-   **Paciente**: Maria Silva Santos
-   **Especialidade**: Dermatologia
-   **Horário**: 09:00 - 18:00
-   **Motivos**: Avaliação de manchas, check-up dermatológico
-   **Status**: Agendada → Concluída

### **Consultas com Dr. João Silva**

-   **Paciente**: Maria Silva Santos
-   **Especialidade**: Cardiologia
-   **Horário**: 08:00 - 17:00
-   **Motivos**: Consulta cardiológica, dor no peito
-   **Status**: Agendada → Concluída

### **Fluxo Completo Testado**

1. 👤 **Maria** faz login
2. 🔍 **Maria** vê lista de médicos
3. 👩‍⚕️ **Maria** seleciona **Dra. Ana Costa**
4. 📅 **Maria** agenda consulta para 15/02/2024 09:00
5. 📋 **Maria** visualiza consulta na lista
6. 👩‍⚕️ **Dra. Ana** faz login
7. 🏠 **Dra. Ana** vê consulta no dashboard
8. 📅 **Dra. Ana** gerencia consulta do dia
9. ✅ **Dra. Ana** marca consulta como concluída
10. 📊 **Dra. Ana** consulta histórico

## 🚀 Executar Todos os Testes

```bash
# Ordem completa recomendada
cypress run --spec "cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/auth/auth_register_patient.cy.js,cypress/e2e/auth/auth_invalid_credentials.cy.js,cypress/e2e/app/doctors.cy.js,cypress/e2e/appointments/appointment_schedule.cy.js,cypress/e2e/app/appointments.cy.js,cypress/e2e/app/doctor_dashboard.cy.js,cypress/e2e/app/doctor_today_appointments.cy.js,cypress/e2e/app/doctor_appointments.cy.js,cypress/e2e/app/doctor_history.cy.js,cypress/e2e/app/doctor_patients.cy.js,cypress/e2e/app/patients.cy.js"
```

## 📊 Cobertura de Testes

-   ✅ **Autenticação**: Login, cadastro, validações
-   ✅ **Agendamento**: Fluxo completo com dados reais
-   ✅ **Gerenciamento**: Visualização e edição de consultas
-   ✅ **Dashboards**: Estatísticas e métricas
-   ✅ **Filtros e Busca**: Funcionalidades avançadas
-   ✅ **Controle de Acesso**: Segurança por role
-   ✅ **Estados de Erro**: Tratamento gracioso
-   ✅ **Estados de Loading**: UX durante carregamento
-   ✅ **Estados Vazios**: Quando não há dados

## 🎉 Benefícios dos Testes Melhorados

1. **Dados Realistas**: Usa nomes, especialidades e horários reais
2. **Fluxos Completos**: Simula uso real do sistema
3. **Validações Específicas**: Verifica dados exatos, não apenas elementos
4. **Cobertura Ampla**: Testa cenários principais, alternativos e de erro
5. **Manutenibilidade**: Código organizado e bem documentado
6. **Confiabilidade**: Testes robustos que realmente validam funcionalidades
