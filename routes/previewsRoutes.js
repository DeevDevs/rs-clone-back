const express = require("express");
const authorizeController = require("../controllers/authorizeController");
const memoirController = require("../controllers/memoirController");

const router = express.Router();

router.use(authorizeController.protect);
router.get("/", memoirController.getPreviewData);

module.exports = router;