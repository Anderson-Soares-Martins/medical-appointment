# 🚨 Demonstração Sentry - Sistema de Agendamento Médico

Este arquivo explica como usar as funcionalidades de demonstração do Sentry implementadas no sistema de agendamento de consultas médicas.

## 📍 Localização

As funcionalidades de demonstração estão implementadas na página:

```
frontend/src/app/appointments/new/page.tsx
```

## 🎯 Funcionalidades Implementadas

### 1. Painel de Demonstração

Na página de agendamento de consultas (`/appointments/new`), você encontrará um painel laranja com bordas tracejadas contendo:

#### Botões de Erro Imediato:

-   **Erro de Rede**: Simula falha de conexão com API
-   **Erro de Validação**: Simula dados de formulário inválidos
-   **Erro de Referência**: Força um erro de propriedade nula

#### Toggle de Erro no Formulário:

-   **Erro OFF/ON**: Quando ativado, o próximo agendamento irá gerar um erro aleatório

### 2. Tipos de Erro Demonstrados

#### Erro de Referência (TypeError)

```javascript
const obj = null
obj.property.nested.value // TypeError: Cannot read property
```

#### Erro Customizado (Error)

```javascript
throw new Error('Sistema de agendamento temporariamente indisponível')
```

#### Erro de Rede Simulado

```javascript
throw new Error('Falha na comunicação com o servidor - Código: NET_001')
```

#### Erro de Validação

```javascript
throw new Error('Horário não disponível para o médico selecionado')
```

## 🎪 Como Usar na Apresentação

### Cenário 1: Demonstrar Captura Imediata

1. Acesse `/appointments/new`
2. Clique em qualquer dos 3 primeiros botões do painel
3. Observe o toast de erro e verifique no dashboard do Sentry

### Cenário 2: Demonstrar Erro no Fluxo Real

1. Acesse `/appointments/new`
2. Clique no botão "Erro OFF" para ativá-lo (ficará "Erro ON")
3. Preencha o formulário normalmente:
    - Selecione um médico
    - Escolha uma data
    - Selecione um horário
    - Adicione observações (opcional)
4. Clique em "Confirmar" - um erro aleatório será gerado
5. Verifique no Sentry o contexto completo capturado

## 📊 Contexto Capturado pelo Sentry

Para cada erro, o Sentry recebe:

### Tags:

-   `section`: "appointment_creation"
-   `user_role`: Papel do usuário (PATIENT/DOCTOR)
-   `error_type`: Tipo específico do erro (network/validation/reference)
-   `demo`: true (para erros de demonstração)

### Contexto Adicional:

```javascript
{
  appointment_data: {
    doctorId: "id-do-medico",
    date: "2024-01-15",
    time: "09:00",
    user_role: "PATIENT",
    user_id: "id-do-usuario"
  }
}
```

### Dados Extra:

```javascript
{
  form_data: "dados-do-formulario",
  current_step: 4,
  force_error: true,
  demonstration: "Error capturado durante apresentação",
  timestamp: "2024-01-15T09:00:00.000Z"
}
```

## 🔧 Configuração do Sentry

O Sentry está configurado em:

-   `frontend/src/instrumentation-client.ts` (client-side)
-   `frontend/sentry.server.config.ts` (server-side)
-   `frontend/sentry.edge.config.ts` (edge runtime)

### Configurações Ativas:

-   **Session Replay**: 10% das sessões normais, 100% com erro
-   **Performance Monitoring**: 100% das transações
-   **Debug Mode**: Desabilitado

## 🎨 Pontos para Destacar na Apresentação

1. **Captura Automática**: Erros são automaticamente enviados ao Sentry
2. **Contexto Rico**: Informações detalhadas sobre o estado da aplicação
3. **Session Replay**: Gravação da sessão do usuário quando há erro
4. **Performance**: Monitoramento de performance das operações
5. **Alertas**: Notificações automáticas para a equipe
6. **Release Tracking**: Associação de erros com versões específicas

## 🚀 Para Remover Após a Apresentação

Para limpar o código após a apresentação, remova:

1. Import do Sentry no início do arquivo
2. Estado `forceSentryError`
3. Objeto `demonstrateSentryErrors`
4. Todo o Card com className "border-orange-300"
5. A lógica de erro proposital na função `onSubmit`
6. Mantenha apenas a captura de erro normal com `Sentry.captureException`

---

**💡 Dica**: Mantenha o dashboard do Sentry aberto em outra aba durante a apresentação para mostrar os erros sendo capturados em tempo real!
