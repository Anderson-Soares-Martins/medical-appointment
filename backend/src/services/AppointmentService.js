const { prisma } = require('../config/database');
const { validateAppointmentDate, validateTimeSlot, sanitizeInput } = require('../utils/validation');
const NotificationService = require('./NotificationService');

class AppointmentService {
  // Create new appointment
  async createAppointment(appointmentData) {
    const { patientId, doctorId, date, notes } = appointmentData;

    // Validate date
    const dateValidation = validateAppointmentDate(date);
    if (!dateValidation.valid) {
      throw new Error(dateValidation.message);
    }

    // Validate time slot
    const timeValidation = validateTimeSlot(date);
    if (!timeValidation.valid) {
      throw new Error(timeValidation.message);
    }

    // Check if doctor exists
    const doctor = await prisma.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' }
    });

    if (!doctor) {
      throw new Error('Doctor not found');
    }

    // Check if patient exists
    const patient = await prisma.user.findUnique({
      where: { id: patientId, role: 'PATIENT' }
    });

    if (!patient) {
      throw new Error('Patient not found');
    }

    // Check if time slot is available
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          in: ['SCHEDULED']
        }
      }
    });

    if (existingAppointment) {
      throw new Error('This time slot is already booked');
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        notes: notes ? sanitizeInput(notes) : null,
        status: 'SCHEDULED'
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialty: true
          }
        }
      }
    });

    // Send notifications
    await NotificationService.notifyAppointmentCreated(appointment);

    return appointment;
  }

  // Get appointment by ID
  async getAppointmentById(appointmentId, userId, userRole) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            specialty: true
          }
        }
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Check if user has permission to view this appointment
    if (userRole === 'PATIENT' && appointment.patientId !== userId) {
      throw new Error('Access denied');
    }

    if (userRole === 'DOCTOR' && appointment.doctorId !== userId) {
      throw new Error('Access denied');
    }

    return appointment;
  }

  // Get user's appointments
  async getUserAppointments(userId, userRole, filters = {}) {
    const { status, startDate, endDate, page = 1, limit = 10 } = filters;

    const where = {};

    if (userRole === 'PATIENT') {
      where.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      where.doctorId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
              specialty: true
            }
          }
        },
        orderBy: { date: 'asc' },
        skip,
        take: limit
      }),
      prisma.appointment.count({ where })
    ]);

    return {
      appointments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get doctor's available time slots
  async getAvailableTimeSlots(doctorId, date) {
    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(8, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(18, 0, 0, 0);

    // Get booked appointments for this doctor on this date
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: startOfDay,
          lt: endOfDay
        },
        status: 'SCHEDULED'
      },
      select: { date: true }
    });

    const bookedTimes = bookedAppointments.map(apt => apt.date.getTime());

    // Generate all possible time slots
    const timeSlots = [];
    const currentTime = new Date(startOfDay);

    while (currentTime < endOfDay) {
      const timeSlot = new Date(currentTime);
      if (!bookedTimes.includes(timeSlot.getTime())) {
        timeSlots.push(timeSlot);
      }
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return timeSlots;
  }

  // Cancel appointment
  async cancelAppointment(appointmentId, userId, userRole, reason) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Check permissions
    if (userRole === 'PATIENT' && appointment.patientId !== userId) {
      throw new Error('Access denied');
    }

    if (userRole === 'DOCTOR' && appointment.doctorId !== userId) {
      throw new Error('Access denied');
    }

    // Check if appointment can be cancelled
    if (appointment.status !== 'SCHEDULED') {
      throw new Error('Only scheduled appointments can be cancelled');
    }

    // Check if appointment is in the future
    if (new Date() >= appointment.date) {
      throw new Error('Cannot cancel appointments that have already started');
    }

    // Update appointment status
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CANCELLED',
        notes: reason ? `${appointment.notes || ''}\n\nCancelled: ${sanitizeInput(reason)}`.trim() : appointment.notes
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send cancellation notification
    await NotificationService.notifyAppointmentCancelled(updatedAppointment);

    return updatedAppointment;
  }

  // Complete appointment
  async completeAppointment(appointmentId, doctorId, notes) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    // Check if doctor owns this appointment
    if (appointment.doctorId !== doctorId) {
      throw new Error('Access denied');
    }

    // Check if appointment is scheduled
    if (appointment.status !== 'SCHEDULED') {
      throw new Error('Only scheduled appointments can be completed');
    }

    // Update appointment
    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'COMPLETED',
        notes: notes ? `${appointment.notes || ''}\n\nCompleted: ${sanitizeInput(notes)}`.trim() : appointment.notes
      },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Send completion notification
    await NotificationService.notifyAppointmentCompleted(updatedAppointment);

    return updatedAppointment;
  }

  // Get appointments statistics
  async getAppointmentStats(userId, userRole) {
    const where = {};

    if (userRole === 'PATIENT') {
      where.patientId = userId;
    } else if (userRole === 'DOCTOR') {
      where.doctorId = userId;
    }

    const [total, scheduled, completed, cancelled] = await Promise.all([
      prisma.appointment.count({ where }),
      prisma.appointment.count({ where: { ...where, status: 'SCHEDULED' } }),
      prisma.appointment.count({ where: { ...where, status: 'COMPLETED' } }),
      prisma.appointment.count({ where: { ...where, status: 'CANCELLED' } })
    ]);

    return {
      total,
      scheduled,
      completed,
      cancelled
    };
  }

  // Atualização RESTful de consulta
  async updateAppointmentREST(appointmentId, userId, userRole, { status, notes }) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        doctor: true
      }
    });
    if (!appointment) throw new Error('Appointment not found');
    if (userRole === 'PATIENT' && appointment.patientId !== userId) throw new Error('Access denied');
    if (userRole === 'DOCTOR' && appointment.doctorId !== userId) throw new Error('Access denied');
    const data = {};
    if (status) data.status = status;
    if (notes !== undefined) data.notes = notes;
    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true } }
      }
    });
    return updated;
  }

  // Cancelamento RESTful de consulta
  async deleteAppointmentREST(appointmentId, userId, userRole) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error('Appointment not found');
    if (userRole === 'PATIENT' && appointment.patientId !== userId) throw new Error('Access denied');
    if (userRole === 'DOCTOR' && appointment.doctorId !== userId) throw new Error('Access denied');
    if (appointment.status !== 'SCHEDULED') throw new Error('Only scheduled appointments can be deleted');
    await prisma.appointment.update({ where: { id: appointmentId }, data: { status: 'CANCELLED' } });
    return;
  }
}

module.exports = new AppointmentService(); 