const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cria médicos
  await prisma.user.createMany({
    data: [
      { name: 'Dr. João Silva', email: 'joao@clinic.com', password: '123456', role: 'DOCTOR', specialty: 'Cardiologia' },
      { name: 'Dra. Maria Souza', email: 'maria@clinic.com', password: '123456', role: 'DOCTOR', specialty: 'Dermatologia' }
    ],
    skipDuplicates: true
  });

  // Cria pacientes
  await prisma.user.createMany({
    data: [
      { name: 'Carlos Paciente', email: 'carlos@paciente.com', password: '123456', role: 'PATIENT' },
      { name: 'Ana Paciente', email: 'ana@paciente.com', password: '123456', role: 'PATIENT' }
    ],
    skipDuplicates: true
  });

  console.log('Seed concluído!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect()); 