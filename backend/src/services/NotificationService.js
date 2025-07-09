// Observer pattern implementation for notifications
class NotificationService {
  constructor() {
    this.observers = [];
  }

  // Add observer
  addObserver(observer) {
    this.observers.push(observer);
  }

  // Remove observer
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  // Notify all observers
  async notify(event, data) {
    const promises = this.observers.map(observer => {
      if (observer[event] && typeof observer[event] === 'function') {
        return observer[event](data);
      }
      return Promise.resolve();
    });

    await Promise.allSettled(promises);
  }

  // Notify appointment created
  async notifyAppointmentCreated(appointment) {
    console.log(`📅 Appointment created: ${appointment.patient.name} with Dr. ${appointment.doctor.name} on ${appointment.date}`);

    // Send email notifications
    await this.sendEmailNotification(
      appointment.patient.email,
      'Appointment Confirmed',
      `Your appointment with Dr. ${appointment.doctor.name} has been confirmed for ${appointment.date.toLocaleString()}`
    );

    await this.sendEmailNotification(
      appointment.doctor.email,
      'New Appointment Scheduled',
      `You have a new appointment with ${appointment.patient.name} on ${appointment.date.toLocaleString()}`
    );

    // Notify observers
    await this.notify('appointmentCreated', appointment);
  }

  // Notify appointment cancelled
  async notifyAppointmentCancelled(appointment) {
    console.log(`❌ Appointment cancelled: ${appointment.patient.name} with Dr. ${appointment.doctor.name}`);

    // Send email notifications
    await this.sendEmailNotification(
      appointment.patient.email,
      'Appointment Cancelled',
      `Your appointment with Dr. ${appointment.doctor.name} has been cancelled`
    );

    await this.sendEmailNotification(
      appointment.doctor.email,
      'Appointment Cancelled',
      `Your appointment with ${appointment.patient.name} has been cancelled`
    );

    // Notify observers
    await this.notify('appointmentCancelled', appointment);
  }

  // Notify appointment completed
  async notifyAppointmentCompleted(appointment) {
    console.log(`✅ Appointment completed: ${appointment.patient.name} with Dr. ${appointment.doctor.name}`);

    // Send email notifications
    await this.sendEmailNotification(
      appointment.patient.email,
      'Appointment Completed',
      `Your appointment with Dr. ${appointment.doctor.name} has been marked as completed`
    );

    await this.sendEmailNotification(
      appointment.doctor.email,
      'Appointment Completed',
      `Your appointment with ${appointment.patient.name} has been marked as completed`
    );

    // Notify observers
    await this.notify('appointmentCompleted', appointment);
  }

  // Send email notification (mock implementation)
  async sendEmailNotification(to, subject, message) {
    // In a real implementation, this would use a service like SendGrid, AWS SES, etc.
    console.log(`📧 Email to ${to}: ${subject} - ${message}`);

    // For now, we'll just log the email
    // In production, you would integrate with an email service
    if (process.env.SMTP_HOST) {
      // Real email implementation would go here
      console.log(`Would send email via SMTP to ${to}`);
    }
  }

  // Send SMS notification (mock implementation)
  async sendSMSNotification(to, message) {
    // In a real implementation, this would use a service like Twilio
    console.log(`📱 SMS to ${to}: ${message}`);
  }
}

// Create singleton instance
const notificationService = new NotificationService();

// Add default observers
notificationService.addObserver({
  appointmentCreated: async (appointment) => {
    console.log(`Observer: Appointment created event processed for ${appointment.id}`);
  },
  appointmentCancelled: async (appointment) => {
    console.log(`Observer: Appointment cancelled event processed for ${appointment.id}`);
  },
  appointmentCompleted: async (appointment) => {
    console.log(`Observer: Appointment completed event processed for ${appointment.id}`);
  }
});

module.exports = notificationService; 