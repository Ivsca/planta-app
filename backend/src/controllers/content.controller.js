const Content = require("../models/Content");
const User = require("../models/User");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");
const deleteFromCloudinary = require("../helpers/deleteFromCloudinary");
const { DateTime } = require("luxon");

// ── Helpers ────────────────────────────────────

function extractYoutubeId(input) {
  if (!input) return null;

  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  const url = iframeMatch ? iframeMatch[1] : input.trim();

  let m;

  m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  m = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];

  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

  return null;
}

function bogotaLocalDateNow() {
  return DateTime.now().setZone("America/Bogota").toISODate();
}

/**
 * Registra article_completed en activity del usuario.
 * Idempotente: no duplica si ya completó ese artículo antes.
 */
async function triggerArticleCompleted(userId, articleId, meta = {}) {
  const user = await User.findById(userId).select("activity");
  if (!user) return null;

  user.activity = user.activity || {};
  user.activity.events = Array.isArray(user.activity.events)
    ? user.activity.events
    : [];
  user.activity.stats = user.activity.stats || {};
  user.activity.stats.completed = user.activity.stats.completed || {};
  user.activity.medals = Array.isArray(user.activity.medals)
    ? user.activity.medals
    : [];

  const todayLocalDate = bogotaLocalDateNow();

  const already = user.activity.events.some(
    (e) =>
      e.type === "article_completed" &&
      e.refType === "article" &&
      String(e.refId) === String(articleId)
  );

  if (already) {
    return {
      alreadyCompleted: true,
      completedArticles: user.activity.stats.completed.article || 0,
    };
  }

  user.activity.events = [
    {
      type: "article_completed",
      refType: "article",
      refId: String(articleId),
      meta,
      at: new Date(),
      localDate: todayLocalDate,
    },
    ...user.activity.events,
  ].slice(0, 100);

  const stats = user.activity.stats;
  stats.completed.article = (stats.completed.article || 0) + 1;

  const hasMedal = (id) => user.activity.medals.some((m) => m.id === id);
  const grant = (id) => {
    if (!hasMedal(id)) {
      user.activity.medals.push({
        id,
        earnedAt: new Date(),
        meta: {},
      });
    }
  };

  if (stats.completed.article >= 1) {
    grant("FIRST_ARTICLE");
  }

  if (user.activity.inProgress?.article?.refId === String(articleId)) {
    user.activity.inProgress.article = {
      refId: null,
      lastSeenIndex: 0,
      furthestIndex: 0,
      updatedAt: new Date(),
    };
  }

  await user.save();

  return {
    alreadyCompleted: false,
    completedArticles: stats.completed.article,
  };
}

/**
 * Registra routine_completed en activity del usuario.
 * Idempotente: no duplica si ya completó esa rutina antes.
 */
async function triggerRoutineCompleted(userId, routineId, meta = {}) {
  const user = await User.findById(userId).select("activity");
  if (!user) return null;

  user.activity = user.activity || {};
  user.activity.events = Array.isArray(user.activity.events)
    ? user.activity.events
    : [];
  user.activity.stats = user.activity.stats || {};
  user.activity.stats.completed = user.activity.stats.completed || {};
  user.activity.medals = Array.isArray(user.activity.medals)
    ? user.activity.medals
    : [];

  const todayLocalDate = bogotaLocalDateNow();

  const already = user.activity.events.some(
    (e) =>
      e.type === "routine_completed" &&
      e.refType === "routine" &&
      String(e.refId) === String(routineId)
  );

  if (already) {
    return {
      alreadyCompleted: true,
      completedRoutines: user.activity.stats.completed.routine || 0,
    };
  }

  user.activity.events = [
    {
      type: "routine_completed",
      refType: "routine",
      refId: String(routineId),
      meta,
      at: new Date(),
      localDate: todayLocalDate,
    },
    ...user.activity.events,
  ].slice(0, 100);

  const stats = user.activity.stats;
  stats.completed.routine = (stats.completed.routine || 0) + 1;

  const hasMedal = (id) => user.activity.medals.some((m) => m.id === id);
  const grant = (id) => {
    if (!hasMedal(id)) {
      user.activity.medals.push({
        id,
        earnedAt: new Date(),
        meta: {},
      });
    }
  };

  if (stats.completed.routine >= 1) {
    grant("FIRST_ROUTINE");
  }

  if (user.activity.inProgress?.routine?.refId === String(routineId)) {
    user.activity.inProgress.routine = {
      refId: null,
      step: 0,
      updatedAt: new Date(),
    };
  }

  await user.save();

  return {
    alreadyCompleted: false,
    completedRoutines: stats.completed.routine,
  };
}

// ═══════════════════════════════════════════════
// PUBLIC
// ═══════════════════════════════════════════════

exports.getPublished = async (req, res) => {
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
    console.error("Error en getPublished:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    item.views = (item.views || 0) + 1;
    await item.save();

    res.json(item);
  } catch (err) {
    console.error("Error en getById:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * POST /api/content/:id/complete
 * Marca un contenido como completado para el usuario autenticado.
 *
 * Reglas:
 * - article -> completed.article
 * - video + category=routine -> completed.routine
 * - cualquier otro contenido -> 400
 */
exports.completeContent = async (req, res) => {
  try {
    const contentId = req.params.id;

    const item = await Content.findById(contentId).select("type title category");
    if (!item) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    let result = null;

    if (item.type === "article") {
      result = await triggerArticleCompleted(req.userId, contentId, {
        title: item.title,
        category: item.category,
      });

      return res.json({
        ok: true,
        contentKind: "article",
        alreadyCompleted: !!result?.alreadyCompleted,
        completedArticles: result?.completedArticles ?? 0,
      });
    }

    if (item.type === "video" && item.category === "routine") {
      result = await triggerRoutineCompleted(req.userId, contentId, {
        title: item.title,
        category: item.category,
      });

      return res.json({
        ok: true,
        contentKind: "routine",
        alreadyCompleted: !!result?.alreadyCompleted,
        completedRoutines: result?.completedRoutines ?? 0,
      });
    }

    return res.status(400).json({
      error: "Este contenido no se puede marcar como completado",
    });
  } catch (err) {
    console.error("Error en completeContent:", err.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.getCompletionStatus = async (req, res) => {
  try {
    const contentId = req.params.id;

    const item = await Content.findById(contentId).select("type category");
    if (!item) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    const user = await User.findById(req.userId).select("activity.events");
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const events = Array.isArray(user.activity?.events) ? user.activity.events : [];

    if (item.type === "article") {
      const completed = events.some(
        (e) =>
          e.type === "article_completed" &&
          e.refType === "article" &&
          String(e.refId) === String(contentId)
      );

      return res.json({
        ok: true,
        completed,
        contentKind: "article",
      });
    }

    if (item.type === "video" && item.category === "routine") {
      const completed = events.some(
        (e) =>
          e.type === "routine_completed" &&
          e.refType === "routine" &&
          String(e.refId) === String(contentId)
      );

      return res.json({
        ok: true,
        completed,
        contentKind: "routine",
      });
    }

    return res.json({
      ok: true,
      completed: false,
      contentKind: "unsupported",
    });
  } catch (err) {
    console.error("Error en getCompletionStatus:", err.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// ═══════════════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════════════

exports.getAllAdmin = async (req, res) => {
  try {
    const items = await Content.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error en getAllAdmin:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.createContent = async (req, res) => {
  try {
    let videoCloudinaryId = null;
    let body;

    if (req.body.data) {
      body =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    } else if (req.body.type && req.body.title) {
      body = req.body;
    } else {
      console.error("Body no reconocido:", req.body);
      return res.status(400).json({ error: "No se recibieron datos válidos" });
    }

    let videoUrl = body.videoUrl || null;
    let youtubeId = null;

    if (
      body.type === "video" &&
      body.videoSource === "youtube" &&
      body.youtubeInput
    ) {
      youtubeId = extractYoutubeId(body.youtubeInput);
    }

    if (
      body.type === "video" &&
      body.videoSource === "upload" &&
      req.file
    ) {
      const result = await uploadToCloudinary(
        req.file.path,
        "video",
        "content/videos"
      );
      videoUrl = result.secure_url;
      videoCloudinaryId = result.public_id;
    }

    const content = await Content.create({
      type: body.type,
      category: body.category,
      title: body.title,
      description: body.description || "",
      thumbnail: body.thumbnail || "",
      videoSource: body.type === "video" ? body.videoSource : null,
      videoUrl,
      videoCloudinaryId,
      youtubeId,
      body: body.body || "",
      isFeatured: body.isFeatured || false,
      status: body.status || "published",
    });

    res.status(201).json(content);
  } catch (error) {
    console.error("Error creando contenido:", error);
    res.status(500).json({
      error: error.message || "Error al crear contenido",
    });
  }
};

exports.updateContent = async (req, res) => {
  try {
    let body;

    if (req.body.data) {
      body =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    } else if (req.body.type && req.body.title) {
      body = req.body;
    } else {
      return res.status(400).json({ error: "No se recibieron datos válidos" });
    }

    const updates = {
      type: body.type,
      category: body.category,
      title: body.title,
      description: body.description || "",
      thumbnail: body.thumbnail || "",
      videoSource: body.type === "video" ? body.videoSource : null,
      body: body.body || "",
      isFeatured: body.isFeatured || false,
      status: body.status || "published",
    };

    if (
      body.type === "video" &&
      body.videoSource === "youtube" &&
      body.youtubeInput
    ) {
      const oldContent = await Content.findById(req.params.id);

      if (oldContent?.videoCloudinaryId) {
        await deleteFromCloudinary(oldContent.videoCloudinaryId, "video");
      }

      updates.youtubeId = extractYoutubeId(body.youtubeInput);
      updates.videoUrl = null;
      updates.videoCloudinaryId = null;
    }

    if (
      body.type === "video" &&
      body.videoSource === "upload" &&
      req.file
    ) {
      const oldContent = await Content.findById(req.params.id);

      if (oldContent?.videoCloudinaryId) {
        await deleteFromCloudinary(oldContent.videoCloudinaryId, "video");
      }

      const result = await uploadToCloudinary(
        req.file.path,
        "video",
        "content/videos"
      );
      updates.videoUrl = result.secure_url;
      updates.youtubeId = null;
      updates.videoCloudinaryId = result.public_id;
    } else if (
      body.type === "video" &&
      body.videoSource === "upload" &&
      !req.file
    ) {
      updates.videoUrl = body.videoUrl || undefined;
      updates.youtubeId = null;
    }

    const content = await Content.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!content) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    res.json(content);
  } catch (error) {
    console.error("Error actualizando contenido:", error);
    res.status(500).json({
      error: error.message || "Error al actualizar contenido",
    });
  }
};

exports.deleteContent = async (req, res) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);
    if (!content) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    if (content.videoCloudinaryId) {
      await deleteFromCloudinary(content.videoCloudinaryId, "video");
    }

    res.json({ message: "Contenido eliminado" });
  } catch (error) {
    console.error("Error eliminando contenido:", error);
    res.status(500).json({ error: error.message || "Error al eliminar" });
  }
};

// ═══════════════════════════════════════════════
// TOGGLE SAVE CONTENT
// ═══════════════════════════════════════════════
exports.toggleSaveContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = req.userId;

    const content = await Content.findById(contentId);
    if (!content) {
      return res.status(404).json({ error: "Contenido no encontrado" });
    }

    const user = await User.findById(userId).select("savedContent");
    const idx = user.savedContent.findIndex(
      (id) => id.toString() === contentId
    );

    if (idx >= 0) {
      user.savedContent.splice(idx, 1);
    } else {
      user.savedContent.push(contentId);
    }

    await user.save();

    return res.json({
      saved: idx < 0,
      savedContent: user.savedContent,
    });
  } catch (error) {
    console.error("Error toggle save content:", error);
    res.status(500).json({ error: "Error al guardar contenido" });
  }
};

// ═══════════════════════════════════════════════
// GET SAVED CONTENT
// ═══════════════════════════════════════════════
exports.getSavedContent = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId)
      .select("savedContent")
      .populate("savedContent");

    return res.json({ items: user.savedContent || [] });
  } catch (error) {
    console.error("Error getting saved content:", error);
    res.status(500).json({ error: "Error al obtener contenido guardado" });
  }
};