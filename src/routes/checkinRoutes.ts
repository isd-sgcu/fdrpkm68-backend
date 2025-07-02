import { Router } from 'express';
import {
	createCheckin, getAllCheckin, updateCheckinStatus
} from '../controllers/checkinController';
import { checkinMiddleware } from '../middlewares/checkinMiddleware';

const router = Router();
router.get('/', getAllCheckin);
router.post('/', checkinMiddleware({ eventRequired: false }), updateCheckinStatus);
router.post('/register', checkinMiddleware({ eventRequired: true }), createCheckin);

export default router;