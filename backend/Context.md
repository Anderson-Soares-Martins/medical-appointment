Sistema de Gestão de Consultas Médicas
📌 Descrição Geral
O projeto tem como objetivo modernizar a gestão de consultas médicas em clínicas e hospitais, eliminando problemas comuns como:

Agendamentos conflitantes;
Comunicação ineficaz entre profissionais e pacientes;
Falta de controle eficiente do histórico de atendimentos.
🎯 Objetivos
Cadastro de médicos e pacientes;
Agendamento e cancelamento de consultas;
Histórico de atendimentos acessível por usuários autorizados;
Notificações automáticas por e-mail/SMS;
Interfaces separadas para pacientes, médicos e atendentes.
🧑‍🤝‍🧑 Atores do Sistema
Paciente
Médico
Atendente
📋 Casos de Uso Principais
UC1: Agendar Consulta
Atores: Paciente
Fluxo Principal:

Paciente faz login.
Escolhe "Agendar Consulta".
Sistema exibe médicos, datas e horários.
Paciente seleciona médico, data e horário.
Sistema verifica disponibilidade.
Se disponível:
Registra a consulta no banco de dados;
Envia notificação ao médico;
Confirma ao pacient.
UC2: Cancelar Consulta
Atores: Paciente ou Médico
Fluxo Principal:

Login no sistema;
Acesso à tela "Minhas Consultas";
Seleção da consulta a ser cancelada;
Confirmação do cancelamento;
Sistema atualiza status, notifica envolvidos, exibe sucesso.
UC3: Visualizar Histórico de Consultas
Atores: Paciente ou Médico
Fluxo Principal:

Login no sistema;
Acesso à tela de histórico;
Sistema exibe lista de consultas anteriores com data, status e participantes;
Detalhamento por consulta disponível.
UC4: Confirmar Realização de Consulta
Atores: Médico (principal), Paciente (secundário)
Fluxo Principal:

Médico acessa "Consultas do Dia";
Seleciona a consulta;
Marca como realizada, com opção de adicionar observações;
Sistema registra data/hora, notifica pacient e adiciona ao histórico.
🔔 Notificações Automáticas
Utiliza o padrão Observer para:

Agendamentos;
Cancelamentos;
Confirmações de consulta.
🧱 Arquitetura e Padrões de Projeto
MVC (Model-View-Controller): Separação de responsabilidades.
Observer: Para notificações.
Singleton: Para controle de instâncias críticas.
Facade: Para simplificar interações com subsistemas.
⛔ Restrições
Prontuário eletrônico não incluso;
Faturamento e cobrança fora do escopo;
Tempo total de execução: 9 semanas.
📆 Cronograma
Semanas 1-2: Levantamento e modelagem;
Semanas 3-4: Backend e banco de dados;
Semanas 5-6: Frontend;
Semanas 7-8: Testes;
Semana 9: Apresentação.
✅ Resultados Esperados
Plataforma funcional e amigável;
Banco de dados seguro;
Notificações automáticas;
Adoção pelos usuários com treinamento;
Redução de faltas e aumento de eficiência.
