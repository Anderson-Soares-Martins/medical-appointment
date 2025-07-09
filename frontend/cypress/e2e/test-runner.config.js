/**
 * 🧪 Configuração de Execução dos Testes E2E
 * 
 * Este arquivo define as ordens de execução dos testes para diferentes cenários
 */

// Ordem completa recomendada
export const FULL_TEST_ORDER = [
  // 1. Autenticação (Base)
  'cypress/e2e/auth/auth_login_valid.cy.js',
  'cypress/e2e/auth/auth_register_patient.cy.js',
  'cypress/e2e/auth/auth_invalid_credentials.cy.js',

  // 2. Jornada do Paciente (Criação de dados)
  'cypress/e2e/app/doctors.cy.js',
  'cypress/e2e/appointments/appointment_schedule.cy.js',
  'cypress/e2e/app/appointments.cy.js',

  // 3. Jornada do Médico (Uso dos dados)
  'cypress/e2e/app/doctor_dashboard.cy.js',
  'cypress/e2e/app/doctor_today_appointments.cy.js',
  'cypress/e2e/app/doctor_appointments.cy.js',
  'cypress/e2e/app/doctor_history.cy.js',
  'cypress/e2e/app/doctor_patients.cy.js',

  // 4. Controle de Acesso
  'cypress/e2e/app/patients.cy.js'
];

// Ordem para testes críticos apenas
export const CRITICAL_TESTS = [
  'cypress/e2e/auth/auth_login_valid.cy.js',
  'cypress/e2e/appointments/appointment_schedule.cy.js',
  'cypress/e2e/app/doctor_dashboard.cy.js',
  'cypress/e2e/app/doctor_today_appointments.cy.js'
];

// Ordem para desenvolvimento rápido
export const QUICK_TESTS = [
  'cypress/e2e/auth/auth_login_valid.cy.js',
  'cypress/e2e/app/doctors.cy.js',
  'cypress/e2e/appointments/appointment_schedule.cy.js'
];

// Ordem para testar apenas autenticação
export const AUTH_TESTS = [
  'cypress/e2e/auth/auth_login_valid.cy.js',
  'cypress/e2e/auth/auth_register_patient.cy.js',
  'cypress/e2e/auth/auth_invalid_credentials.cy.js'
];

// Ordem para testar apenas jornada do paciente
export const PATIENT_TESTS = [
  'cypress/e2e/auth/auth_login_valid.cy.js',
  'cypress/e2e/app/doctors.cy.js',
  'cypress/e2e/appointments/appointment_schedule.cy.js',
  'cypress/e2e/app/appointments.cy.js'
];

// Ordem para testar apenas jornada do médico
export const DOCTOR_TESTS = [
  'cypress/e2e/auth/auth_login_valid.cy.js',
  'cypress/e2e/app/doctor_dashboard.cy.js',
  'cypress/e2e/app/doctor_today_appointments.cy.js',
  'cypress/e2e/app/doctor_appointments.cy.js',
  'cypress/e2e/app/doctor_history.cy.js',
  'cypress/e2e/app/doctor_patients.cy.js'
];

// Comandos para executar
export const COMMANDS = {
  // Comando completo
  full: `cypress run --spec "${FULL_TEST_ORDER.join(',')}"`,

  // Comando para testes críticos
  critical: `cypress run --spec "${CRITICAL_TESTS.join(',')}"`,

  // Comando para desenvolvimento rápido
  quick: `cypress run --spec "${QUICK_TESTS.join(',')}"`,

  // Comando para autenticação
  auth: `cypress run --spec "${AUTH_TESTS.join(',')}"`,

  // Comando para jornada do paciente
  patient: `cypress run --spec "${PATIENT_TESTS.join(',')}"`,

  // Comando para jornada do médico
  doctor: `cypress run --spec "${DOCTOR_TESTS.join(',')}"`,

  // Comando para modo headed (com interface)
  fullHeaded: `cypress run --spec "${FULL_TEST_ORDER.join(',')}" --headed`,

  // Comando para abrir Cypress UI
  open: 'cypress open'
};

// Configurações específicas para cada ambiente
export const ENVIRONMENTS = {
  development: {
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  },

  staging: {
    baseUrl: 'https://staging.medconsult.com',
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000
  },

  production: {
    baseUrl: 'https://medconsult.com',
    defaultCommandTimeout: 20000,
    requestTimeout: 20000,
    responseTimeout: 20000
  }
};

// Dados de teste organizados
export const TEST_DATA = {
  patients: {
    maria: {
      email: 'maria.patient@email.com',
      password: 'Password123',
      name: 'Maria Silva Santos',
      phone: '(11) 99999-8888',
      cpf: '123.456.789-00',
      birthDate: '1990-05-15'
    }
  },

  doctors: {
    ana: {
      email: 'dra.ana@clinic.com',
      password: 'Password123',
      name: 'Dra. Ana Costa',
      specialty: 'Dermatologia',
      crm: 'CRM-SP 67890',
      phone: '(11) 98765-4321',
      workingHours: '09:00-18:00'
    },
    joao: {
      email: 'dr.silva@clinic.com',
      password: 'Password123',
      name: 'Dr. João Silva',
      specialty: 'Cardiologia',
      crm: 'CRM-SP 12345',
      phone: '(11) 97654-3210',
      workingHours: '08:00-17:00'
    },
    maria: {
      email: 'dra.maria@clinic.com',
      password: 'Password123',
      name: 'Dra. Maria Santos',
      specialty: 'Pediatria',
      crm: 'CRM-SP 11223',
      phone: '(11) 96543-2109',
      workingHours: '07:00-16:00'
    }
  }
};

// Função para gerar comando personalizado
export function generateCommand(testFiles) {
  return `cypress run --spec "${testFiles.join(',')}"`;
}

// Função para validar ordem de testes
export function validateTestOrder(testFiles) {
  const requiredFirst = ['auth_login_valid.cy.js'];
  const requiredBeforeDoctor = ['appointment_schedule.cy.js'];

  // Verifica se autenticação vem primeiro
  const authIndex = testFiles.findIndex(file =>
    requiredFirst.some(required => file.includes(required))
  );

  if (authIndex !== 0) {
    console.warn('⚠️  Recomendação: Execute testes de autenticação primeiro');
  }

  // Verifica se agendamento vem antes dos testes do médico
  const scheduleIndex = testFiles.findIndex(file =>
    requiredBeforeDoctor.some(required => file.includes(required))
  );

  const doctorIndex = testFiles.findIndex(file =>
    file.includes('doctor_')
  );

  if (doctorIndex !== -1 && scheduleIndex !== -1 && scheduleIndex > doctorIndex) {
    console.warn('⚠️  Recomendação: Execute agendamento antes dos testes do médico');
  }

  return true;
}

// Logs informativos
export function logTestInfo(testType = 'full') {
  const configs = {
    full: {
      title: '🧪 Executando Testes E2E Completos',
      description: 'Testando fluxo completo: Autenticação → Paciente → Médico',
      tests: FULL_TEST_ORDER.length,
      estimated: '15-20 minutos'
    },
    critical: {
      title: '⚡ Executando Testes Críticos',
      description: 'Testando funcionalidades essenciais do sistema',
      tests: CRITICAL_TESTS.length,
      estimated: '5-8 minutos'
    },
    quick: {
      title: '🚀 Executando Testes Rápidos',
      description: 'Testando funcionalidades básicas para desenvolvimento',
      tests: QUICK_TESTS.length,
      estimated: '3-5 minutos'
    }
  };

  const config = configs[testType] || configs.full;

  console.log('\n' + '='.repeat(60));
  console.log(config.title);
  console.log('='.repeat(60));
  console.log(`📋 ${config.description}`);
  console.log(`🧪 Testes: ${config.tests}`);
  console.log(`⏱️  Tempo estimado: ${config.estimated}`);
  console.log('='.repeat(60) + '\n');
}

// Exporta configuração padrão
export default {
  FULL_TEST_ORDER,
  CRITICAL_TESTS,
  QUICK_TESTS,
  AUTH_TESTS,
  PATIENT_TESTS,
  DOCTOR_TESTS,
  COMMANDS,
  ENVIRONMENTS,
  TEST_DATA,
  generateCommand,
  validateTestOrder,
  logTestInfo
}; 