import { Router } from 'express';
import { registerUser, loginUser, forgotPassword } from '../controllers/authController';

const router = Router();
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *               citizen_id:
 *                 type: string
 *               prefix:
 *                 type: PrefixType
 *                 enum: [MR., MRS., MS.]
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               nickname:
 *                 type: string
 *               academic_year:
 *                 type: string
 *               faculty:
 *                 type: FacultyId
 *                 enum:
 *                   [
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
 *                   ]
 *               password:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               parent_name:
 *                 type: string
 *               parent_phone_number:
 *                 type: string
 *               parent_relationship:
 *                 type: string
 *               food_allergy:
 *                 type: string
 *                 nullable: true
 *               drug_allergy:
 *                 type: string
 *                 nullable: true
 *               illness:
 *                 type: string
 *                 nullable: true
 *               avatar_id:
 *                 type: number
 *             required:
 *               - student_id
 *               - citizen_id
 *               - prefix
 *               - first_name
 *               - last_name
 *               - nickname
 *               - academic_year
 *               - faculty
 *               - password
 *               - phone_number
 *               - parent_name
 *               - parent_phone_number
 *               - parent_relationship
 *               - avatar_id
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *       '409':
 *         description: User already exists with this student ID and citizen ID.
 *       '400':
 *         description: Invalid Input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 invalidCitizenId:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     message:
 *                       type: string
 *                 passwordNotStrong:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                     message:
 *                       type: string
 */
router.post('/register', registerUser);
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *               citizen_id:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - student_id
 *               - citizen_id
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful.
 *       '401':
 *         description: passwrod is incorrect. please try again.
 */
router.post('/login', loginUser);

/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset user password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *               citizen_id:
 *                 type: string
 *               new_password:
 *                 type: string
 *               confirm_new_password:
 *                 type: string
 *             required:
 *               - student_id
 *               - citizen_id
 *               - new_password
 *               - confirm_new_password
 *     responses:
 *       '200':
 *         description: Password updated successfully.
 *       '400':
 *         description: New password and confirmation do not match.
 */

router.post('/forgot-password', forgotPassword);
export default router;