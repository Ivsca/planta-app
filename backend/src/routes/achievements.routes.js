const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { getAchievementsSummary } = require("../controllers/achievements.controller");

router.get("/summary", requireAuth, getAchievementsSummary);

module.exports = router;