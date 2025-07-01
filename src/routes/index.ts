import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import checkinRoutes from './checkinRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/checkin', checkinRoutes);

export default router;