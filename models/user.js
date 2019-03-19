import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const Schema = mongoose.Schema;

// Define the user schema for creating the model
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
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255
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

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({
    userId: this._id,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    role: this.role,
    isAdmin: this.isAdmin
  }, jwtSecretKey);
};

//Create the model
const User = mongoose.model('User', userSchema);

//Export the user model
export default User;