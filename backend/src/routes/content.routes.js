// backend/src/routes/content.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const Content = require("../models/Content");

// ── Helpers ──────────────────────────────────────────

/**
 * Extrae el ID de YouTube de múltiples formatos:
 *  - URL normal: https://www.youtube.com/watch?v=xUslNLuolLs
 *  - URL corta:  https://youtu.be/xUslNLuolLs
 *  - Embed URL:  https://www.youtube.com/embed/xUslNLuolLs
 *  - Iframe:     <iframe ... src="https://www.youtube.com/embed/xUslNLuolLs" ...>
 *  - Solo ID:    xUslNLuolLs
 */
function extractYoutubeId(input) {
  if (!input) return null;

  // Extraer src del iframe si viene con markup
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  const url = iframeMatch ? iframeMatch[1] : input.trim();

  let m;

  // youtube.com/embed/ID
  m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // youtube.com/watch?v=ID
  m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // youtu.be/ID
  m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  // Solo un ID (11 caracteres)
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  return null;
}

// ══════════════════════════════════════════════════════
// RUTAS PÚBLICAS
// ══════════════════════════════════════════════════════

/**
 * GET /api/content
 * Lista contenido publicado con filtros opcionales.
 */
router.get("/", async (req, res) => {
  try {
    const { type, category, featured, search, limit } = req.query;
    const filter = { status: "published" };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (featured === "true") filter.isFeatured = true;
    if (search) filter.title = { $regex: search, $options: "i" };

    let q = Content.find(filter).sort({ createdAt: -1 });
    if (limit) q = q.limit(parseInt(limit, 10));

    const items = await q;
    res.json(items);
  } catch (err) {
    console.error("GET /content error:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// ══════════════════════════════════════════════════════
// RUTAS ADMIN (antes de /:id para evitar colisiones)
// ══════════════════════════════════════════════════════

/**
 * GET /api/content/admin/all
 * Todos los contenidos (incluye borradores). Solo admin.
 */
router.get("/admin/all", auth, adminOnly, async (req, res) => {
  try {
    const items = await Content.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("GET /content/admin/all error:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/**
 * POST /api/content
 * Crear contenido. Solo admin.
 */
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const {
      type,
      category,
      title,
      description,
      thumbnail,
      videoSource,
      videoUrl,
      youtubeInput,
      body,
      isFeatured,
      status,
    } = req.body;

    let youtubeId = null;
    let finalVideoUrl = videoUrl || null;

    if (type === "video" && videoSource === "youtube" && youtubeInput) {
      youtubeId = extractYoutubeId(youtubeInput);
      if (!youtubeId) {
        return res.status(400).json({
          error:
            "No se pudo extraer el ID del video de YouTube. Verifica el link o iframe.",
        });
      }
      finalVideoUrl = `https://www.youtube.com/embed/${youtubeId}`;
    }

    const content = new Content({
      type,
      category,
      title,
      description: description || "",
      thumbnail:
        thumbnail ||
        (youtubeId
          ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
          : ""),
      videoSource: type === "video" ? videoSource || "youtube" : null,
      videoUrl: finalVideoUrl,
      youtubeId,
      body: type === "article" ? body || "" : "",
      isFeatured: !!isFeatured,
      status: status || "published",
      createdBy: req.userId,
    });

    await content.save();
    res.status(201).json(content);
  } catch (err) {
    console.error("POST /content error:", err.message);
    res.status(500).json({ error: err.message || "Error en el servidor" });
  }
});

// ══════════════════════════════════════════════════════
// RUTAS CON PARÁMETRO /:id
// ══════════════════════════════════════════════════════

/**
 * GET /api/content/:id
 * Obtener contenido por ID (público). Incrementa vistas.
 */
router.get("/:id", async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item)
      return res.status(404).json({ error: "Contenido no encontrado" });

    // Incrementar vistas
    item.views = (item.views || 0) + 1;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error("GET /content/:id error:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

/**
 * PUT /api/content/:id
 * Actualizar contenido. Solo admin.
 */
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const updates = { ...req.body };

    // Re-procesar YouTube si se cambió
    if (updates.videoSource === "youtube" && updates.youtubeInput) {
      const ytId = extractYoutubeId(updates.youtubeInput);
      if (!ytId) {
        return res
          .status(400)
          .json({ error: "No se pudo extraer el ID de YouTube" });
      }
      updates.youtubeId = ytId;
      updates.videoUrl = `https://www.youtube.com/embed/${ytId}`;
      // Auto-fill thumbnail si está vacío
      if (!updates.thumbnail) {
        updates.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
      delete updates.youtubeInput;
    }

    const item = await Content.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!item) return res.status(404).json({ error: "No encontrado" });
    res.json(item);
  } catch (err) {
    console.error("PUT /content/:id error:", err.message);
    res.status(500).json({ error: err.message || "Error en el servidor" });
  }
});

/**
 * DELETE /api/content/:id
 * Eliminar contenido. Solo admin.
 */
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "No encontrado" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /content/:id error:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;
