import { Router } from "express";
import { getGroupData } from "../controllers/groupController";

const router = Router();

router.get("/:id", getGroupData);

export default router;
