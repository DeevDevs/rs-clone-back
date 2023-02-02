import express from "express";
import {
  login,
  logout,
  protect,
  signUp,
} from "../controllers/authorizeController";
import {
  addNewUser,
  deleteOneUser,
  getOneUser,
  updateOneUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

router.use(protect);

// router.post("/", addNewUser);
router.delete("/", deleteOneUser);
router.get("/", getOneUser);
router.patch("/", updateOneUser);

export default router;
