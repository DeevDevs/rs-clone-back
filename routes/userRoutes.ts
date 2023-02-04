import express from "express";
import * as authCont from "../controllers/authorizeController";
import * as userCont from "../controllers/userController";

const router = express.Router();

router.post("/signup", authCont.signUp);
router.post("/login", authCont.login);
router.post("/logout", authCont.logout);
router.get("/isloggedin", authCont.isLoggedIn);

router.use(authCont.protect);

router.delete("/", userCont.deleteOneUser);
router.get("/", userCont.getOneUser);
router.patch("/", userCont.updateOneUser);

export default router;
