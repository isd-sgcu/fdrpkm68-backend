import { Router } from "express";
import { getGroupData } from "../controllers/groupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get("/:id", getGroupData);

export default router;
