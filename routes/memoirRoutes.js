const express = require("express");
const authorizeController = require("../controllers/authorizeController");
const memoirController = require("../controllers/memoirController");

const router = express.Router();

router.use(authorizeController.protect);

router.post("/newMemoir", memoirController.addNewMemoir);
router.delete("/deleteMemoir", memoirController.deleteOneMemoir);
router.get("/getMemoir", memoirController.getOneMemoir);
router.patch("/updateMemoir", memoirController.updateOneMemoir);

module.exports = router;
