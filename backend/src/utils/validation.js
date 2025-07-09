// Validation utilities for request data

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateAppointmentDate = (date) => {
  const appointmentDate = new Date(date);
  const now = new Date();

  // Appointment must be in the future
  if (appointmentDate <= now) {
    return { valid: false, message: 'Appointment date must be in the future' };
  }

  // Appointment must be within 6 months
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

  if (appointmentDate > sixMonthsFromNow) {
    return { valid: false, message: 'Appointment cannot be scheduled more than 6 months in advance' };
  }

  // Check if it's a working day (Monday to Friday)
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return { valid: false, message: 'Appointments are only available on weekdays' };
  }

  // Check if it's within working hours (8 AM to 6 PM)
  const hour = appointmentDate.getHours();
  if (hour < 8 || hour >= 18) {
    return { valid: false, message: 'Appointments are only available between 8 AM and 6 PM' };
  }

  return { valid: true };
};

const validateTimeSlot = (date) => {
  const appointmentDate = new Date(date);
  const minutes = appointmentDate.getMinutes();

  // Appointments must be on the hour or half hour
  if (minutes !== 0 && minutes !== 30) {
    return { valid: false, message: 'Appointments must be scheduled on the hour or half hour' };
  }

  return { valid: true };
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const validateUserRole = (role) => {
  const validRoles = ['PATIENT', 'DOCTOR'];
  return validRoles.includes(role);
};

const validateAppointmentStatus = (status) => {
  const validStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
  return validStatuses.includes(status);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateAppointmentDate,
  validateTimeSlot,
  sanitizeInput,
  validateUserRole,
  validateAppointmentStatus
}; 