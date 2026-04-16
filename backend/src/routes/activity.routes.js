// backend/src/routes/activity.routes.js
const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const activityController = require("../controllers/activity.controller");

router.get("/me", requireAuth, activityController.getMe);
router.get("/article/:id/in-progress", requireAuth, activityController.getArticleInProgress);
router.post("/event", requireAuth, activityController.postEvent);
router.patch("/in-progress", requireAuth, activityController.patchInProgress);

module.exports = router;
