import express from "express";
import {
  addNewMemoir,
  deleteOneMemoir,
  getOneMemoir,
  updateOneMemoir,
} from "../controllers/memoirController";

const router = express.Router();

router.post("/", addNewMemoir);
router.delete("/", deleteOneMemoir);
router.get("/", getOneMemoir);
router.patch("/", updateOneMemoir);

export default router;
