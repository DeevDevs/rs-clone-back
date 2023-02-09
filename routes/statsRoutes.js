const express = require("express");
const statsController = require("../controllers/statsController");
const authorizeController = require("../controllers/authorizeController");

const router = express.Router();

router.use(authorizeController.protect);
router.get("/", statsController.getOneStats);
router.patch("/", statsController.updateOneStats);


module.exports = router;
