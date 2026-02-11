const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Send token response with httpOnly cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict' // CSRF protection
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token, // Also send in response for backward compatibility
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, password, role, company } = req.body;

    // Check if mongoose connection is ready
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database unavailable - provide demo user registration for testing
      console.log('🔄 Database unavailable, creating demo user registration...');
      
      // Basic validation for demo signup
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name, email, and password'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }

      // Check if demo email already "exists"
      const demoEmails = [
        'admin@demo.com',
        'dev@demo.com', 
        'user@demo.com'
      ];

      if (demoEmails.includes(email)) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email. Please use a different email or try the demo login.'
        });
      }

      // Create demo user registration
      const demoUser = {
        id: `demo-new-${Date.now()}`,
        name,
        email,
        role: role || 'user',
        company: company || 'Demo Company'
      };

      // Generate demo token
      const token = generateToken(demoUser.id);
      
      console.log(`✅ Demo user registered: ${email}`);
      
      return res.status(201).json({
        success: true,
        token,
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          company: demoUser.company
        }
      });
    }

    // Normal database registration
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      company
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if mongoose connection is ready
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database unavailable - provide demo users for testing
      console.log('🔄 Database unavailable, using demo authentication...');
      
      const demoUsers = {
        'admin@demo.com': {
          id: 'demo-admin-123',
          name: 'Admin Demo User',
          email: 'admin@demo.com',
          role: 'admin',
          company: 'Demo Company'
        },
        'dev@demo.com': {
          id: 'demo-dev-456',
          name: 'Developer Demo User', 
          email: 'dev@demo.com',
          role: 'developer',
          company: 'Demo Company'
        },
        'user@demo.com': {
          id: 'demo-user-789',
          name: 'Regular Demo User',
          email: 'user@demo.com', 
          role: 'user',
          company: 'Demo Company'
        }
      };

      const user = demoUsers[email];
      if (user && password === 'password123') {
        // Generate demo token
        const token = generateToken(user.id);
        
        return res.status(200).json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company
          }
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid demo credentials. Use admin@demo.com, dev@demo.com, or user@demo.com with password: password123'
        });
      }
    }

    // Normal database authentication
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.'
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    // Check if mongoose connection is ready
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      // Database unavailable - return demo user based on token
      console.log('🔄 Database unavailable, returning demo user...');
      
      const demoUsers = {
        'demo-admin-123': {
          id: 'demo-admin-123',
          name: 'Admin Demo User',
          email: 'admin@demo.com',
          role: 'admin',
          company: 'Demo Company'
        },
        'demo-dev-456': {
          id: 'demo-dev-456',
          name: 'Developer Demo User',
          email: 'dev@demo.com',
          role: 'developer',
          company: 'Demo Company'
        },
        'demo-user-789': {
          id: 'demo-user-789',
          name: 'Regular Demo User',
          email: 'user@demo.com',
          role: 'user',
          company: 'Demo Company'
        }
      };

      let user = demoUsers[req.user.id];
      
      // Handle newly registered demo users
      if (!user && req.user.id.startsWith('demo-new-')) {
        user = {
          id: req.user.id,
          name: 'New Demo User',
          email: 'newuser@demo.com',
          role: 'user',
          company: 'Demo Company'
        };
      }

      if (user) {
        return res.status(200).json({
          success: true,
          user
        });
      } else {
        return res.status(404).json({
          success: false,
          message: 'Demo user not found'
        });
      }
    }

    // Normal database operation
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};
