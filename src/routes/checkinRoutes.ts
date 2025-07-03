import { Router } from 'express';
import {
	createCheckin, getAllCheckin, getCheckin, updateCheckinStatus
} from '../controllers/checkinController';
import {
	validateBodyMiddleware, validateParamsMiddleware
} from '../middlewares/checkinMiddleware';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import { RoleType } from '../types/enum';

const router = Router();

router.use(authMiddleware);

router.get(
	'/',
	roleMiddleware([RoleType.STAFF]),
	getAllCheckin
);
router.get(
	'/:student_id/:citizen_id/:event',
	validateParamsMiddleware({ eventRequired: true }),
	getCheckin
);
router.patch(
	'/:student_id/:citizen_id',
	roleMiddleware([RoleType.STAFF]),
	validateParamsMiddleware({ eventRequired: false }),
	updateCheckinStatus
);
router.post(
	'/register',
	roleMiddleware([RoleType.STAFF]),
	validateBodyMiddleware({ eventRequired: true }),
	createCheckin
);

export default router;