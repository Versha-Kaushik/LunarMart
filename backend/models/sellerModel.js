import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: ['male', 'female', 'other', 'prefer-not-to-say'],
        },
        businessName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        pincode: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        website: {
            type: String,
        },
        lastYearSales: {
            type: Number,
        },
        lastMonthSales: {
            type: Number,
        },
        message: {
            type: String,
        },
        sellerId: {
            type: String,
            unique: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

const Seller = mongoose.model('Seller', sellerSchema);

export default Seller;
