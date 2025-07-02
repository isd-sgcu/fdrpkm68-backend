import { Router } from 'express';
import { getMyProfile } from '../controllers/userController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import { RoleType } from '../types/enum';

const router = Router();

// const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

router.get('/me', authMiddleware, roleMiddleware([RoleType.FRESHMAN, RoleType.STAFF]),getMyProfile);
export default router;