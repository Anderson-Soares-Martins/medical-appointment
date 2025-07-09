#!/usr/bin/env node

/**
 * 🧪 Script de Execução dos Testes E2E
 * 
 * Como usar:
 * node run-tests.js [full|critical|quick|auth|patient|doctor]
 * 
 * Exemplos:
 * node run-tests.js full          # Executa todos os testes
 * node run-tests.js critical      # Executa testes críticos
 * node run-tests.js quick         # Executa testes rápidos
 * node run-tests.js auth          # Executa apenas autenticação
 * node run-tests.js patient       # Executa jornada do paciente
 * node run-tests.js doctor        # Executa jornada do médico
 */

const { execSync } = require('child_process');
const path = require('path');

// Importa configurações (simulado - adapte para seu ambiente)
const config = {
  FULL_TEST_ORDER: [
    'cypress/e2e/auth/auth_login_valid.cy.js',
    'cypress/e2e/auth/auth_register_patient.cy.js',
    'cypress/e2e/auth/auth_invalid_credentials.cy.js',
    'cypress/e2e/app/doctors.cy.js',
    'cypress/e2e/appointments/appointment_schedule.cy.js',
    'cypress/e2e/app/appointments.cy.js',
    'cypress/e2e/app/doctor_dashboard.cy.js',
    'cypress/e2e/app/doctor_today_appointments.cy.js',
    'cypress/e2e/app/doctor_appointments.cy.js',
    'cypress/e2e/app/doctor_history.cy.js',
    'cypress/e2e/app/doctor_patients.cy.js',
    'cypress/e2e/app/patients.cy.js'
  ],

  CRITICAL_TESTS: [
    'cypress/e2e/auth/auth_login_valid.cy.js',
    'cypress/e2e/appointments/appointment_schedule.cy.js',
    'cypress/e2e/app/doctor_dashboard.cy.js',
    'cypress/e2e/app/doctor_today_appointments.cy.js'
  ],

  QUICK_TESTS: [
    'cypress/e2e/auth/auth_login_valid.cy.js',
    'cypress/e2e/app/doctors.cy.js',
    'cypress/e2e/appointments/appointment_schedule.cy.js'
  ],

  AUTH_TESTS: [
    'cypress/e2e/auth/auth_login_valid.cy.js',
    'cypress/e2e/auth/auth_register_patient.cy.js',
    'cypress/e2e/auth/auth_invalid_credentials.cy.js'
  ],

  PATIENT_TESTS: [
    'cypress/e2e/auth/auth_login_valid.cy.js',
    'cypress/e2e/app/doctors.cy.js',
    'cypress/e2e/appointments/appointment_schedule.cy.js',
    'cypress/e2e/app/appointments.cy.js'
  ],

  DOCTOR_TESTS: [
    'cypress/e2e/auth/auth_login_valid.cy.js',
    'cypress/e2e/app/doctor_dashboard.cy.js',
    'cypress/e2e/app/doctor_today_appointments.cy.js',
    'cypress/e2e/app/doctor_appointments.cy.js',
    'cypress/e2e/app/doctor_history.cy.js',
    'cypress/e2e/app/doctor_patients.cy.js'
  ]
};

// Função para encontrar o diretório frontend
function findFrontendDirectory() {
  const currentDir = process.cwd();
  const scriptDir = path.dirname(__filename);

  // Se o script está em frontend/cypress/e2e, então frontend é 2 níveis acima
  const frontendDir = path.resolve(scriptDir, '..', '..');

  // Verifica se existe cypress.config.js no diretório frontend
  const fs = require('fs');
  const cypressConfig = path.join(frontendDir, 'cypress.config.js');

  if (fs.existsSync(cypressConfig)) {
    return frontendDir;
  }

  // Fallback: procura por frontend no diretório atual
  const altFrontendDir = path.join(currentDir, 'frontend');
  if (fs.existsSync(path.join(altFrontendDir, 'cypress.config.js'))) {
    return altFrontendDir;
  }

  // Se não encontrar, retorna o diretório atual
  return currentDir;
}

// Função para exibir ajuda
function showHelp() {
  console.log(`
🧪 Script de Execução dos Testes E2E - MedConsult

📋 USO:
  node run-tests.js [TIPO] [OPÇÕES]

🎯 TIPOS DE TESTE:
  full        Executa todos os testes (recomendado)
  critical    Executa testes críticos (mais rápido)
  quick       Executa testes básicos (desenvolvimento)
  auth        Executa apenas autenticação
  patient     Executa jornada do paciente
  doctor      Executa jornada do médico

⚡ OPÇÕES:
  --headed    Executa com interface visual
  --help      Mostra esta ajuda

📝 EXEMPLOS:
  node run-tests.js full
  node run-tests.js critical --headed
  node run-tests.js patient
  node run-tests.js doctor

🚀 ORDEM COMPLETA TESTADA:
  1. Autenticação (Login, Cadastro, Validações)
  2. Jornada do Paciente (Maria → Lista médicos → Agenda com Dra. Ana)
  3. Jornada do Médico (Dra. Ana → Dashboard → Gerencia consultas)
  4. Controle de Acesso (Validações de permissão)
  
⏱️  TEMPO ESTIMADO:
  full: 15-20 minutos | critical: 5-8 minutos | quick: 3-5 minutos
  `);
}

// Função para exibir informações do teste
function showTestInfo(testType) {
  const configs = {
    full: {
      title: '🧪 Executando Testes E2E Completos',
      description: 'Fluxo completo: Autenticação → Paciente → Médico',
      tests: config.FULL_TEST_ORDER.length,
      estimated: '15-20 minutos',
      details: [
        '✅ Login de Maria e Dra. Ana',
        '✅ Maria agenda consulta com Dra. Ana',
        '✅ Dra. Ana gerencia consultas',
        '✅ Validações de segurança'
      ]
    },
    critical: {
      title: '⚡ Executando Testes Críticos',
      description: 'Funcionalidades essenciais do sistema',
      tests: config.CRITICAL_TESTS.length,
      estimated: '5-8 minutos',
      details: [
        '✅ Login válido',
        '✅ Agendamento de consulta',
        '✅ Dashboard do médico',
        '✅ Consultas de hoje'
      ]
    },
    quick: {
      title: '🚀 Executando Testes Rápidos',
      description: 'Funcionalidades básicas para desenvolvimento',
      tests: config.QUICK_TESTS.length,
      estimated: '3-5 minutos',
      details: [
        '✅ Login válido',
        '✅ Lista de médicos',
        '✅ Agendamento básico'
      ]
    },
    auth: {
      title: '🔐 Executando Testes de Autenticação',
      description: 'Login, cadastro e validações',
      tests: config.AUTH_TESTS.length,
      estimated: '3-5 minutos',
      details: [
        '✅ Login válido (Maria e Dra. Ana)',
        '✅ Cadastro de paciente e médico',
        '✅ Validações de erro'
      ]
    },
    patient: {
      title: '👤 Executando Jornada do Paciente',
      description: 'Fluxo completo do paciente Maria',
      tests: config.PATIENT_TESTS.length,
      estimated: '8-12 minutos',
      details: [
        '✅ Login de Maria',
        '✅ Visualização de médicos',
        '✅ Agendamento com Dra. Ana',
        '✅ Gerenciamento de consultas'
      ]
    },
    doctor: {
      title: '👨‍⚕️ Executando Jornada do Médico',
      description: 'Fluxo completo da Dra. Ana Costa',
      tests: config.DOCTOR_TESTS.length,
      estimated: '10-15 minutos',
      details: [
        '✅ Login da Dra. Ana',
        '✅ Dashboard com estatísticas',
        '✅ Consultas de hoje',
        '✅ Gerenciamento completo',
        '✅ Histórico e pacientes'
      ]
    }
  };

  const testConfig = configs[testType] || configs.full;

  console.log('\n' + '='.repeat(60));
  console.log(testConfig.title);
  console.log('='.repeat(60));
  console.log(`📋 ${testConfig.description}`);
  console.log(`🧪 Número de testes: ${testConfig.tests}`);
  console.log(`⏱️  Tempo estimado: ${testConfig.estimated}`);
  console.log('\n📝 O que será testado:');
  testConfig.details.forEach(detail => console.log(`   ${detail}`));
  console.log('='.repeat(60) + '\n');
}

// Função para executar testes
function runTests(testType = 'full', headed = false) {
  const testSets = {
    full: config.FULL_TEST_ORDER,
    critical: config.CRITICAL_TESTS,
    quick: config.QUICK_TESTS,
    auth: config.AUTH_TESTS,
    patient: config.PATIENT_TESTS,
    doctor: config.DOCTOR_TESTS
  };

  const tests = testSets[testType];

  if (!tests) {
    console.error(`❌ Tipo de teste inválido: ${testType}`);
    showHelp();
    process.exit(1);
  }

  // Mostra informações antes de executar
  showTestInfo(testType);

  // Encontra o diretório frontend
  const frontendDir = findFrontendDirectory();
  console.log(`📁 Diretório frontend: ${frontendDir}`);

  // Constrói comando
  const specList = tests.join(',');
  const headedFlag = headed ? '--headed' : '';
  const command = `npx cypress run --spec "${specList}" ${headedFlag}`.trim();

  console.log(`🚀 Executando comando: ${command}`);
  console.log(`📂 No diretório: ${frontendDir}\n`);

  try {
    // Executa os testes no diretório frontend
    execSync(command, {
      stdio: 'inherit',
      cwd: frontendDir
    });

    console.log('\n✅ Todos os testes executados com sucesso!');

    // Mostra resumo
    console.log('\n📊 RESUMO DA EXECUÇÃO:');
    console.log(`   Tipo: ${testType}`);
    console.log(`   Testes executados: ${tests.length}`);
    console.log(`   Modo: ${headed ? 'Interface visual' : 'Headless'}`);
    console.log(`   Diretório: ${frontendDir}`);

  } catch (error) {
    console.error('\n❌ Erro durante execução dos testes:');
    console.error(error.message);

    // Sugestões de troubleshooting
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. Verifique se o servidor está rodando: npm run dev');
    console.log('2. Instale dependências: npm install');
    console.log('3. Verifique se o Cypress está configurado corretamente');
    console.log('4. Tente executar um teste individual primeiro');

    process.exit(1);
  }
}

// Função principal
function main() {
  const args = process.argv.slice(2);

  // Verifica se é pedido de ajuda
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }

  // Pega tipo de teste (padrão: full)
  const testType = args[0] || 'full';

  // Verifica se é modo headed
  const headed = args.includes('--headed');

  // Valida tipo de teste
  const validTypes = ['full', 'critical', 'quick', 'auth', 'patient', 'doctor'];
  if (!validTypes.includes(testType)) {
    console.error(`❌ Tipo de teste inválido: ${testType}`);
    console.error(`✅ Tipos válidos: ${validTypes.join(', ')}`);
    showHelp();
    process.exit(1);
  }

  // Executa testes
  runTests(testType, headed);
}

// Executa apenas se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  runTests,
  showHelp,
  showTestInfo,
  config
}; 