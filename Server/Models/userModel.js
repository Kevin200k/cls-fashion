import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: [true, 'Please enter email'], lowercase: true, trim: true },
    role: { type: String, required: true, default: 'user' },
    createdAt: { type: Date, default: Date.now, immutable: true, required: true },
    password: { type: String, required: [true, 'Please enter password'], minlength: [8, 'password must be at least 8 character'], select: false},
    isVerified: { type: Boolean, required: true, default: false }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});



userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('User', userSchema);

export default User;
