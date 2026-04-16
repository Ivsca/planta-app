// backend/src/routes/challenge.routes.js
const express = require("express");
const router = express.Router();
const c = require("../controllers/challenge.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// ═══════════════════════════════════════════════
// Rutas específicas ANTES de rutas con :id
// ═══════════════════════════════════════════════

// ── Admin ──
router.get("/admin/all",  requireAuth, requireAdmin, c.getAllAdmin);
router.get("/admin/:id/qr", requireAuth, requireAdmin, c.getAdminQr);

// ── Usuario autenticado: mis retos ──
router.get("/me", requireAuth, c.getMine);

// ── Acciones sobre un UserChallenge ──
router.patch("/me/:ucId/sync", requireAuth, c.sync);
router.patch("/me/:ucId/sync-bulk", requireAuth, c.syncBulk);
router.patch("/me/:ucId/report", requireAuth, c.report);
router.patch("/me/:ucId/scan", requireAuth, c.scan);
router.patch("/me/:ucId/abandon", requireAuth, c.abandon);

// ═══════════════════════════════════════════════
// Catálogo público
// ═══════════════════════════════════════════════
router.get("/", c.getAll);
router.get("/:id", c.getById);

// ── Admin CRUD ──
router.post("/", requireAuth, requireAdmin, c.create);
router.put("/:id", requireAuth, requireAdmin, c.update);
router.delete("/:id", requireAuth, requireAdmin, c.remove);

// ── Usuario acepta un reto ──
router.post("/:id/start", requireAuth, c.start);

module.exports = router;
