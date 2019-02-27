import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: {
    required: true,
    type: String,
    maxlength: 255
  },
  lastname: {
    required: true,
    type: String,
    maxlength: 255
  },
  email: {
    required: true,
    type: String,
    maxlength: 255,
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: 'REGULAR'
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);

export default User;