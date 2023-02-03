import express from "express";
import { protect } from "../controllers/authorizeController";
import * as memCont from "../controllers/memoirController";

const router = express.Router();

router.use(protect);

router.post("/", memCont.addNewMemoir);
router.delete("/", memCont.deleteOneMemoir);
router.get("/", memCont.getOneMemoir);
router.patch("/", memCont.updateOneMemoir);

export default router;
