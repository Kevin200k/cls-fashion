import express from 'express';
import User from '../Models/userModel.js';
import OTP from '../Models/otpModel.js';
import sendEmail from '../Utils/email.js';
import protect from '../Middlewares/authMiddleware.js'
import logEvent from '../Middlewares/logOfEvents.js'

const router = express.Router();

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// router.post('/send-otp/:email', protect, async (req, res, next) => {
router.post('/send-otp/:email', async (req, res, next) => {
    const { email } = req.params;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            logEvent(`${email} does not exit`)
            return res.status(401).json({ message: "User does not exist" });
        }

        const generatedCode = generateOTP();

        // Create or update the OTP in the database
        const otpRecord = await OTP.findOneAndUpdate(
            { email: email },
            { otp: generatedCode, createdAt: new Date() },
            { upsert: true, new: true }
        );

        // Send the email with the OTP code
        const message = `
        <body>
          <p>Hi ${user.name},</p>
          <p>Please enter the code below to confirm your account.</p>
          <h3>${generatedCode}</h3>
          <p>This code expires in ten minutes</p>
        </body>
        `;

        const emailOptions = {
            sender: 'CLS Fashion <addysupport@addysart.com>',
            email: user.email,
            subject: 'Confirm Your Account',
            message: message,
        };

        await sendEmail(emailOptions);

        // Encrypt the OTP after it has been sent
        await otpRecord.encryptOtp();
        logEvent(`OTP has been sent to ${user._id}`)
        res.status(200).json({ message: "OTP has been sent to your email address." });

    } catch (err) {
        logEvent(`OTP could not be sent to ${user._id}`)
        res.status(500).json({ message: "An error occurred while sending the OTP. Please try again later." });
        next(err);
    }
});


// router.post('/verify-otp/:email/:otp', protect, async (req, res, next) => {
router.post('/verify-otp/:email/:otp', async (req, res, next) => {
    const { email, otp } = req.params;

    try {
        const otpRecord = await OTP.findOne({ email: email });

        if (!otpRecord) {
            return res.status(401).json({ message: "OTP is invalid or has expired." });
        }

        const isMatch = await otpRecord.compareOtp(otp);

        if (!isMatch) {
            return res.status(401).json({ message: "OTP is incorrect." });
        }

        await OTP.findOneAndDelete({ email: email });
        await User.findOneAndUpdate({ email: email }, { isVerified: true });

        logEvent(`${email} has been verified`)
        res.status(200).json({ message: "Your account has been verified successfully." });

    } catch (err) {
        console.error('Error during OTP verification:', err);
        res.status(500).json({ message: "An error occurred during verification. Please try again later." });
        next(err);
    }
});

export default router;
