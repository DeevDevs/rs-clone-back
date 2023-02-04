const express = require("express");
const statsController = require("../controllers/statsController");
const authorizeController = require("../controllers/authorizeController");

const router = express.Router();

router.patch("/", statsController.updateOneStats);

router.use(authorizeController.protect);
router.get("/", statsController.getOneStats);

module.exports = router;
