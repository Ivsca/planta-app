const express = require("express");
const router = express.Router();

const podcastController = require("../controllers/podcast.controller");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const upload = require("../config/multer");

// CREATE: audio obligatorio + image opcional
router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  podcastController.createPodcast
);

// Rutas públicas
router.get("/", podcastController.getPodcasts);

// Guardar / quitar de guardados (ANTES de /:id para que no lo capture)
router.get("/saved/me", requireAuth, podcastController.getSavedPodcasts);

router.get("/:id", podcastController.getPodcastByID);

// Guardar / quitar de guardados
router.post("/:id/save", requireAuth, podcastController.toggleSavePodcast);

// UPDATE metadata (JSON)
router.put("/:id", requireAuth, requireAdmin, podcastController.updatePodcast);

// UPDATE portada (multipart)
router.put(
  "/:id/image",
  requireAuth,
  requireAdmin,
  upload.single("image"),
  podcastController.updatePodcastImage
);

router.delete("/:id", requireAuth, requireAdmin, podcastController.deletePodcast);

module.exports = router;