# Plano de Testes

Este projeto possui três entidades principais: Paciente, Médico e Consulta. Os testes automatizados cobrem os fluxos principais, alternativos e de exceção de cada caso de uso.

## Casos de Uso Testados

1. **Listagem de Médicos**
   - **Fluxo principal:** exibe a lista de médicos disponíveis.
   - **Fluxo alternativo:** aplica filtro por especialidade.
   - **Fluxo de exceção:** trata falha na API exibindo mensagem de erro.
2. **Gerenciamento de Pacientes**
   - **Fluxo principal:** médico visualiza lista de pacientes vinculados.
   - **Fluxo alternativo:** médico busca paciente pelo nome.
   - **Fluxo de exceção:** usuário paciente é redirecionado ao tentar acessar a tela.
3. **Gerenciamento de Consultas**
   - **Fluxo principal:** usuário visualiza suas consultas agendadas.
   - **Fluxo alternativo:** cancela uma consulta existente.
   - **Fluxo de exceção:** exibe estado vazio quando não há consultas.

Cada caso de uso possui três testes automatizados, totalizando nove cenários de sistema. Além disso, há testes unitários para utilitários de formatação e testes de integração para os serviços de API.
