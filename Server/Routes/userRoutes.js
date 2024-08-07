import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';

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
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const user = await User.create({
        _id,
        name,
        email,
        password,
      });
  
      if (user) {
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
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateSignToken(user._id, user.email, user.role),
  
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (err) {
        next(err);
      }
  });

  export default router