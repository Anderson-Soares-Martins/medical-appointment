# Configuração do Frontend

## Pré-requisitos

1. **Node.js 18+** instalado
2. **Backend** rodando em `http://localhost:3001`

## Passos de Instalação

### 1. Instalar Dependências

```bash
cd frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto frontend:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. Executar o Frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Clique em "Cadastrar"
3. Preencha os dados:
    - **Nome**: Seu nome completo
    - **Email**: seu@email.com
    - **Senha**: Password123 (ou qualquer senha)
    - **Tipo**: Paciente ou Médico
    - **Especialidade**: (apenas para médicos)

## Usuários de Teste (Backend)

Se o backend estiver com dados de seed, você pode usar:

### Médicos

-   **Email**: dr.silva@clinic.com
-   **Senha**: Password123
-   **Nome**: Dr. Maria Silva
-   **Especialidade**: Cardiologia

### Pacientes

-   **Email**: maria.patient@email.com
-   **Senha**: Password123
-   **Nome**: Maria Santos

## Estrutura de Navegação

### Para Pacientes

-   **Dashboard**: Visão geral das consultas
-   **Consultas**: Listar todas as consultas
-   **Médicos**: Visualizar médicos disponíveis
-   **Agendar**: Agendar nova consulta
-   **Histórico**: Histórico de consultas

### Para Médicos

-   **Dashboard**: Visão geral das consultas
-   **Consultas**: Gerenciar todas as consultas
-   **Hoje**: Consultas do dia atual
-   **Pacientes**: Visualizar pacientes
-   **Histórico**: Histórico de consultas

## Funcionalidades Implementadas

### ✅ Autenticação

-   Login e registro
-   Proteção de rotas
-   Logout automático

### ✅ Dashboard

-   Estatísticas de consultas
-   Consultas do dia
-   Próximas consultas

### ✅ Gestão de Consultas

-   Listagem com filtros
-   Cancelamento
-   Atualização de status (médicos)

### ⏳ Em Desenvolvimento

-   Agendamento de consultas
-   Página de médicos
-   Configurações de perfil

## Resolução de Problemas

### Erro de Conexão com API

1. Verifique se o backend está rodando em `http://localhost:3001`
2. Confirme se o arquivo `.env.local` está configurado corretamente
3. Verifique se não há problemas de CORS no backend

### Erro de Autenticação

1. Limpe o localStorage do navegador
2. Tente fazer login novamente
3. Verifique se o token JWT está sendo enviado

### Erro de Compilação

1. Apague a pasta `node_modules` e o arquivo `package-lock.json`
2. Execute `npm install` novamente
3. Tente executar `npm run dev` novamente

## Desenvolvimento

### Executar em Modo de Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
npm start
```

### Executar Linting

```bash
npm run lint
```

### Executar TypeScript Check

```bash
npm run type-check
```

## Suporte

Para problemas ou dúvidas, verifique:

1. Console do navegador para erros JavaScript
2. Terminal onde o frontend está rodando
3. Logs do backend para erros de API
4. Documentação da API no backend (`/api-docs`)

---

**Desenvolvido com Next.js 14 + TypeScript + TanStack Query**
