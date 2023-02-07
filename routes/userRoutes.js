const express = require("express");
const authorizeController = require("../controllers/authorizeController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authorizeController.signUp);
router.post("/login", authorizeController.login);
router.post("/logout", authorizeController.logout);
router.post("/isloggedin", authorizeController.isLoggedIn);
router.post("/oneUser", userController.getOneUser);
router.use(authorizeController.protect);


router.delete("/", userController.deleteOneUser);
router.patch("/", userController.updateOneUser);

module.exports = router;
