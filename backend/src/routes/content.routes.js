const express = require("express");
const router = express.Router();
const contentController = require("../controllers/content.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const upload = require("../config/multer");

// Rutas públicas
router.get("/", contentController.getPublished);
router.get("/admin/all", requireAuth, requireAdmin, contentController.getAllAdmin);

// Guardar / quitar de guardados (ANTES de /:id para que no lo capture)
router.get("/saved/me", requireAuth, contentController.getSavedContent);

router.get("/:id", contentController.getById);

// Estado de completado
router.get("/:id/completion-status", requireAuth, contentController.getCompletionStatus);

// Completar contenido
router.post("/:id/complete", requireAuth, contentController.completeContent);

// Toggle guardar contenido
router.post("/:id/save", requireAuth, contentController.toggleSaveContent);

// Admin
router.post("/", requireAuth, requireAdmin, upload.single("video"), contentController.createContent);
router.put("/:id", requireAuth, requireAdmin, upload.single("video"), contentController.updateContent);
router.delete("/:id", requireAuth, requireAdmin, contentController.deleteContent);

module.exports = router;