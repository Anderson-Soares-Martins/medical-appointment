const express = require('express');
const { PrismaClient } = require('@prisma/client');
const auth = require('../middleware/auth');

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
          select: { id: true, name: true, specialty: true }
        }
      },
      orderBy: { date: 'asc' }
    });

    res.json(appointments);
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
          select: { id: true, name: true, specialty: true }
        }
      }
    });

    res.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment status
router.patch('/:id', auth, async (req, res) => {
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
          select: { id: true, name: true, specialty: true }
        }
      }
    });

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
      where: { id }
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

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

module.exports = router; 