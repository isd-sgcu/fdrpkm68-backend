import { Router } from "express";
import { getGroupData,createOwnGroup} from "../controllers/groupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/createOwnGroup", createOwnGroup);
router.get("/:id", getGroupData);

export default router;
