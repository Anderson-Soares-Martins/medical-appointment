# Frontend - Sistema de Consultas Médicas

Frontend moderno desenvolvido com Next.js 14, TypeScript e as melhores práticas para o sistema de gestão de consultas médicas.

## 🚀 Tecnologias Utilizadas

-   **Next.js 14** - Framework React com App Router
-   **TypeScript** - Tipagem estática
-   **Tailwind CSS** - Estilização utilitária
-   **ShadCN UI** - Componentes UI consistentes
-   **TanStack Query** - Gerenciamento de estado do servidor
-   **React Hook Form** - Gerenciamento de formulários
-   **Zod** - Validação de esquemas
-   **Axios** - Cliente HTTP
-   **Lucide React** - Ícones
-   **Date-fns** - Manipulação de datas
-   **Sonner** - Notificações toast

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── app/                    # Páginas (App Router)
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── appointments/       # Gestão de consultas
│   │   ├── login/             # Autenticação
│   │   └── register/          # Registro
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes ShadCN
│   │   ├── auth/             # Componentes de autenticação
│   │   ├── appointments/     # Componentes de consultas
│   │   ├── layout/           # Layouts
│   │   └── common/           # Componentes comuns
│   ├── hooks/                # Hooks customizados
│   ├── providers/            # Providers de contexto
│   ├── services/             # Serviços de API
│   ├── types/                # Tipos TypeScript
│   └── utils/                # Utilitários
├── public/                   # Arquivos públicos
└── package.json
```

## 🏗️ Arquitetura

### Clean Architecture

-   **Separação de responsabilidades** clara
-   **Camada de serviços** para comunicação com API
-   **Hooks customizados** para lógica de negócio
-   **Componentes reutilizáveis** bem estruturados

### Padrões Implementados

-   **MVC** - Separação Model-View-Controller
-   **Observer** - TanStack Query para estado reativo
-   **Facade** - Serviços que encapsulam chamadas de API
-   **Singleton** - Instância única do cliente axios

## 🔧 Funcionalidades Implementadas

### Autenticação

-   ✅ Login com validação
-   ✅ Registro de usuários (Paciente/Médico)
-   ✅ Contexto de autenticação global
-   ✅ Proteção de rotas
-   ✅ Refresh tokens automático

### Dashboard

-   ✅ Estatísticas de consultas
-   ✅ Consultas do dia
-   ✅ Próximas consultas
-   ✅ Ações rápidas

### Gestão de Consultas

-   ✅ Listagem de consultas
-   ✅ Filtros por status e busca
-   ✅ Agendamento de consultas
-   ✅ Cancelamento de consultas
-   ✅ Atualização de status (médicos)
-   ✅ Histórico completo

### Interface Diferenciada

-   ✅ **Pacientes**: Foco em agendamento e histórico
-   ✅ **Médicos**: Gestão de consultas e pacientes
-   ✅ Navegação contextual por tipo de usuário

## 🎨 Design System

### Componentes UI

-   **Buttons**: Variações primary, secondary, outline
-   **Cards**: Containers padronizados
-   **Forms**: Validação integrada
-   **Dialogs**: Modais responsivos
-   **Badges**: Status visuais
-   **Tables**: Listagens organizadas

### Responsividade

-   ✅ Mobile-first design
-   ✅ Breakpoints otimizados
-   ✅ Sidebar responsiva
-   ✅ Componentes adaptativos

## 🔐 Segurança

### Autenticação

-   JWT tokens com refresh automático
-   Interceptors para requisições
-   Logout automático em token expirado
-   Validação de roles por rota

### Validação

-   Esquemas Zod para todos os formulários
-   Validação client-side e server-side
-   Sanitização de dados de entrada

## 📱 Funcionalidades por Usuário

### Pacientes

-   Dashboard com estatísticas pessoais
-   Agendamento de consultas
-   Visualização de médicos disponíveis
-   Histórico de consultas
-   Cancelamento de consultas próprias

### Médicos

-   Dashboard com consultas do dia
-   Gestão de status das consultas
-   Visualização de pacientes
-   Adição de observações
-   Controle completo das consultas

## 🚀 Como Executar

### Pré-requisitos

-   Node.js 18+
-   npm ou yarn
-   Backend rodando em `http://localhost:3001`

### Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

### Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📊 Estado Global

### TanStack Query

-   Cache automático de dados
-   Refetch inteligente
-   Mutations com invalidação
-   Loading states globais

### Contexto de Autenticação

-   Estado de usuário global
-   Persistência em localStorage
-   Redirecionamento automático

## 🔄 Integração com Backend

### Endpoints Consumidos

-   `POST /auth/login` - Autenticação
-   `POST /auth/register` - Registro
-   `GET /appointments` - Listar consultas
-   `POST /appointments` - Criar consulta
-   `PATCH /appointments/:id` - Atualizar consulta
-   `DELETE /appointments/:id` - Cancelar consulta
-   `GET /users/doctors` - Listar médicos

### Interceptors

-   Adição automática de token
-   Refresh token automático
-   Tratamento de erros global

## 🎯 Próximas Implementações

### Funcionalidades Pendentes

-   [ ] Página de agendamento de consultas
-   [ ] Página de médicos para pacientes
-   [ ] Página de configurações/perfil
-   [ ] Notificações em tempo real
-   [ ] Sistema de busca avançada
-   [ ] Calendário interativo
-   [ ] Relatórios e estatísticas

### Melhorias Técnicas

-   [ ] Testes unitários (Jest + Testing Library)
-   [ ] Testes E2E (Playwright)
-   [ ] Storybook para componentes
-   [ ] PWA (Progressive Web App)
-   [ ] Otimizações de performance

## 📝 Convenções de Código

### Naming

-   **Componentes**: PascalCase
-   **Hooks**: camelCase com prefixo 'use'
-   **Tipos**: PascalCase
-   **Arquivos**: kebab-case

### Estrutura de Componentes

```typescript
// Imports
import { }

// Types
interface Props {}

// Component
export default function Component() {}
```

## 🤝 Contribuição

1. Clone o repositório
2. Crie uma branch feature
3. Implemente seguindo os padrões
4. Teste thoroughly
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte do sistema de gestão de consultas médicas desenvolvido para fins acadêmicos.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento frontend**
