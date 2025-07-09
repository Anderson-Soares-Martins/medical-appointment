const bcrypt = require('bcryptjs');
const UserService = require('../services/UserService');
const { generateToken, generateRefreshToken } = require('../middleware/auth');

class AuthController {
  // Register new user
  async register(req, res) {
    try {
      const { email, password, name, role, specialty } = req.body;

      // Validate required fields
      if (!email || !password || !name || !role) {
        return res.status(400).json({
          error: 'Missing required fields: email, password, name, role'
        });
      }

      // Create user
      const user = await UserService.createUser({
        email,
        password,
        name,
        role,
        specialty
      });

      // Generate tokens
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          specialty: user.specialty
        },
        token,
        refreshToken
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Get user by email
      const user = await UserService.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      // Generate tokens
      const token = generateToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          specialty: user.specialty
        },
        token,
        refreshToken
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Refresh token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Get user
      const user = await UserService.getUserById(decoded.userId);

      // Generate new tokens
      const newToken = generateToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);

      res.json({
        message: 'Token refreshed successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          specialty: user.specialty
        },
        token: newToken,
        refreshToken: newRefreshToken
      });

    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(401).json({
        error: 'Invalid refresh token'
      });
    }
  }

  // Get current user profile
  async getProfile(req, res) {
    try {
      const user = await UserService.getUserById(req.user.id);

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          specialty: user.specialty,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    try {
      const { name, specialty } = req.body;

      const user = await UserService.updateUser(req.user.id, {
        name,
        specialty
      });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          specialty: user.specialty,
          updatedAt: user.updatedAt
        }
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Change password
  async changePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          error: 'Current password and new password are required'
        });
      }

      await UserService.changePassword(req.user.id, currentPassword, newPassword);

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(400).json({
        error: error.message
      });
    }
  }

  // Logout (client-side token removal)
  async logout(req, res) {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return a success message
      res.json({
        message: 'Logout successful'
      });

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}

module.exports = new AuthController(); 