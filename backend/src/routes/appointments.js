const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Appointment CRUD
router.post('/', AppointmentController.createAppointment);
router.get('/', AppointmentController.getUserAppointments);
router.get('/stats', AppointmentController.getAppointmentStats);
router.get('/today', AppointmentController.getTodayAppointments);
router.get('/upcoming', AppointmentController.getUpcomingAppointments);
router.get('/history', AppointmentController.getAppointmentHistory);
router.get('/:appointmentId', AppointmentController.getAppointmentById);

// Appointment actions
router.put('/:appointmentId/cancel', AppointmentController.cancelAppointment);
router.put('/:appointmentId/complete', authorizeRole(['DOCTOR']), AppointmentController.completeAppointment);
router.patch('/:appointmentId', AppointmentController.updateAppointment); // Atualização RESTful
router.delete('/:appointmentId', AppointmentController.deleteAppointment); // Cancelamento RESTful

module.exports = router; 