import express from 'express';
import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import productRoutes from './routes/productRoute.js';
import orderRoutes from './routes/orderRoute.js';
import sellerRoutes from './routes/sellerRoute.js';
import uploadRoutes from './routes/uploadRoute.js';
import errorMiddleware from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config({ path: './config/config.env' });

connectDB();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());
const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.1.172:3000',
    process.env.FRONTEND_URL || 'https://lunarmart-frontend.onrender.com'
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/sellers', sellerRoutes);
app.use('/api/v1/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'LunarMart API is running',
        version: '1.0.0',
        endpoints: {
            users: '/api/v1/users',
            products: '/api/v1/products',
            orders: '/api/v1/orders',
            payment: '/api/v1/payment',
            sellers: '/api/v1/sellers'
        }
    });
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
    )
);

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    server.close(() => process.exit(1));
});

export default app;
