# Backend - Sistema de Agendamento de Consultas

## Como rodar

1. Instale as dependências:
    ```bash
    npm install
    ```
2. Configure o banco de dados no arquivo .env (variável DATABASE_URL).
3. Rode as migrations do Prisma:
    ```bash
    npx prisma migrate deploy
    ```
4. Popule dados iniciais:
    ```bash
    node scripts/seed.js
    ```
5. Inicie o servidor:
    ```bash
    npm start
    ```

## Notificações automáticas

As notificações de agendamento, cancelamento e confirmação de consultas são simuladas via console (mock). Para produção, integre um serviço real de e-mail/SMS em `src/utils/email.js`.

## Documentação da API

A documentação da API será disponibilizada via Swagger em breve.
