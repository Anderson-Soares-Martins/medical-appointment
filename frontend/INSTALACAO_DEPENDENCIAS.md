# 🛠️ INSTALAÇÃO DAS DEPENDÊNCIAS DE TESTE

## 📦 Dependências Necessárias

Para executar todos os testes, você precisa instalar as seguintes dependências:

### 1. Cypress e Coverage

```bash
npm install --save-dev cypress @cypress/code-coverage nyc
```

### 2. Jest e Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 3. Configuração TypeScript para Jest

```bash
npm install --save-dev ts-jest @types/jest jest-environment-jsdom
```

### 4. Instalação Completa (Comando Único)

```bash
npm install --save-dev \
  cypress \
  @cypress/code-coverage \
  nyc \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  ts-jest \
  @types/jest \
  jest-environment-jsdom
```

## ✅ Verificação da Instalação

Após instalar, execute:

```bash
# Verificar Cypress
npx cypress --version

# Verificar Jest
npx jest --version

# Teste básico
npm run test:system
```

## 🚀 Execução Rápida

1. **Instalar dependências**:

    ```bash
    npm install
    ```

2. **Executar backend**:

    ```bash
    cd ../backend && npm run dev
    ```

3. **Executar frontend**:

    ```bash
    npm run dev
    ```

4. **Executar testes obrigatórios**:
    ```bash
    npm run test:system
    ```

## 📋 Status das Dependências

-   ✅ **Cypress** - Testes E2E e de Sistema
-   ✅ **Jest** - Testes Unitários
-   ✅ **Testing Library** - Testes de Componentes React
-   ✅ **Coverage** - Relatórios de Cobertura
-   ✅ **TypeScript** - Suporte completo

## 🔧 Comandos Disponíveis

```bash
npm run test              # Testes unitários
npm run test:watch        # Testes unitários em watch mode
npm run test:coverage     # Testes com cobertura
npm run cypress:open      # Interface gráfica do Cypress
npm run test:system       # 9 testes obrigatórios
npm run test:integration  # Testes de integração
npm run test:all          # Todos os testes
```
