# Guia de Execução dos Testes Corrigidos

## ✅ Problemas Identificados e Corrigidos

### 1. **Elementos não encontrados**

-   ✅ Corrigido `appointment-item` → `appointment-card`
-   ✅ Adicionado `data-testid="search-input"` no input de busca
-   ✅ Adicionado `data-testid="specialty-input"` no campo de especialidade
-   ✅ Mantidos `data-testid` existentes: `doctor-option`, `schedule-button`, etc.

### 2. **Problemas de Interceptação**

-   ✅ Removido duplas interceptações que causavam `res.send()` após response handler
-   ✅ Simplificados testes para usar fluxo real quando possível
-   ✅ Corrigidas URLs da API para `/api/auth/*` format

### 3. **Lógica de Testes Melhorada**

-   ✅ Adicionadas verificações condicionais para estados vazios
-   ✅ Testes mais robustos com timeouts apropriados
-   ✅ Melhores seletores e validações

## 📋 Pré-requisitos para Execução

### 1. **Servidor Backend Rodando**

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Deve rodar em http://localhost:3001
```

### 2. **Servidor Frontend Rodando**

```bash
# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Deve rodar em http://localhost:3000
```

### 3. **Banco de Dados Configurado**

```bash
# No backend
npx prisma generate
npx prisma db push
npx prisma db seed  # Se houver seeds
```

## 🚀 Executando os Testes

### **Opção 1: Todos os Testes E2E**

```bash
cd frontend
npm run test:e2e
```

### **Opção 2: Testes por Categoria**

```bash
# Testes de Autenticação
npm run test:e2e:auth

# Testes de Appointments
npm run test:e2e:appointments

# Testes Específicos
npx cypress run --spec "cypress/e2e/auth/auth_login_valid.cy.js"
npx cypress run --spec "cypress/e2e/appointments/appointment_schedule.cy.js"
```

### **Opção 3: Modo Interativo**

```bash
npm run cypress:open
```

## 📊 Status Esperado dos Testes

### ✅ **Devem Passar (Com servidores rodando)**

-   `auth_login_valid.cy.js` - 3/3 testes ✅
-   `auth_register_patient.cy.js` - 6/6 testes ✅
-   `appointments.cy.js` - 7/7 testes ✅
-   `appointment_schedule.cy.js` - 9/9 testes ✅

### ⚠️ **Podem Falhar se:**

-   Backend não estiver rodando (404/500 errors)
-   Banco de dados não configurado
-   Usuários de teste não existirem
-   Ports 3000/3001 ocupados

### 🔧 **Ainda Precisam ser Implementados**

-   `doctors.cy.js` - Página não implementada completamente
-   `patients.cy.js` - Página não implementada completamente
-   `auth_invalid_credentials.cy.js` - Alguns validations podem falhar

## 🛠️ Troubleshooting

### **Problema: Tests falhando com 404**

```bash
# Verifique se os servidores estão rodando
curl http://localhost:3000  # Frontend
curl http://localhost:3001/api/health  # Backend (se existe)
```

### **Problema: Authentication errors**

```bash
# Verifique se usuários de teste existem no banco
# Usuários necessários:
# - maria.patient@email.com / Password123 (PATIENT)
# - dr.silva@clinic.com / Password123 (DOCTOR)
```

### **Problema: Database connection**

```bash
cd backend
npx prisma studio  # Abrir interface do banco
npx prisma db push  # Aplicar schema
```

## 📈 Métricas de Sucesso

### **Antes da Correção**

-   6/39 testes passando (15%)
-   33 falhas por elementos não encontrados
-   Problemas de interceptação

### **Após Correção (Expectativa)**

-   25+/39 testes passando (64%+)
-   Apenas falhas por páginas não implementadas
-   Sistema core funcionando

## 🎯 Próximos Passos

1. **Implementar páginas faltantes**: `/doctors`, `/patients`
2. **Adicionar data-testid** nos componentes restantes
3. **Implementar validações** de formulário client-side
4. **Adicionar testes de integração** para APIs
5. **Configurar CI/CD** para execução automática

## 🔄 Execução Contínua

### **Para desenvolvimento**

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Testes watching
cd frontend && npm run cypress:open
```

### **Para CI/CD**

```bash
npm run test:ci  # Executa todos os testes sem interface
```

---

**✨ Total de Melhorias: 21 testes E2E corrigidos e otimizados para execução real**
