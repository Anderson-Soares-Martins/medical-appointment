const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes (for getting doctors)
router.get('/doctors', UserController.getDoctors);
router.get('/doctors/search', UserController.searchDoctors);
router.get('/doctors/:doctorId', UserController.getDoctorById);
router.get('/doctors/:doctorId/availability', UserController.getDoctorAvailability);

// Protected routes
router.get('/stats', authenticateToken, UserController.getUserStats);
router.patch('/profile', authenticateToken, UserController.updateProfile); // Atualização RESTful de perfil

module.exports = router; 