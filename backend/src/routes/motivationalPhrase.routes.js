// backend/src/routes/motivationalPhrase.routes.js
const router = require("express").Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const {
  getPhrase,
  createPhrase,
  updatePhrase,
} = require("../controllers/motivationalPhrase.controller");

// GET /api/motivational-phrase  →  pública, cualquier usuario la puede leer
router.get("/", getPhrase);

// POST /api/motivational-phrase  →  solo admin, solo si aún no existe
router.post("/", requireAuth, requireAdmin, createPhrase);

// PUT /api/motivational-phrase  →  solo admin, actualiza la existente
router.put("/", requireAuth, requireAdmin, updatePhrase);

module.exports = router;
