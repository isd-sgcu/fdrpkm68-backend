import { Router } from "express";
import { getGroupData,createOwnGroup,joinGroup} from "../controllers/groupController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/createOwnGroup", createOwnGroup);
router.get("/:id", getGroupData);
router.post("/join/:id", joinGroup);

export default router;
