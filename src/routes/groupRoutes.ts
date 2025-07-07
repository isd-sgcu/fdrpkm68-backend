import { Router } from "express";
import {
	getGroupData,
	createOwnGroup,
	joinGroup,
	leaveGroup,
} from "../controllers/groupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /groups/createOwnGroup:
 *  post:
 *    summary: Create a new group for a user, if the user meets certain conditions.
 *    description: Creates a new group for a user, if the user is NOT in ANY group (ANY group includes a 1-person group.)
 *    tags: [Groups]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: New group created successfully.
 *        content:
 *          application/json:
 *           schema:
 *           type: object
 *           properties:
 *             status:
 *              type: string
 *              example: success
 *           message:
 *              type: string
 *           newGroup:
 *              type: string
 *              example: 7cd103c6-8b82-414c-8260-a1f03138354c
 *      400:
 *         description: Bad request, group not created, probably because user does not meet the conditions.
 *      401:
 *         description: Unauthorized, probably because user is not logged in/invalid credentials.
 *      404:
 *        description: User not found.
 *      500:
 *        description: Internal Server Error.
 */
router.post("/createOwnGroup", createOwnGroup);

/**
 * @swagger
 * /groups/{id}:
 *  get:
 *    summary: Gets info of a group.
 *    tags: [Groups]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Data fetched successfully.
 *      500:
 *        description: Internal Server Error.
 */
router.get("/:id", getGroupData);

/**
 * @swagger
 * /groups/join/{id}:
 *  post:
 *    summary: Joins a group for a user, if the user meets certain conditions.
 *    description: Creates a new group for a user, if the user is NOT in ANY group (ANY group includes a 1-person group.)
 *    tags: [Groups]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: Group joined successfully.
 *        content:
 *          application/json:
 *           schema:
 *           type: object
 *           properties:
 *             status:
 *              type: string
 *              example: success
 *           message:
 *              type: string
 *           newGroup:
 *              type: string
 *              example: 7cd103c6-8b82-414c-8260-a1f03138354c
 *      400:
 *         description: Bad request, group not created, probably because user does not meet the conditions.
 *      401:
 *         description: Unauthorized, probably because user is not logged in/invalid credentials.
 *      404:
 *        description: Group to join/user not found.
 *      500:
 *        description: Internal Server Error.
 */
router.post("/join/:id", joinGroup);

/**
 * @swagger
 * /groups/leave:
 *  post:
 *    summary: Leaves (and possibly deletes) a group for a user, if the user meets certain conditions.
 *    description: Leaves the user's current group, if the user is not a group owner with a member count of higher than 1. Additionally, if the user is a group owner with a member count of 1, the group is also deleted entirely.
 *    tags: [Groups]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Group left successfully.
 *        content:
 *          application/json:
 *           schema:
 *           type: object
 *           properties:
 *             status:
 *              type: string
 *              example: success
 *           message:
 *              type: string
 *      400:
 *         description: Bad request, user did not leave group, probably because user does not meet the conditions or user has no group already.
 *      401:
 *         description: Unauthorized, probably because user is not logged in/invalid credentials.
 *      404:
 *        description: User not found.
 *      500:
 *        description: Internal Server Error.
 */
router.post("/leave", leaveGroup);

export default router;
