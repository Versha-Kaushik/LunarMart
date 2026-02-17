import express from 'express';
const router = express.Router();
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

router.route('/').post(registerUser).get(protect, getUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router
    .route('/:id')
    .delete(protect, deleteUser)
    .get(protect, getUserById)
    .put(protect, updateUser);

export default router;
