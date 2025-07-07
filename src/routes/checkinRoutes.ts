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
 * /checkin:
 *   get:
 *     summary: Get all checkin record.
 *     description: Get all checkin record. Can only be done by STAFF role.
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
 * /checkin/{student_id}/{citizen_id}/{event}:
 *   get:
 *     summary: Get checkin record by userID and event.
 *     description: Get checkin record by student_it, citizen_id and event. Can only be done by logged in user.
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
 *         description: User has not pre-register
 */
router.get(
	'/:student_id/:citizen_id/:event',
	validateParamsMiddleware({ eventRequired: true }),
	getCheckin
);
/**
 * @swagger
 * /checkin/{student_id}/{citizen_id}:
 *   patch:
 *     summary: Checkin user for event.
 *     description: Update user checkin status to EVENT_REGISTER. Can only be done by STAFF role.
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
 *                 status:
 *                   type: string
 *                   enum: [EVENT_REGISTER]
 *                   example: EVENT_REGISTER
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
 *         description: User has not pre-register
 *       409:
 *         description: User has already checkin
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
 *                   example: 'User has already checkin'
 *                 status:
 *                   type: string
 *                   enum: [EVENT_REGISTER]
 *                   example: EVENT_REGISTER
 *                 event:
 *                   type: string
 *                   enum: [FIRSTDATE, RPKM, FRESHMENNIGHT]
 *                   example: FIRSTDATE
 *                 lastCheckIn:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: No event is currently active
 */
router.patch(
	'/:student_id/:citizen_id',
	roleMiddleware([RoleType.STAFF]),
	validateParamsMiddleware({ eventRequired: false }),
	updateCheckinStatus
);
/**
 * @swagger
 * /checkin:
 *   post:
 *     summary: Pre-register user for event.
 *     description: Create user checkin with status PRE_REGISTER. Can only be done by STAFF role.
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
 *         description: Pre-register created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [PRE_REGISTER]
 *                   example: PRE_REGISTER
 *                 message:
 *                   type: string
 *                   example: Pre-register created successfully
 *       400:
 *         description: Invalid student_id or citizen_id
 *       409:
 *         description: User has already pre-register or checkin
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
 *                   example: User has already pre-register
 *                 status:
 *                   type: string
 *                   enum: [PRE_REGISTER, EVENT_REGISTER]
 *                   example: PRE_REGISTER
 */
router.post(
	'/',
	roleMiddleware([RoleType.STAFF]),
	validateBodyMiddleware({ eventRequired: true }),
	createCheckin
);

export default router;