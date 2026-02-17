import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            required: false,
        },
        profileImage: {
            type: String,
            required: false,
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false,
        },
        isSeller: {
            type: Boolean,
            default: false,
        },
        sellerId: {
            type: String,
            default: null,
            trim: true,
        },
        address: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: false,
        },
        postalCode: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
