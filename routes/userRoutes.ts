import express from "express";
import {
  addNewUser,
  deleteOneUser,
  getOneUser,
  updateOneUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/", addNewUser);
router.delete("/", deleteOneUser);
router.get("/", getOneUser);
router.patch("/", updateOneUser);

export default router;
