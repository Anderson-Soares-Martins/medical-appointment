Video - https://youtu.be/ZgeB-bAcZCs

# 🏥 Sistema de Consultas Médicas

> **Projeto Acadêmico** - Sistema completo de gestão de consultas médicas desenvolvido para a universidade, com arquitetura moderna e cobertura de testes abrangente.

## 📋 Visão Geral

Sistema web completo para gestão de consultas médicas, permitindo que pacientes agendem consultas e médicos gerenciem seus atendimentos. O projeto foi desenvolvido seguindo as melhores práticas de engenharia de software e atende a todos os requisitos acadêmicos estabelecidos.

### 🎯 Funcionalidades Principais

**Para Pacientes:**

-   ✅ Cadastro e autenticação
-   ✅ Agendamento de consultas
-   ✅ Visualização de médicos e especialidades
-   ✅ Histórico de consultas
-   ✅ Cancelamento de consultas

**Para Médicos:**

-   ✅ Dashboard com consultas do dia
-   ✅ Gestão de status das consultas
-   ✅ Visualização de pacientes
-   ✅ Adição de observações médicas
-   ✅ Controle completo das consultas
-   ✅ Estatísticas e relatórios

## 🏗️ Arquitetura

```
medical-appointment/
├── 📁 backend/          # API REST - Node.js + Express + Prisma
│   ├── src/             # Código fonte do backend
│   ├── prisma/          # Schema e migrações do banco
│   └── swagger.json     # Documentação da API
├── 📁 frontend/         # Interface Web - Next.js + TypeScript
│   ├── src/             # Código fonte do frontend
│   ├── cypress/         # Testes E2E
│   └── public/          # Arquivos estáticos
└── README.md           # Este arquivo
```

### 🛠️ Stack Tecnológica

#### Frontend

-   **Next.js 15** - Framework React com App Router
-   **TypeScript** - Tipagem estática
-   **Tailwind CSS** - Estilização moderna
-   **ShadCN UI** - Sistema de componentes
-   **TanStack Query** - Gerenciamento de estado
-   **React Hook Form + Zod** - Formulários e validação

#### Backend

-   **Node.js** - Runtime JavaScript
-   **Express.js** - Framework web minimalista
-   **Prisma** - ORM moderno
-   **PostgreSQL** - Banco de dados relacional
-   **JWT** - Autenticação segura
-   **Swagger** - Documentação automática da API

#### Testes e Qualidade

-   **Jest** - Testes unitários e de integração
-   **Cypress** - Testes end-to-end
-   **ESLint** - Análise estática de código
-   **TypeScript** - Verificação de tipos

## 🚀 Como Executar

### Pré-requisitos

-   Node.js 18+
-   pnpm (gerenciador de pacotes)
-   Docker e Docker Compose (para banco de dados)

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd medical-appointment
```

### 2. Configure o Backend

```bash
cd backend
pnpm install

# Inicie o banco de dados PostgreSQL
docker-compose up -d db

# Configure o banco
pnpm db:push
pnpm db:seed

# Inicie o servidor
pnpm dev
```

### 3. Configure o Frontend

```bash
cd ../frontend
pnpm install

# Inicie o servidor de desenvolvimento
pnpm dev
```

### 4. Acesse o Sistema

-   **Frontend**: http://localhost:3000
-   **Backend API**: http://localhost:3001
-   **Documentação API**: http://localhost:3001/api-docs
-   **Prisma Studio**: execute `pnpm db:studio` no backend

## 🧪 Testes Automatizados

### ✅ Cobertura Completa de Testes

O projeto possui **20 testes automatizados** distribuídos em três níveis:

#### 🔬 Testes Unitários (5 testes)

```bash
cd frontend
pnpm test:unit
```

-   Funções de formatação de dados
-   Utilitários de manipulação de strings
-   Validadores de entrada

#### 🔗 Testes de Integração (5 testes)

```bash
cd frontend
pnpm test:integration
```

-   Serviços de API
-   Fluxos de autenticação
-   Comunicação frontend-backend

#### 🌐 Testes End-to-End (10 testes)

```bash
cd frontend
pnpm test:e2e
```

-   **Autenticação completa**: Login, registro, controle de acesso
-   **Gestão de consultas**: Agendamento, cancelamento, alterações de status
-   **Fluxos do médico**: Dashboard, gerenciamento de pacientes, consultas do dia

### 📊 Executar Todos os Testes

```bash
cd frontend
pnpm test:all  # Executa todos os tipos de teste
```

## 📚 Casos de Uso Implementados

### 1. 🔐 Autenticação e Autorização

-   **UC001**: Login de usuário
-   **UC002**: Registro de paciente/médico
-   **UC003**: Controle de acesso por perfil

### 2. 📅 Gestão de Consultas (Paciente)

-   **UC004**: Agendar nova consulta
-   **UC005**: Visualizar consultas agendadas
-   **UC006**: Cancelar consulta

### 3. 🩺 Gestão Médica (Médico)

-   **UC007**: Visualizar consultas do dia
-   **UC008**: Atualizar status da consulta
-   **UC009**: Gerenciar histórico de pacientes

### ✅ Todos os fluxos possuem:

-   **Fluxo Principal** - Caminho feliz
-   **Fluxo Alternativo** - Cenários alternativos
-   **Fluxo de Exceção** - Tratamento de erros

## 🎓 Requisitos Acadêmicos Atendidos

### ✅ Cobertura de Testes

-   **Mínimo exigido**: 9 testes automatizados
-   **Implementado**: 20 testes automatizados
-   **Tipos**: Unitários, Integração e Sistema (E2E)
-   **Cobertura**: Todos os casos de uso principais

### ✅ Padrões de Projeto

-   **MVC** - Separação clara de responsabilidades
-   **Observer** - TanStack Query para estado reativo
-   **Singleton** - Instâncias únicas de serviços
-   **Repository** - Abstração de acesso a dados
-   **Facade** - Simplificação de interfaces complexas

### ✅ Arquitetura Limpa

-   Separação frontend/backend
-   Camadas bem definidas
-   Baixo acoplamento
-   Alta coesão

## 📊 Dados de Demonstração

O sistema vem com dados pré-cadastrados para demonstração:

### 👨‍⚕️ Médicos

-   **Dr. Maria Silva** (Cardiologia) - `dr.silva@clinic.com`
-   **Dr. João Santos** (Dermatologia) - `dr.santos@clinic.com`
-   **Dra. Ana Oliveira** (Pediatria) - `dr.oliveira@clinic.com`
-   **Dr. Carlos Costa** (Ortopedia) - `dr.costa@clinic.com`

### 👤 Pacientes

-   **Maria Santos** - `maria.patient@email.com`
-   **João Silva** - `joao.patient@email.com`
-   **Ana Costa** - `ana.patient@email.com`
-   **Pedro Oliveira** - `pedro.patient@email.com`

**Senha padrão para todos**: `Password123`

## 🔒 Segurança

-   **Autenticação JWT** com refresh tokens
-   **Hash de senhas** com bcryptjs
-   **Validação de entrada** em frontend e backend
-   **Controle de acesso** baseado em roles
-   **Proteção CORS** configurada
-   **Sanitização** de dados de entrada

## 📱 Interface Responsiva

-   **Design Mobile-First** para todos os dispositivos
-   **Interface Adaptativa** baseada no tipo de usuário
-   **Componentes Reutilizáveis** com ShadCN UI
-   **Tema Escuro/Claro** disponível
-   **Navegação Intuitiva** com feedback visual

## 📈 Funcionalidades Avançadas

### Dashboard Inteligente

-   **Estatísticas em tempo real**
-   **Consultas do dia destacadas**
-   **Próximas consultas**
-   **Ações rápidas contextuais**

### Gestão de Status

-   **AGENDADA** → **CONFIRMADA** → **CONCLUÍDA**
-   **Cancelamento** com histórico
-   **Falta do paciente** (NO_SHOW)
-   **Observações médicas** anexadas

### Busca e Filtros

-   **Busca por paciente** ou médico
-   **Filtros por status** da consulta
-   **Filtros por data** e período
-   **Busca por especialidade**

## 🚀 Melhorias Futuras

-   [ ] Sistema de notificações push
-   [ ] Integração com calendário
-   [ ] Videoconferência para teleconsultas
-   [ ] Relatórios em PDF
-   [ ] Sistema de avaliações
-   [ ] Chat interno médico-paciente

## 👥 Equipe de Desenvolvimento

Este projeto foi desenvolvido como trabalho acadêmico seguindo as melhores práticas de engenharia de software e metodologias ágeis.

## 📄 Licença

Este é um projeto acadêmico desenvolvido para fins educacionais.
