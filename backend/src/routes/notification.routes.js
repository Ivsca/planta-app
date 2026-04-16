const router = require("express").Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { registerPushToken, broadcast } = require("../controllers/notification.controller");

/* ── POST /api/notifications/register-token ── (cualquier usuario autenticado) */
router.post("/register-token", requireAuth, registerPushToken);

/* ── POST /api/notifications/broadcast ── (solo admin) */
router.post("/broadcast", requireAuth, requireAdmin, broadcast);

module.exports = router;
