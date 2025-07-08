const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Gera hash das senhas
  const hash = await bcrypt.hash('123456', 10);

  // Cria médicos
  await prisma.user.createMany({
    data: [
      { name: 'Dr. João Silva', email: 'joao@clinic.com', password: hash, role: 'DOCTOR', specialty: 'Cardiologia' },
      { name: 'Dra. Maria Souza', email: 'maria@clinic.com', password: hash, role: 'DOCTOR', specialty: 'Dermatologia' }
    ],
    skipDuplicates: true
  });

  // Cria pacientes
  await prisma.user.createMany({
    data: [
      { name: 'Carlos Paciente', email: 'carlos@paciente.com', password: hash, role: 'PATIENT' },
      { name: 'Ana Paciente', email: 'ana@paciente.com', password: hash, role: 'PATIENT' }
    ],
    skipDuplicates: true
  });

  console.log('Seed concluído!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());