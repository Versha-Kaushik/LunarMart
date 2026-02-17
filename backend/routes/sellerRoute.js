import express from 'express';
import {
    applyAsSeller,
    getSellerApplications,
    getSellerById,
    updateSellerStatus,
    deleteSellerApplication,
} from '../controllers/sellerController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/apply', applyAsSeller);

router.get('/', protect, getSellerApplications);
router.get('/:id', protect, getSellerById);
router.put('/:id/status', protect, updateSellerStatus);
router.delete('/:id', protect, deleteSellerApplication);

export default router;
