const AppointmentService = require('../services/AppointmentService');

class AppointmentController {
  // Create new appointment
  async createAppointment(req, res) {
    try {
      const { doctorId, date, notes } = req.body;
      const patientId = req.user.id;

      // Validate required fields
      if (!doctorId || !date) {
        return res.status(400).json({
          error: 'Doctor ID and date are required'
        });
      }

      // Create appointment
      const appointment = await AppointmentService.createAppointment({
        patientId,
        doctorId,
        date,
        notes
      });

      res.status(201).json({
        message: 'Appointment created successfully',
        appointment
      });

    } catch (error) {
      console.error('Create appointment error:', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Get appointment by ID
  async getAppointmentById(req, res) {
    try {
      const { appointmentId } = req.params;

      const appointment = await AppointmentService.getAppointmentById(
        appointmentId,
        req.user.id,
        req.user.role
      );

      res.json({
        appointment
      });

    } catch (error) {
      console.error('Get appointment error:', error);
      res.status(404).json({
        error: error.message
      });
    }
  }

  // Get user's appointments
  async getUserAppointments(req, res) {
    try {
      const { status, startDate, endDate, page, limit } = req.query;

      const filters = {
        status,
        startDate,
        endDate,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };

      const result = await AppointmentService.getUserAppointments(
        req.user.id,
        req.user.role,
        filters
      );

      res.json(result);

    } catch (error) {
      console.error('Get user appointments error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Cancel appointment
  async cancelAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const { reason } = req.body;

      const appointment = await AppointmentService.cancelAppointment(
        appointmentId,
        req.user.id,
        req.user.role,
        reason
      );

      res.json({
        message: 'Appointment cancelled successfully',
        appointment
      });

    } catch (error) {
      console.error('Cancel appointment error:', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Complete appointment (doctor only)
  async completeAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const { notes } = req.body;

      const appointment = await AppointmentService.completeAppointment(
        appointmentId,
        req.user.id,
        notes
      );

      res.json({
        message: 'Appointment completed successfully',
        appointment
      });

    } catch (error) {
      console.error('Complete appointment error:', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Get appointment statistics
  async getAppointmentStats(req, res) {
    try {
      const stats = await AppointmentService.getAppointmentStats(
        req.user.id,
        req.user.role
      );

      res.json({
        stats
      });

    } catch (error) {
      console.error('Get appointment stats error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Get doctor's appointments for today
  async getTodayAppointments(req, res) {
    try {
      if (req.user.role !== 'DOCTOR') {
        return res.status(403).json({
          error: 'Only doctors can access today\'s appointments'
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const filters = {
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
        status: 'SCHEDULED'
      };

      const result = await AppointmentService.getUserAppointments(
        req.user.id,
        req.user.role,
        filters
      );

      res.json({
        appointments: result.appointments,
        count: result.appointments.length
      });

    } catch (error) {
      console.error('Get today appointments error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Get upcoming appointments
  async getUpcomingAppointments(req, res) {
    try {
      const now = new Date();

      const filters = {
        startDate: now.toISOString(),
        status: 'SCHEDULED'
      };

      const result = await AppointmentService.getUserAppointments(
        req.user.id,
        req.user.role,
        filters
      );

      res.json({
        appointments: result.appointments,
        count: result.appointments.length
      });

    } catch (error) {
      console.error('Get upcoming appointments error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Get appointment history
  async getAppointmentHistory(req, res) {
    try {
      const { page, limit } = req.query;

      const filters = {
        status: 'COMPLETED',
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 10
      };

      const result = await AppointmentService.getUserAppointments(
        req.user.id,
        req.user.role,
        filters
      );

      res.json(result);

    } catch (error) {
      console.error('Get appointment history error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // PATCH /appointments/:appointmentId
  async updateAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Atualiza status/notas (apenas se for paciente ou médico da consulta)
      const updated = await AppointmentService.updateAppointmentREST(
        appointmentId, userId, userRole, { status, notes }
      );
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // DELETE /appointments/:appointmentId
  async deleteAppointment(req, res) {
    try {
      const { appointmentId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
      await AppointmentService.deleteAppointmentREST(
        appointmentId, userId, userRole
      );
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AppointmentController(); 