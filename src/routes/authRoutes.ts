import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();
/**
 * @openapi
 * api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *     responses:
 *       '201':
 *          description: User registered successfully.
 *       '409':
 *          description: User already exists with this student ID and citizen ID.
 *       '400':  
 *          description: Bad request
 * 
 */
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;