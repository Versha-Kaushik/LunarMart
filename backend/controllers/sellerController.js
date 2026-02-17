import asyncHandler from 'express-async-handler';
import Seller from '../models/sellerModel.js';
import sendSellerIdEmail from '../utils/sendEmail.js';

const applyAsSeller = asyncHandler(async (req, res) => {
    const {
        name,
        dob,
        gender,
        businessName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        category,
        experience,
        website,
        lastYearSales,
        lastMonthSales,
        message,
    } = req.body;

    const sellerExists = await Seller.findOne({ email });

    if (sellerExists) {
        res.status(400);
        throw new Error('An application with this email already exists');
    }

    const sellerId = `SELLER${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const seller = await Seller.create({
        name,
        dob,
        gender,
        businessName,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        category,
        experience,
        website,
        lastYearSales,
        lastMonthSales,
        message,
        sellerId,
        status: 'pending',
    });

    if (seller) {
        await sendSellerIdEmail({
            name: seller.name,
            email: seller.email,
            businessName: seller.businessName,
            sellerId: seller.sellerId,
            phone: seller.phone,
            category: seller.category,
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully! Check your email for your Seller ID.',
            data: {
                businessName: seller.businessName,
                email: seller.email,
                status: seller.status,
                sellerId: seller.sellerId,
            },
        });
    } else {
        res.status(400);
        throw new Error('Invalid application data');
    }
});

const getSellerApplications = asyncHandler(async (req, res) => {
    const sellers = await Seller.find({}).sort({ createdAt: -1 });
    res.json(sellers);
});

const getSellerById = asyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.params.id);

    if (seller) {
        res.json(seller);
    } else {
        res.status(404);
        throw new Error('Seller application not found');
    }
});

const updateSellerStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const seller = await Seller.findById(req.params.id);

    if (seller) {
        seller.status = status || seller.status;
        const updatedSeller = await seller.save();

        res.json({
            success: true,
            message: `Seller application ${status}`,
            data: updatedSeller,
        });
    } else {
        res.status(404);
        throw new Error('Seller application not found');
    }
});

const deleteSellerApplication = asyncHandler(async (req, res) => {
    const seller = await Seller.findById(req.params.id);

    if (seller) {
        await Seller.deleteOne({ _id: seller._id });
        res.json({ message: 'Seller application removed' });
    } else {
        res.status(404);
        throw new Error('Seller application not found');
    }
});

export {
    applyAsSeller,
    getSellerApplications,
    getSellerById,
    updateSellerStatus,
    deleteSellerApplication,
};
