import express from 'express';
import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { getToken, isAuth, isAdmin } from '../util.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create default admin user
router.post('/createadmin', async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      return res.send({ message: 'Admin user already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    const user = new User({
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      isAdmin: true,
    });
    
    const newUser = await user.save();
    res.send({
      message: 'Default admin user created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).send({ message: 'Admin creation failed: ' + error.message });
  }
});

// Get all users for admin management
router.get('/users', isAuth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch users: ' + error.message });
  }
});

// Create new user by admin
router.post('/users', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'User already exists with this email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false
    });
    
    const newUser = await user.save();
    res.status(201).send({
      message: 'User created successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).send({ message: 'User creation failed: ' + error.message });
  }
});

// Update user by admin
router.put('/users/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
    
    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    
    const updatedUser = await user.save();
    res.send({
      message: 'User updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).send({ message: 'User update failed: ' + error.message });
  }
});

// Toggle admin status
router.put('/users/:id/toggle-admin', isAuth, isAdmin, async (req, res) => {
  try {
    const { isAdmin } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    user.isAdmin = isAdmin;
    const updatedUser = await user.save();
    
    res.send({
      message: 'User admin status updated',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin
      }
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to update admin status: ' + error.message });
  }
});

// Delete user by admin
router.delete('/users/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id) {
      return res.status(400).send({ message: 'Cannot delete your own account' });
    }

    await user.remove();
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ message: 'User deletion failed: ' + error.message });
  }
});

// Get dashboard statistics
router.get('/stats', isAuth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({ countInStock: { $lt: 10 } });

    res.send({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders,
      lowStockProducts: lowStockProducts.length
    });
  } catch (error) {
    res.status(500).send({ message: 'Failed to fetch stats: ' + error.message });
  }
});

export default router;
