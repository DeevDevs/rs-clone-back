const express = require("express");
const authorizeController = require("../controllers/authorizeController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authorizeController.signUp);
router.post("/login", authorizeController.login);
router.post("/logout", authorizeController.logout);
router.get("/isloggedin", authorizeController.isLoggedIn);


router.use(authorizeController.protect);
router.get("/oneUser", userController.getOneUser);
router.patch("/updateUser", userController.updateOneUser);
router.delete("/deleteUser", userController.deleteOneUser);

module.exports = router;
