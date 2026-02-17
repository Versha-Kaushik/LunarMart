import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        const error = new Error('Not authorized, no token');
        error.statusCode = 401;
        throw error;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            res.cookie('token', '', {
                httpOnly: true,
                expires: new Date(0),
                path: '/'
            });
            const error = new Error('Not authorized, user not found');
            error.statusCode = 401;
            throw error;
        }

        next();
    } catch (e) {
        console.error(e);
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0),
            path: '/'
        });

        const error = new Error('Not authorized, token failed');
        error.statusCode = 401;
        throw error;
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        const error = new Error('Not authorized as an admin');
        error.statusCode = 401;
        throw error;
    }
};

const seller = (req, res, next) => {
    if (req.user && (req.user.isSeller || req.user.isAdmin)) {
        next();
    } else {
        const error = new Error('Not authorized as a seller');
        error.statusCode = 401;
        throw error;
    }
};

export { protect, admin, seller };
