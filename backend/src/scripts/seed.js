const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await prisma.appointment.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedPassword = await bcrypt.hash('Password123', 12);

    // Create doctors
    const doctors = await Promise.all([
      prisma.user.create({
        data: {
          email: 'dr.silva@clinic.com',
          password: hashedPassword,
          name: 'Dr. Maria Silva',
          role: 'DOCTOR',
          specialty: 'Cardiologia'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.santos@clinic.com',
          password: hashedPassword,
          name: 'Dr. João Santos',
          role: 'DOCTOR',
          specialty: 'Dermatologia'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.oliveira@clinic.com',
          password: hashedPassword,
          name: 'Dra. Ana Oliveira',
          role: 'DOCTOR',
          specialty: 'Pediatria'
        }
      }),
      prisma.user.create({
        data: {
          email: 'dr.costa@clinic.com',
          password: hashedPassword,
          name: 'Dr. Carlos Costa',
          role: 'DOCTOR',
          specialty: 'Ortopedia'
        }
      })
    ]);

    console.log('👨‍⚕️  Created doctors');

    // Create patients
    const patients = await Promise.all([
      prisma.user.create({
        data: {
          email: 'maria.patient@email.com',
          password: hashedPassword,
          name: 'Maria Santos',
          role: 'PATIENT'
        }
      }),
      prisma.user.create({
        data: {
          email: 'joao.patient@email.com',
          password: hashedPassword,
          name: 'João Silva',
          role: 'PATIENT'
        }
      }),
      prisma.user.create({
        data: {
          email: 'ana.patient@email.com',
          password: hashedPassword,
          name: 'Ana Costa',
          role: 'PATIENT'
        }
      }),
      prisma.user.create({
        data: {
          email: 'pedro.patient@email.com',
          password: hashedPassword,
          name: 'Pedro Oliveira',
          role: 'PATIENT'
        }
      })
    ]);

    console.log('👥 Created patients');

    // Create some appointments
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(14, 30, 0, 0);

    const appointments = await Promise.all([
      prisma.appointment.create({
        data: {
          patientId: patients[0].id,
          doctorId: doctors[0].id,
          date: tomorrow,
          status: 'SCHEDULED',
          notes: 'Consulta de rotina'
        }
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[1].id,
          doctorId: doctors[1].id,
          date: nextWeek,
          status: 'SCHEDULED',
          notes: 'Avaliação dermatológica'
        }
      }),
      prisma.appointment.create({
        data: {
          patientId: patients[2].id,
          doctorId: doctors[2].id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          status: 'COMPLETED',
          notes: 'Consulta pediátrica - Paciente apresentou melhora'
        }
      })
    ]);

    console.log('📅 Created appointments');

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample data created:');
    console.log(`- ${doctors.length} doctors`);
    console.log(`- ${patients.length} patients`);
    console.log(`- ${appointments.length} appointments`);
    console.log('\n🔑 Login credentials:');
    console.log('Email: dr.silva@clinic.com | Password: Password123');
    console.log('Email: maria.patient@email.com | Password: Password123');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seed();
}

module.exports = seed;