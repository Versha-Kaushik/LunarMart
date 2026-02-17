import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                seller: x.seller || x.user,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        res.status(201).json(createdOrder);
    }
});

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
});

const getMySellerOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ 'orderItems.seller': req.user._id })
        .populate('user', 'name email');

    const sellerOrders = orders.map(order => {
        const orderObj = order.toObject();
        orderObj.orderItems = orderObj.orderItems.filter(
            item => item.seller && item.seller.toString() === req.user._id.toString()
        );
        return orderObj;
    });

    res.json(sellerOrders);
});

const updateOrderItemStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        let itemUpdated = false;
        order.orderItems.forEach(item => {
            if (item.seller && item.seller.toString() === req.user._id.toString()) {
                item.status = status;
                itemUpdated = true;
            }
        });

        if (!itemUpdated) {
            res.status(403);
            throw new Error('Not authorized to update this order');
        }

        if (status === 'return_accepted') {
            order.returnAcceptedAt = new Date();
            const pickupDate = new Date();
            pickupDate.setDate(pickupDate.getDate() + 7);
            order.pickupTime = pickupDate;
        }

        const allDelivered = order.orderItems.every(item => item.status === 'delivered');
        if (allDelivered) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
            order.isPaid = true;
            order.paidAt = Date.now();
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
});

const cancelOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to cancel this order');
        }

        if (order.isDelivered) {
            res.status(400);
            throw new Error('Cannot cancel a delivered order');
        }

        order.orderItems.forEach(item => {
            if (item.status === 'pending' || item.status === 'shipped') {
                item.status = 'cancelled';
            }
        });

        if (req.body.cancelReason) {
            order.cancelReason = req.body.cancelReason;
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

const returnOrder = asyncHandler(async (req, res) => {
    const { returnReason, returnImage, returnVideo } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
        if (order.user.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to return this order');
        }

        if (!order.isDelivered) {
            res.status(400);
            throw new Error('Can only return delivered orders');
        }

        order.returnReason = returnReason;
        order.returnImage = returnImage;
        order.returnVideo = returnVideo;
        order.returnRequestedAt = Date.now();

        order.orderItems.forEach(item => {
            if (item.status === 'delivered') {
                item.status = 'return_requested';
            }
        });

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

export {
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
};
