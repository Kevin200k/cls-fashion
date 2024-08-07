import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import logEvent from '../Middlewares/logOfEvents.js';

const router = express.Router();

const generateSignToken = (_id, email, role) => {
    const payload = {
      _id,
      email,
      role,
    };
    const exp = { expiresIn: process.env.LOGIN_EXP };
    const secretkey = process.env.JWT_SECRET;
    return jwt.sign(payload, secretkey, exp);
  };
  
  
  // Register a new user
  router.post('/users', async (req, res, next) => {
    const { _id, name, email, password } = req.body;
  
    try {
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        logEvent(`Registration attempt failed for ${email}: User already exists`);
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        _id,
        name,
        email,
        password,
      });
  
      if (user) {
        logEvent(`User registered successfully: ${user._id}`);
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          // token: generateSignToken(user._id),
          token: generateSignToken(user._id, user.email, user.role),
  
        });
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (err) {
        logEvent(`Error during registration for ${email}: ${err.message}`);
        next(err);
      }
  });

  // Login User 
  router.post('/users/login', async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).select('+password');
  
      // console.log('user', user)
      if (user && (await user.comparePassword(password))) {
        logEvent(`User logged in successfully: ${user._id}`);
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateSignToken(user._id, user.email, user.role),
  
        });
      } else {
        logEvent(`Login attempt failed for ${email}: Invalid email or password`);
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (err) {
        logEvent(`Error during login for ${email}: ${err.message}`);
        next(err);
      }
  });

  export default router