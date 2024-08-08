import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
})

otpSchema.pre('save', async function(next) {
    if (!this.isModified('otp')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.otp = await bcrypt.hash(this.otp, salt);
        next();
    } catch (err) {
        next(err);
    }
});



otpSchema.methods.compareotp = async function(candidateotp) {
    return bcrypt.compare(candidateotp, this.otp);
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP