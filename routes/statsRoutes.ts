import express from "express";
import { getOneStats, updateOneStats } from "../controllers/statsController";

const router = express.Router();

router.get("/", getOneStats);
router.patch("/", updateOneStats);

export default router;
