import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 600 } // OTP expires after 10 minutes (600 seconds)
});

// Method to encrypt the OTP after it has been generated
otpSchema.methods.encryptOtp = async function() {
    if (!this.otp) throw new Error('No OTP to encrypt');

    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        await this.save(); // Save the encrypted OTP
    } catch (err) {
        console.error('Error hashing OTP:', err);
        throw err;
    }
};

// Method to compare a candidate OTP with the stored hashed OTP
otpSchema.methods.compareOtp = async function(candidateOtp) {
    try {
        return await bcrypt.compare(candidateOtp, this.otp);
    } catch (err) {
        console.error('Error comparing OTP:', err);
        return false;
    }
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
