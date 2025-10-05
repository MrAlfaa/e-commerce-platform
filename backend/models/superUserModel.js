import mongoose from 'mongoose';

const superUserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: {
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    index: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    default: 'superuser',
    enum: ['superuser']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: String,
    default: 'system'
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for quick lookups
superUserSchema.index({ email: 1 });
superUserSchema.index({ isActive: 1 });

// Check if model already exists to avoid recompilation errors
const SuperUser = mongoose.models.SuperUser || mongoose.model('SuperUser', superUserSchema);

export default SuperUser;
