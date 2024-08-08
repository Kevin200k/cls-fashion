import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../Models/userModel.js';
import logEvent from '../Middlewares/logOfEvents.js';
import sendEmail from '../Utils/email.js';

const router = express.Router();

const generateSignToken = (_id, email, role) => {
  const payload = { _id, email, role };
  const exp = { expiresIn: process.env.LOGIN_EXP };
  const secretkey = process.env.JWT_SECRET;
  return jwt.sign(payload, secretkey, exp);
};

const sendEmailWithRetries = async (emailOptions, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sendEmail(emailOptions);
      return `Email verification mail has been sent to ${emailOptions.email}, please check your inbox.`;
    } catch (err) {
      console.log(`Attempt ${attempt} to send email failed.`);
      if (attempt === retries) {
        return 'Email verification mail failed after multiple attempts.';
      }
    }
  }
};

// Register a new user
router.post('/users', async (req, res, next) => {
  const { _id, name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      logEvent(`Registration attempt failed for ${email}: User already exists`);
      return res.status(400).json({ message: 'A user with this email already exists. Please try logging in.' });
    }

    // Create a new user
    const user = await User.create({ _id, name, email, password });

    const message = `
      <body>
        <p>Hi ${user.name},</p>
        <p>You have successfully registered your account. Please enter the code below to confirm your account.</p>
      </body>
    `;

    const emailOptions = {
      sender: 'CLS Fashion <addysupport@addysart.com>',
      email: user.email,
      subject: 'Registration Successful',
      message: message,
    };

    const emailVerificationMessage = await sendEmailWithRetries(emailOptions);

    // Log event based on email verification status
    logEvent(
      emailVerificationMessage.includes('failed')
        ? `Email not sent to ${user._id}.`
        : `Email successfully sent to ${user._id}.`
    );

    // Handle potential email verification failure
    if (emailVerificationMessage.includes('failed')) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: "Account creation failed due to email issues. Please try registering again." });
    }

    // If all goes well, respond with the user data and token
    res.status(201).json({
      message: 'Registration successful! A confirmation email has been sent to your inbox.',
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateSignToken(user._id, user.email, user.role),
    });

  } catch (err) {
    logEvent(`Error during registration for ${email}: ${err.message}`);
    res.status(500).json({ message: "An error occurred during registration. Please try again later." });
    next(err);
  }
});

// Login a user
router.post('/users/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user and select the password field explicitly
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      logEvent(`User logged in successfully: ${user._id}`);
      res.json({
        message: 'Login successful!',
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateSignToken(user._id, user.email, user.role),
      });
    } else {
      logEvent(`Login attempt failed for ${email}: Invalid email or password`);
      res.status(401).json({ message: 'Invalid email or password. Please try again.' });
    }
  } catch (err) {
    logEvent(`Error during login for ${email}: ${err.message}`);
    res.status(500).json({ message: "An error occurred during login. Please try again later." });
    next(err);
  }
});

export default router;
