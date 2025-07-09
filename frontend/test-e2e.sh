#!/bin/bash

# 🧪 Script Simples para Execução de Testes E2E
# 
# Como usar:
# ./test-e2e.sh [full|critical|quick|auth|patient|doctor]

echo "🧪 Executando Testes E2E - MedConsult"
echo "========================================"

# Define os conjuntos de testes
FULL_TESTS="cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/auth/auth_register_patient.cy.js,cypress/e2e/auth/auth_invalid_credentials.cy.js,cypress/e2e/app/doctors.cy.js,cypress/e2e/appointments/appointment_schedule.cy.js,cypress/e2e/app/appointments.cy.js,cypress/e2e/app/doctor_dashboard.cy.js,cypress/e2e/app/doctor_today_appointments.cy.js,cypress/e2e/app/doctor_appointments.cy.js,cypress/e2e/app/doctor_history.cy.js,cypress/e2e/app/doctor_patients.cy.js,cypress/e2e/app/patients.cy.js"

CRITICAL_TESTS="cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/appointments/appointment_schedule.cy.js,cypress/e2e/app/doctor_dashboard.cy.js,cypress/e2e/app/doctor_today_appointments.cy.js"

QUICK_TESTS="cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/app/doctors.cy.js,cypress/e2e/appointments/appointment_schedule.cy.js"

AUTH_TESTS="cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/auth/auth_register_patient.cy.js,cypress/e2e/auth/auth_invalid_credentials.cy.js"

PATIENT_TESTS="cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/app/doctors.cy.js,cypress/e2e/appointments/appointment_schedule.cy.js,cypress/e2e/app/appointments.cy.js"

DOCTOR_TESTS="cypress/e2e/auth/auth_login_valid.cy.js,cypress/e2e/app/doctor_dashboard.cy.js,cypress/e2e/app/doctor_today_appointments.cy.js,cypress/e2e/app/doctor_appointments.cy.js,cypress/e2e/app/doctor_history.cy.js,cypress/e2e/app/doctor_patients.cy.js"

# Função para mostrar ajuda
show_help() {
  echo ""
  echo "📋 USO:"
  echo "  ./test-e2e.sh [TIPO]"
  echo ""
  echo "🎯 TIPOS DE TESTE:"
  echo "  full        Executa todos os testes (padrão)"
  echo "  critical    Executa testes críticos"
  echo "  quick       Executa testes básicos"
  echo "  auth        Executa apenas autenticação"
  echo "  patient     Executa jornada do paciente"
  echo "  doctor      Executa jornada do médico"
  echo ""
  echo "📝 EXEMPLOS:"
  echo "  ./test-e2e.sh full"
  echo "  ./test-e2e.sh critical"
  echo "  ./test-e2e.sh quick"
  echo ""
}

# Pega o tipo de teste (padrão: full)
TEST_TYPE=${1:-full}

# Verifica se é pedido de ajuda
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  show_help
  exit 0
fi

# Seleciona os testes baseado no tipo
case $TEST_TYPE in
  "full")
    TESTS=$FULL_TESTS
    echo "🧪 Executando TODOS os testes (15-20 min)"
    ;;
  "critical")
    TESTS=$CRITICAL_TESTS
    echo "⚡ Executando testes CRÍTICOS (5-8 min)"
    ;;
  "quick")
    TESTS=$QUICK_TESTS
    echo "🚀 Executando testes RÁPIDOS (3-5 min)"
    ;;
  "auth")
    TESTS=$AUTH_TESTS
    echo "🔐 Executando testes de AUTENTICAÇÃO (3-5 min)"
    ;;
  "patient")
    TESTS=$PATIENT_TESTS
    echo "👤 Executando jornada do PACIENTE (8-12 min)"
    ;;
  "doctor")
    TESTS=$DOCTOR_TESTS
    echo "👨‍⚕️ Executando jornada do MÉDICO (10-15 min)"
    ;;
  *)
    echo "❌ Tipo de teste inválido: $TEST_TYPE"
    show_help
    exit 1
    ;;
esac

echo "========================================"
echo ""

# Executa os testes
echo "🚀 Executando: npx cypress run --spec \"$TESTS\""
echo ""

npx cypress run --spec "$TESTS"

# Verifica se os testes foram executados com sucesso
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Todos os testes executados com sucesso!"
  echo ""
  echo "📊 RESUMO:"
  echo "   Tipo: $TEST_TYPE"
  echo "   Status: ✅ SUCESSO"
else
  echo ""
  echo "❌ Alguns testes falharam!"
  echo ""
  echo "🔧 TROUBLESHOOTING:"
  echo "1. Verifique se o servidor está rodando: npm run dev"
  echo "2. Instale dependências: npm install"
  echo "3. Verifique se o Cypress está configurado"
  echo ""
  exit 1
fi 