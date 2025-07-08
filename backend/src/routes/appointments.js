const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/email');

const router = express.Router();
const prisma = new PrismaClient();

// Get all appointments for a user (patient or doctor)
router.get('/', auth, async (req, res) => {
  try {
    const { userId, role } = req.user;

    const appointments = await prisma.appointment.findMany({
      where: role === 'DOCTOR' ? { doctorId: userId } : { patientId: userId },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        },
        doctor: {
          select: { id: true, name: true, specialty: true, email: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    // Histórico detalhado: incluir observações, status, participantes
    const detailed = appointments.map(a => ({
      id: a.id,
      date: a.date,
      status: a.status,
      notes: a.notes,
      patient: a.patient,
      doctor: a.doctor,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt
    }));

    res.json(detailed);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const patientId = req.user.userId;

    // Verifica conflito de agendamento
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        status: { not: 'CANCELLED' }
      }
    });
    if (conflict) {
      return res.status(409).json({ error: 'O médico já possui uma consulta agendada neste horário.' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        patientId,
        doctorId,
        status: 'SCHEDULED'
      },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        },
        doctor: {
          select: { id: true, name: true, specialty: true, email: true }
        }
      }
    });

    // Notificação automática (Observer)
    await sendEmail(appointment.doctor.email, 'Nova consulta agendada', `Você tem uma nova consulta com ${appointment.patient.name} em ${appointment.date}`);
    await sendEmail(appointment.patient.email, 'Consulta agendada', `Sua consulta com Dr(a). ${appointment.doctor.name} foi agendada para ${appointment.date}`);

    res.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment status
router.patch('/:id', auth(['DOCTOR']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const { role } = req.user;

    if (role !== 'DOCTOR') {
      return res.status(403).json({ error: 'Only doctors can update appointment status' });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status, notes },
      include: {
        patient: {
          select: { id: true, name: true, email: true }
        },
        doctor: {
          select: { id: true, name: true, specialty: true, email: true }
        }
      }
    });

    // Notificação automática (Observer)
    if (status === 'COMPLETED') {
      await sendEmail(appointment.patient.email, 'Consulta realizada', `Sua consulta com Dr(a). ${appointment.doctor.name} foi marcada como realizada.`);
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { select: { email: true, name: true } },
        doctor: { select: { email: true, name: true } }
      }
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (role === 'PATIENT' && appointment.patientId !== userId) {
      return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
    }

    await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });

    // Notificação automática (Observer)
    await sendEmail(appointment.doctor.email, 'Consulta cancelada', `A consulta com ${appointment.patient.name} foi cancelada.`);
    await sendEmail(appointment.patient.email, 'Consulta cancelada', `Sua consulta com Dr(a). ${appointment.doctor.name} foi cancelada.`);

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

module.exports = router; 