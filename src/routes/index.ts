import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import checkinRoutes from './checkinRoutes';
import houseRoutes from './houseRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/checkin', checkinRoutes);
router.use('/house', houseRoutes);

export default router;