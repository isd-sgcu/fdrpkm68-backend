import { Router } from 'express';
import { getMyProfile } from '../controllers/userController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';

const router = Router();
router.get('/me', authMiddleware, getMyProfile); 

export default router;