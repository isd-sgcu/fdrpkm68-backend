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

/**
 * @swagger
 * tags:
 *   - name: Checkin
 *     description: Register for event
 * 
 * /api/checkin:
 *   get:
 *     summary: Get all checkin record
 *     description: This can only be done by role STAFF user
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkin record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   user_student_id:
 *                     type: string
 *                   user_citizen_id:
 *                     type: string
 *                   event:
 *                     type: event_type
 *                     enum: [FIRSTDATE, RPKM, FRESHMENNIGHT]
 *                   status:
 *                     type: checkin_status_type
 *                     enum: [PRE_REGISTER, EVENT_REGISTER]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 */
router.get(
	'/',
	roleMiddleware([RoleType.STAFF]),
	getAllCheckin
);
/**
 * @swagger
 * /api/checkin/{student_id}/{citizen_id}/{event}:
 *   get:
 *     summary: Get checkin record by userID and event
 *     description: This can only be done by logged in user
 *     parameters:
 *       - name: student_id
 *         in: path
 *         required: true
 *         description: Student ID with length 10
 *         schema:
 *           type: string
 *       - name: citizen_id
 *         in: path
 *         required: true
 *         description: Citizen ID with length 13
 *         schema:
 *           type: string
 *       - name: event
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [FIRSTDATE, RPKM, FRESHMENNIGHT]
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkin record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [PRE_REGISTER, EVENT_REGISTER]
 *                   example: PRE_REGISTER
 *                 student_id:
 *                   type: string
 *                 citizen_id:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 lastCheckIn:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid student_id or citizen_id
 *       404:
 *         description: Checkin not found
 */
router.get(
	'/:student_id/:citizen_id/:event',
	validateParamsMiddleware({ eventRequired: true }),
	getCheckin
);
/**
 * @swagger
 * /api/checkin/{student_id}/{citizen_id}:
 *   patch:
 *     summary: Update checkin status to EVENT_REGISTER
 *     description: This can only be done by role STAFF user
 *     parameters:
 *       - name: student_id
 *         in: path
 *         required: true
 *         description: Student ID with length 10
 *         schema:
 *           type: string
 *       - name: citizen_id
 *         in: path
 *         required: true
 *         description: Citizen ID with length 13
 *         schema:
 *           type: string
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Checkin status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                   enum: [FIRSTDATE, RPKM, FRESHMENNIGHT]
 *                   example: FIRSTDATE
 *                 student_id:
 *                   type: string
 *                 citizen_id:
 *                   type: string
 *                 nickname:
 *                   type: string
 *                 first_name:
 *                   type: string
 *                 last_name:
 *                   type: string
 *                 lastCheckIn:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid student_id or citizen_id
 *       404:
 *         description: Checkin not found
 *       409:
 *         description: User has already checkin (status = EVENT_REGISTER)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Conflict
 *                 message:
 *                   type: string
 *                   example: 'User has already checkin event: ${event}'
 *                 lastCheckIn:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: No active event
 */
router.patch(
	'/:student_id/:citizen_id',
	roleMiddleware([RoleType.STAFF]),
	validateParamsMiddleware({ eventRequired: false }),
	updateCheckinStatus
);
/**
 * @swagger
 * /api/checkin/register:
 *   post:
 *     summary: Create checkin record
 *     description: This can only be done by role STAFF user
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
 *               event:
 *                 type: string
 *                 enum: [FIRSTDATE, RPKM, FRESHMENNIGHT]
 *                 example: FIRSTDATE
 *     tags: [Checkin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Checkin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: PRE_REGISTER
 *                 message:
 *                   type: string
 *                   example: Pre-Register created successfully
 *       400:
 *         description: Invalid student_id or citizen_id
 *       409:
 *         description: Checkin has already exist
 */
router.post(
	'/register',
	roleMiddleware([RoleType.STAFF]),
	validateBodyMiddleware({ eventRequired: true }),
	createCheckin
);

export default router;