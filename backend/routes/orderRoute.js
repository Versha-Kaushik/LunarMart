import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    updateOrderItemStatus,
    cancelOrder,
    returnOrder,
    getMyOrders,
    getMySellerOrders,
    getOrders,
} from '../controllers/orderController.js';
import { protect, seller } from '../middlewares/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, getOrders);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/seller-orders').get(protect, seller, getMySellerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, updateOrderToDelivered);
router.route('/:id/item-status').put(protect, seller, updateOrderItemStatus);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/return').put(protect, returnOrder);

export default router;
