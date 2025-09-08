/** @format */

const express = require("express");
const {
	getTips,
	addTip,
	updateTipStatus,
	updateTip,
	deleteTip,
	getRecentResults,
} = require("../controllers/tipsController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", getTips); // ✅ Now query params
router.get("/recent/results", getRecentResults);
router.post("/", auth, addTip);
router.patch("/:id", auth, updateTipStatus);
router.put("/:id", auth, updateTip);
router.delete("/:id", auth, deleteTip);

module.exports = router;
