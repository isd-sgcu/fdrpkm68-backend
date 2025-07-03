import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import checkinRoutes from './checkinRoutes';
import houseRoutes from './houseRoutes';
import groupRoutes from './groupRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/checkin', checkinRoutes);
router.use('/house', houseRoutes);
router.use('/groups', groupRoutes);

export default router;