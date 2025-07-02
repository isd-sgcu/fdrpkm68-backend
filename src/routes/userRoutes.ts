import { Router } from 'express';
import { getMyProfile } from '../controllers/userController';
import { authMiddleware, roleMiddleware } from '../middlewares/authMiddleware';
import { RoleType } from '../types/enum';

const router = Router();
/**
 * @swagger
 * api/users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 student_id:
 *                   type: string
 *                 citizen_id:
 *                   type: string
 *                 prefix:
 *                   type: PrefixType
 *                   enum: [MR., MRS., MS.]
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 academic_year:
 *                   type: integer
 *                 faculty:
 *                   type: FacultyId
 *                 phone_number:
 *                   type: string
 *                 parent_name:
 *                   type: string
 *                 parent_phone_number:
 *                   type: string
 *                 parent_relationship:
 *                   type: string
 *                 food_allergy:
 *                   type: string
 *                 drug_allergy:
 *                   type: string
 *                 illness:
 *                   type: string
 *         responses:
 *           200:
 *             description: Successfully retrieved user profile
 */
router.get('/me', authMiddleware, roleMiddleware([RoleType.FRESHMAN, RoleType.STAFF]),getMyProfile);
export default router;