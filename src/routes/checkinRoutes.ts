import { Router } from 'express';
import * as checkinController from '../controllers/checkinController';

const router = Router();
router.get('/', checkinController.getAllCheckin);
router.post('/create', checkinController.createCheckin);
router.post('/update', checkinController.updateCheckinStatus);

export default router;