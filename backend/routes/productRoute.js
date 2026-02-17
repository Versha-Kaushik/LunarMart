import express from 'express';
const router = express.Router();
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    deleteProductReview,
    getTopProducts,
} from '../controllers/productController.js';
import { protect, seller } from '../middlewares/authMiddleware.js';

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.get('/top', getTopProducts);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, seller, updateProduct)
    .delete(protect, seller, deleteProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId').delete(protect, deleteProductReview);

export default router;
