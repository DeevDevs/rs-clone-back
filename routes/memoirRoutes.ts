import express from "express";
import { protect } from "../controllers/authorizeController";
import {
  addNewMemoir,
  deleteOneMemoir,
  getOneMemoir,
  updateOneMemoir,
} from "../controllers/memoirController";

const router = express.Router();

router.use(protect);

router.post("/", addNewMemoir);
router.delete("/", deleteOneMemoir);
router.get("/", getOneMemoir);
router.patch("/", updateOneMemoir);

export default router;
