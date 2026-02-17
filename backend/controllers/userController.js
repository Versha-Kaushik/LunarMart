import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Seller from '../models/sellerModel.js';
import generateToken from '../utils/generateToken.js';
import fs from 'fs';
import path from 'path';

const logToFile = (message) => {
    const logPath = path.join(process.cwd(), 'login_debug.log');
    fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
};

const registerUser = asyncHandler(async (req, res) => {
    let { name, email, password, sellerId } = req.body;

    email = email ? email.toLowerCase().trim() : '';
    sellerId = sellerId ? sellerId.trim() : null;

    const userExists = await User.findOne({ email });

    if (userExists) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    if (sellerId) {
        const seller = await Seller.findOne({ email, sellerId });
        if (!seller) {
            const error = new Error('Invalid Seller ID or Email');
            error.statusCode = 400;
            throw error;
        }
    }

    const user = await User.create({
        name,
        email,
        password: password || Math.random().toString(36).slice(-8),
        isSeller: !!sellerId,
        sellerId: sellerId || null
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'Registration successful. Please login.'
        });
    } else {
        const error = new Error('Invalid user data');
        error.statusCode = 400;
        throw error;
    }
});

const loginUser = asyncHandler(async (req, res) => {
    let { email, password, sellerId } = req.body;

    email = email ? email.toLowerCase().trim() : '';
    sellerId = sellerId ? sellerId.trim() : null;

    if (sellerId) {
        logToFile(`Attempting seller login for email: ${email}, sellerId: ${sellerId}`);
        const seller = await Seller.findOne({ email, sellerId });
        logToFile(`Seller found: ${seller ? 'YES' : 'NO'}`);

        if (seller) {
            logToFile(`Seller status: ${seller.status}`);
            let user = await User.findOne({ email });
            logToFile(`User found: ${user ? 'YES' : 'NO'}`);

            if (!user) {
                logToFile(`Seller login failed: User record not found for email ${email}`);
                const error = new Error('Seller account found, but you must register first.');
                error.statusCode = 401;
                throw error;
            } else if (!user.isSeller || user.sellerId !== sellerId) {
                logToFile(`Syncing user isSeller=true and sellerId=${sellerId}`);
                try {
                    user.isSeller = true;
                    user.sellerId = sellerId;
                    await user.save();
                    logToFile('User record synced successfully');
                } catch (saveErr) {
                    logToFile(`CRITICAL: user.save() failed: ${saveErr.message}`);
                    const error = new Error('Error updating user record');
                    error.statusCode = 500;
                    throw error;
                }
            }

            const token = generateToken(res, user._id);
            const responseData = {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                profileImage: user.profileImage,
                isAdmin: user.isAdmin,
                isSeller: user.isSeller,
                sellerId: user.sellerId,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode,
                country: user.country,
                token,
            };
            logToFile(`Returning successful seller login response for ${email}. isSeller: ${responseData.isSeller}`);
            return res.json(responseData);
        } else {
            logToFile(`Seller login failed: Invalid Email or Seller ID combination for ${email}`);
            const error = new Error('Invalid Email or Seller ID');
            error.statusCode = 401;
            throw error;
        }
    }

    logToFile(`Attempting buyer login for email: ${email}`);
    const user = await User.findOne({ email });
    logToFile(`User found: ${user ? 'YES' : 'NO'}`);

    if (user && (await user.matchPassword(password))) {
        logToFile(`Password match: YES`);
        const token = generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            profileImage: user.profileImage,
            isAdmin: user.isAdmin,
            isSeller: user.isSeller,
            sellerId: user.sellerId,
            address: user.address,
            city: user.city,
            postalCode: user.postalCode,
            country: user.country,
            token,
        });
    } else {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/'
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.mobile !== undefined) {
            user.mobile = req.body.mobile;
        }

        if (req.body.profileImage !== undefined) {
            user.profileImage = req.body.profileImage;
        }

        user.address = req.body.address || user.address;
        user.city = req.body.city || user.city;
        user.postalCode = req.body.postalCode || user.postalCode;
        user.country = req.body.country || user.country;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            profileImage: updatedUser.profileImage,
            isAdmin: updatedUser.isAdmin,
            isSeller: updatedUser.isSeller,
            sellerId: updatedUser.sellerId,
            address: updatedUser.address,
            city: updatedUser.city,
            postalCode: updatedUser.postalCode,
            country: updatedUser.country,
            message: 'Profile updated successfully',
        });
    } else {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            const error = new Error('Cannot delete admin user');
            error.statusCode = 400;
            throw error;
        }
        await User.deleteOne({ _id: user._id });
        res.json({ message: 'User removed' });
    } else {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
};
