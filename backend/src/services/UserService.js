const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { validateEmail, validatePassword, sanitizeInput } = require('../utils/validation');

class UserService {
  // Create new user
  async createUser(userData) {
    const { email, password, name, role, specialty } = userData;

    // Validate input
    if (!validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (!validatePassword(password)) {
      throw new Error('Password must be at least 6 characters with uppercase, lowercase, and number');
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: sanitizeInput(email),
        password: hashedPassword,
        name: sanitizeInput(name),
        role,
        specialty: role === 'DOCTOR' ? sanitizeInput(specialty) : null
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        specialty: true,
        createdAt: true
      }
    });

    return user;
  }

  // Get user by ID
  async getUserById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        specialty: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Get user by email
  async getUserByEmail(email) {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    return user;
  }

  // Get all doctors
  async getDoctors(specialty = null) {
    const where = { role: 'DOCTOR' };

    if (specialty) {
      where.specialty = {
        contains: specialty,
        mode: 'insensitive'
      };
    }

    const doctors = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        specialty: true,
        email: true
      },
      orderBy: { name: 'asc' }
    });

    return doctors;
  }

  // Update user profile
  async updateUser(userId, updateData) {
    const { name, specialty } = updateData;

    const updateFields = {};

    if (name) {
      updateFields.name = sanitizeInput(name);
    }

    if (specialty) {
      updateFields.specialty = sanitizeInput(specialty);
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateFields,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        specialty: true,
        updatedAt: true
      }
    });

    return user;
  }

  // Change password
  async changePassword(userId, currentPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password
    if (!validatePassword(newPassword)) {
      throw new Error('New password must be at least 6 characters with uppercase, lowercase, and number');
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    return { message: 'Password updated successfully' };
  }

  // Verify password
  async verifyPassword(userId, password) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return await bcrypt.compare(password, user.password);
  }
}

module.exports = new UserService();
module.exports.updateUser = UserService.prototype.updateUser; 