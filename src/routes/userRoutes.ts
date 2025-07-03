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
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                   type: string
 *                 faculty:
 *                   type: FacultyId
 *                   enum:
 *                      [
 *                     SCIENCE,
 *                     ENGINEER,
 *                     MEDICINE,
 *                     ARTS,
 *                     EDUCATION,
 *                     PSYCHOLOGY,
 *                     DENTISTRY,
 *                     LAW,
 *                     COMMUNICATION_ARTS,
 *                     NURSING,
 *                     COMMERCE_AND_ACCOUNTANCY,
 *                     PHARMACEUTICAL_SCIENCE,
 *                     POLITICAL_SCIENCE,
 *                     SPORTS_SCIENCE,
 *                     FINE_AND_APPLIED_ARTS,
 *                     ECONOMICS,
 *                     ARCHITECTURE,
 *                     ALLIED_HEALTH_SCIENCES,
 *                     VETERINARY_SCIENCE
 *                      ]
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
 *                   nullable: true
 *                 drug_allergy:
 *                   type: string
 *                   nullable: true
 *                 illness:
 *                   type: string
 *                   nullable: true
 */
router.get('/me', authMiddleware, roleMiddleware([RoleType.FRESHMAN, RoleType.STAFF]),getMyProfile);
export default router;