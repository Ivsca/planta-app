// backend/src/routes/settings.routes.js
const router = require("express").Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  getSettings,
  updateSettings,
} = require("../controllers/settings.controller");

// GET /api/settings  →  pública
router.get("/", getSettings);

// PUT /api/settings  →  solo admin
router.put("/", requireAuth, requireAdmin, updateSettings);

module.exports = router;
