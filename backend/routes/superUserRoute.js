import express from 'express';
import SuperUser from '../models/superUserModel.js';
import { getToken, isAuth } from '../util.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Check if superuser exists
router.get('/check', async (req, res) => {
  try {
    // Simple query to see if any superuser exists
    const superUsers = await SuperUser.find({ isActive: true });
    const result = { 
      exists: superUsers.length > 0,
      count: superUsers.length 
    };
    console.log('SuperUser check result:', result);
    res.json(result);
  } catch (error) {
    console.error('SuperUser check error:', error);
    res.status(500).json({ 
      message: 'Error checking superuser existence',
      error: error.message 
    });
  }
});

// Create first superuser (only if none exists)
router.post('/create', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if superuser already exists
    const existingSuperUser = await SuperUser.findOne({ isActive: true });
    if (existingSuperUser) {
      return res.status(403).json({
        message: 'Superuser already exists. Cannot create another one.'
      });
    }

    // Check if email is already taken by regular user
    const emailExists = await SuperUser.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create superuser
    const superUser = new SuperUser({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'superuser'
    });

    const savedSuperUser = await superUser.save();

    // Update last login
    savedSuperUser.lastLogin = new Date();
    await savedSuperUser.save();

    res.status(201).json({
      message: 'Superuser created successfully!',
      user: {
        _id: savedSuperUser._id,
        name: savedSuperUser.name,
        email: savedSuperUser.email,
        role: savedSuperUser.role,
        token: getToken(savedSuperUser)
      }
    });

  } catch (error) {
    console.error('Superuser creation error:', error);
    res.status(500).json({
      message: 'Failed to create superuser',
      error: error.message
    });
  }
});

// Superuser signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // Find superuser
    const superUser = await SuperUser.findOne({ 
      email: email.toLowerCase().trim(),
      isActive: true 
    });

    if (!superUser) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, superUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Update last login
    superUser.lastLogin = new Date();
    await superUser.save();

    res.json({
      _id: superUser._id,
      name: superUser.name,
      email: superUser.email,
      role: superUser.role,
      isSuperUser: true,
      isAdmin: true, // Superuser has admin privileges
      token: getToken(superUser)
    });

  } catch (error) {
    console.error('Superuser signin error:', error);
    res.status(500).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
});

// Get superuser profile (protected route)
router.get('/profile', isAuth, async (req, res) => {
  try {
    const superUser = await SuperUser.findById(req.user._id).select('-password');
    if (!superUser || !superUser.isActive) {
      return res.status(404).json({
        message: 'Superuser not found'
      });
    }

    res.json({
      _id: superUser._id,
      name: superUser.name,
      email: superUser.email,
      role: superUser.role,
      lastLogin: superUser.lastLogin,
      createdAt: superUser.createdAt
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update superuser profile
router.put('/profile', isAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const superUser = await SuperUser.findById(req.user._id);

    if (!superUser || !superUser.isActive) {
      return res.status(404).json({
        message: 'Superuser not found'
      });
    }

    // Update fields
    if (name) superUser.name = name.trim();
    if (email) {
      // Check if new email is taken
      const emailExists = await SuperUser.findOne({ 
        email: email.toLowerCase().trim(),
        _id: { $ne: superUser._id }
      });
      if (emailExists) {
        return res.status(400).json({
          message: 'Email already exists'
        });
      }
      superUser.email = email.toLowerCase().trim();
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters long'
        });
      }
      superUser.password = await bcrypt.hash(password, 12);
    }

    await superUser.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: superUser._id,
        name: superUser.name,
        email: superUser.email,
        role: superUser.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Failed to update profile',
      error: error.message
    });

  }
});

export default router;
