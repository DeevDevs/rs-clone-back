import express from "express";
import { getOneStats, updateOneStats } from "../controllers/statsController";
import { protect } from "../controllers/authorizeController";

const router = express.Router();

router.patch("/", updateOneStats);

router.use(protect);
router.get("/", getOneStats);

export default router;
