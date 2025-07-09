# Medical Appointments Backend

Backend API para o sistema de gestão de consultas médicas.

## 🚀 Tecnologias

-   **Node.js** - Runtime JavaScript
-   **Express.js** - Framework web
-   **Prisma** - ORM para banco de dados
-   **PostgreSQL** - Banco de dados
-   **JWT** - Autenticação
-   **bcryptjs** - Hash de senhas
-   **Swagger** - Documentação da API

## 📋 Pré-requisitos

-   Node.js 18+
-   Docker e Docker Compose
-   pnpm (recomendado) ou npm

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone <repository-url>
cd medical-appointment/backend
```

2. **Instale as dependências**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. **Inicie o banco de dados**

```bash
docker-compose up -d db
```

5. **Configure o banco de dados**

```bash
pnpm db:generate
pnpm db:push
pnpm db:seed
```

6. **Inicie o servidor**

```bash
pnpm dev
```

## 🗄️ Banco de Dados

### Com Docker (Recomendado)

```bash
docker-compose up -d db
```

### Configuração do Prisma

```bash
# Gerar cliente Prisma
pnpm db:generate

# Aplicar migrações
pnpm db:migrate

# Ou fazer push direto (desenvolvimento)
pnpm db:push

# Popular com dados de exemplo
pnpm db:seed

# Abrir Prisma Studio
pnpm db:studio
```

## 🔧 Scripts Disponíveis

-   `pnpm dev` - Inicia servidor em modo desenvolvimento
-   `pnpm start` - Inicia servidor em produção
-   `pnpm db:generate` - Gera cliente Prisma
-   `pnpm db:push` - Aplica schema ao banco
-   `pnpm db:migrate` - Executa migrações
-   `pnpm db:seed` - Popula banco com dados de exemplo
-   `pnpm db:studio` - Abre interface do Prisma

## 📚 API Endpoints

### Autenticação

-   `POST /api/auth/register` - Registrar usuário
-   `POST /api/auth/login` - Login
-   `POST /api/auth/refresh-token` - Renovar token
-   `GET /api/auth/profile` - Perfil do usuário
-   `PUT /api/auth/profile` - Atualizar perfil
-   `PUT /api/auth/change-password` - Alterar senha
-   `POST /api/auth/logout` - Logout

### Usuários

-   `GET /api/users/doctors` - Listar médicos
-   `GET /api/users/doctors/search` - Buscar médicos
-   `GET /api/users/doctors/:id` - Detalhes do médico
-   `GET /api/users/doctors/:id/availability` - Disponibilidade do médico
-   `GET /api/users/stats` - Estatísticas do usuário

### Consultas

-   `POST /api/appointments` - Criar consulta
-   `GET /api/appointments` - Listar consultas
-   `GET /api/appointments/:id` - Detalhes da consulta
-   `PUT /api/appointments/:id/cancel` - Cancelar consulta
-   `PUT /api/appointments/:id/complete` - Completar consulta
-   `GET /api/appointments/stats` - Estatísticas
-   `GET /api/appointments/today` - Consultas de hoje (médicos)
-   `GET /api/appointments/upcoming` - Próximas consultas
-   `GET /api/appointments/history` - Histórico

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Login/Registro**: Recebe email e senha
2. **Resposta**: Retorna token de acesso e refresh token
3. **Uso**: Incluir token no header `Authorization: Bearer <token>`

## 📊 Dados de Exemplo

Após executar `pnpm db:seed`, você terá:

### Médicos

-   Dr. Maria Silva (Cardiologia) - dr.silva@clinic.com
-   Dr. João Santos (Dermatologia) - dr.santos@clinic.com
-   Dra. Ana Oliveira (Pediatria) - dr.oliveira@clinic.com
-   Dr. Carlos Costa (Ortopedia) - dr.costa@clinic.com

### Pacientes

-   Maria Santos - maria.patient@email.com
-   João Silva - joao.patient@email.com
-   Ana Costa - ana.patient@email.com
-   Pedro Oliveira - pedro.patient@email.com

**Senha para todos**: `Password123`

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações (banco, etc.)
├── controllers/     # Controladores da API
├── middleware/      # Middlewares (auth, validação)
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários
└── index.js         # Ponto de entrada
```

## 🔄 Padrões Utilizados

-   **MVC**: Separação de responsabilidades
-   **Observer**: Para notificações automáticas
-   **Singleton**: Para serviços críticos
-   **Repository**: Para acesso a dados

## 📝 Documentação

Acesse a documentação Swagger em:

```
http://localhost:3001/api-docs
```

## 🧪 Testes

```bash
# Em desenvolvimento
pnpm test

# Com coverage
pnpm test:coverage
```

## 🚀 Deploy

### Docker

```bash
docker-compose up -d
```

### Manual

```bash
pnpm install --production
pnpm start
```

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.
