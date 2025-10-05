import express from 'express';
import User from '../models/userModel.js';
import SuperUser from '../models/superUserModel.js';
import { getToken, isAuth } from '../util.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // First check if superuser exists and this is superuser login
    const superUserExists = await SuperUser.countDocuments({ isActive: true }) > 0;
    
    if (superUserExists) {
      // Try superuser authentication first
      const superUser = await SuperUser.findOne({
        email: email.toLowerCase().trim(),
        isActive: true
      });

      if (superUser && await bcrypt.compare(password, superUser.password)) {
        // Update last login
        superUser.lastLogin = new Date();
        await superUser.save();

        return res.send({
          _id: superUser._id,
          name: superUser.name,
          email: superUser.email,
          isAdmin: true,
          isSuperUser: true,
          role: 'superuser',
          token: getToken(superUser),
        });
      }
    }

    // If not superuser or superuser doesn't exist, check regular users
    const signinUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (signinUser && await bcrypt.compare(password, signinUser.password)) {
      // Allow admin users to have admin privileges regardless of superuser existence
      const isAdmin = signinUser.isAdmin;
      
      res.send({
        _id: signinUser._id,
        name: signinUser.name,
        email: signinUser.email,
        isAdmin: isAdmin,
        isSuperUser: false,
        role: isAdmin ? 'admin' : 'user',
        token: getToken(signinUser),
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid Email or Password.' 
      });
    }

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      message: 'Authentication failed',
      error: error.message
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    const newUser = await user.save();
    if (newUser) {
      res.send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        token: getToken(newUser),
      });
    } else {
      res.status(401).send({ message: 'Invalid User Data.' });
    }
  } catch (error) {
    res.status(500).send({ message: 'Registration failed: ' + error.message });
  }
});

router.get('/createadmin', async (req, res) => {
  try {
    const user = new User({
      name: 'Basir',
      email: 'admin@example.com',
      password: '1234',
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
