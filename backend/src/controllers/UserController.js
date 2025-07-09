const UserService = require('../services/UserService');

class UserController {
  // Get all doctors
  async getDoctors(req, res) {
    try {
      const { specialty } = req.query;

      const doctors = await UserService.getDoctors(specialty);

      res.json({
        doctors,
        count: doctors.length
      });

    } catch (error) {
      console.error('Get doctors error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Get doctor by ID
  async getDoctorById(req, res) {
    try {
      const { doctorId } = req.params;

      const doctor = await UserService.getUserById(doctorId);

      if (doctor.role !== 'DOCTOR') {
        return res.status(404).json({
          error: 'Doctor not found'
        });
      }

      res.json({
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          specialty: doctor.specialty
        }
      });

    } catch (error) {
      console.error('Get doctor error:', error);
      res.status(404).json({
        error: 'Doctor not found'
      });
    }
  }

  // Get user statistics
  async getUserStats(req, res) {
    try {
      // This would typically include appointment statistics
      // For now, we'll return basic user info
      const user = await UserService.getUserById(req.user.id);

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          specialty: user.specialty,
          createdAt: user.createdAt
        }
      });

    } catch (error) {
      console.error('Get user stats error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Search doctors by specialty
  async searchDoctors(req, res) {
    try {
      const { specialty, name } = req.query;

      let searchSpecialty = specialty;
      if (name) {
        // If name is provided, we'll search by name instead of specialty
        searchSpecialty = null;
      }

      const doctors = await UserService.getDoctors(searchSpecialty);

      // Filter by name if provided
      let filteredDoctors = doctors;
      if (name) {
        filteredDoctors = doctors.filter(doctor =>
          doctor.name.toLowerCase().includes(name.toLowerCase())
        );
      }

      res.json({
        doctors: filteredDoctors,
        count: filteredDoctors.length
      });

    } catch (error) {
      console.error('Search doctors error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Get available time slots for a doctor
  async getDoctorAvailability(req, res) {
    try {
      const { doctorId } = req.params;
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({
          error: 'Date parameter is required'
        });
      }

      // Verify doctor exists
      const doctor = await UserService.getUserById(doctorId);
      if (doctor.role !== 'DOCTOR') {
        return res.status(404).json({
          error: 'Doctor not found'
        });
      }

      // Get available time slots
      const AppointmentService = require('../services/AppointmentService');
      const availableSlots = await AppointmentService.getAvailableTimeSlots(doctorId, date);

      res.json({
        doctor: {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty
        },
        date,
        availableSlots: availableSlots.map(slot => slot.toISOString()),
        count: availableSlots.length
      });

    } catch (error) {
      console.error('Get doctor availability error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // PATCH /users/profile
  async updateProfile(req, res) {
    try {
      const { name, specialty } = req.body;
      const user = await require('../services/UserService').updateUser(req.user.id, { name, specialty });
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        specialty: user.specialty,
        updatedAt: user.updatedAt
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UserController(); 