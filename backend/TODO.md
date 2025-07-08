# TODO Backend - Sistema de Agendamento de Consultas

## ✅ Já Implementado

-   [x] Modelos no banco de dados (Prisma):
    -   Usuário (User) com papéis: Paciente, Médico
    -   Consulta (Appointment) com status: Agendada, Realizada, Cancelada, Não compareceu
-   [x] Cadastro e login de usuários (JWT)
-   [x] Listagem de médicos
-   [x] Perfil do usuário (visualização e edição)
-   [x] Agendamento de consultas
-   [x] Listagem de consultas por usuário (paciente ou médico)
-   [x] Atualização de status da consulta (apenas médicos)
-   [x] Cancelamento de consultas (paciente ou médico)
-   [x] Middleware de autenticação
-   [x] Controle básico de permissão por papel (ex: só médico pode atualizar status)

## ❌ Faltando / A Fazer

-   [ ] Lógica de verificação de conflito de agendamento (não permitir dois agendamentos no mesmo horário para o mesmo médico)
-   [ ] Implementar notificações automáticas (Observer):
    -   [ ] Ao agendar consulta
    -   [ ] Ao cancelar consulta
    -   [ ] Ao confirmar realização
    -   [ ] Integração com e-mail/SMS
-   [ ] Histórico detalhado de consultas (exibir observações, status, participantes)
-   [ ] Testes automatizados (unitários e integração)
-   [ ] Documentação da API (ex: Swagger/OpenAPI)
-   [ ] Facade para simplificar interações com subsistemas (opcional, para arquitetura)
-   [ ] Melhorar controle de autorização (ex: middleware por papel)
-   [ ] Tratamento de erros e mensagens mais detalhadas
-   [ ] Scripts de seed para dados iniciais (médicos, pacientes)

## Observações

-   Prontuário eletrônico e faturamento estão fora do escopo (ver Context.md)
-   Notificações são requisito importante (Observer)
-   Interfaces separadas para cada papel devem ser consideradas no frontend
