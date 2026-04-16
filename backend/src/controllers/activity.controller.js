// backend/src/controllers/activity.controller.js
const User = require("../models/User");
const {
  allowedTypes,
  allowedRefTypes,
  allowedInProgressRefTypes,
  bogotaLocalDateNow,
  isCompletedType,
  ensureStats,
  updateStreak,
  bumpCompleted,
  awardMedalsFromStats,
  clearInProgressIfCompleted,
} = require("../helpers/activityHelpers");

/**
 * GET /api/activity/me
 * Devuelve inProgress + últimos 20 events
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("activity");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const events = (user.activity?.events || [])
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 20);

    return res.json({
      inProgress: user.activity?.inProgress || {},
      events,
    });
  } catch (err) {
    console.error("Error en GET /activity/me:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * GET /api/activity/article/:id/in-progress
 * Devuelve progreso guardado para un artículo específico
 */
exports.getArticleInProgress = async (req, res) => {
  try {
    const articleId = String(req.params.id || "").trim();
    if (!articleId) return res.status(400).json({ error: "id inválido" });

    const user = await User.findById(req.userId).select("activity");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const a = user.activity?.inProgress?.article;
    if (!a || String(a.refId || "").trim() !== articleId) {
      return res.json({ found: false, lastSeenIndex: 0, furthestIndex: 0 });
    }

    const lastSeen = Number(a.lastSeenIndex ?? 0);
    const furthest = Number(a.furthestIndex ?? 0);

    return res.json({
      found: true,
      lastSeenIndex: Number.isFinite(lastSeen) && lastSeen >= 0 ? lastSeen : 0,
      furthestIndex: Number.isFinite(furthest) && furthest >= 0 ? furthest : 0,
    });
  } catch (err) {
    console.error("Error en GET /activity/article/:id/in-progress:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * POST /api/activity/event
 * Body: { type, refType, refId, meta? }
 */
exports.postEvent = async (req, res) => {
  try {
    const { type, refType, refId, meta } = req.body || {};

    if (!type || !refType || !refId) {
      return res.status(400).json({
        error: "type, refType, refId son obligatorios",
      });
    }

    if (!allowedTypes.has(type)) {
      return res.status(400).json({ error: "type inválido" });
    }
    if (!allowedRefTypes.has(refType)) {
      return res.status(400).json({ error: "refType inválido" });
    }

    const user = await User.findById(req.userId).select("activity streak lastActiveDate");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.activity = user.activity || {};
    const current = Array.isArray(user.activity.events) ? user.activity.events : [];

    const todayLocalDate = bogotaLocalDateNow();

    // Idempotencia: evita duplicar completados por retries / doble tap
    if (isCompletedType(type)) {
      const already = current.some(
        (e) =>
          e.type === type &&
          e.refType === refType &&
          String(e.refId) === String(refId)
      );
      if (already) {
        return res.json({ ok: true, deduped: true });
      }
    }

    user.activity.events = [
      {
        type,
        refType,
        refId: String(refId),
        meta: meta || {},
        at: new Date(),
        localDate: todayLocalDate,
      },
      ...current,
    ].slice(0, 100);

    // Si completó algo, actualiza stats/medallas y limpia inProgress
    if (isCompletedType(type)) {
      ensureStats(user);
      updateStreak(user.activity.stats, todayLocalDate);
      bumpCompleted(user.activity.stats, type);
      awardMedalsFromStats(user);

      // compat legacy (si algún UI usa estos campos)
      user.streak = user.activity.stats.streakCurrent;
      user.lastActiveDate = new Date();

      clearInProgressIfCompleted(user, type, refId);
    }

    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error en POST /activity/event:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * PATCH /api/activity/in-progress
 * Body: { refType, refId, payload? }
 */
exports.patchInProgress = async (req, res) => {
  try {
    const { refType, refId, payload } = req.body || {};

    if (!refType || !refId) {
      return res.status(400).json({ error: "refType y refId son obligatorios" });
    }

    if (!allowedInProgressRefTypes.has(refType)) {
      return res.status(400).json({ error: "refType inválido para in-progress" });
    }

    const user = await User.findById(req.userId).select("activity");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    user.activity = user.activity || {};
    user.activity.inProgress = user.activity.inProgress || {};

    const updatedAt = new Date();

    if (refType === "article") {
      const incomingIndex = Number(payload?.slideIndex ?? 0);
      if (!Number.isFinite(incomingIndex) || incomingIndex < 0) {
        return res.status(400).json({ error: "slideIndex inválido" });
      }

      const prev = user.activity.inProgress.article || {};
      const prevFurthest = Number(prev.furthestIndex ?? 0);

      user.activity.inProgress.article = {
        refId: String(refId),
        lastSeenIndex: incomingIndex,
        furthestIndex: Math.max(
          Number.isFinite(prevFurthest) ? prevFurthest : 0,
          incomingIndex
        ),
        updatedAt,
      };
    }

    if (refType === "routine") {
      const step = Number(payload?.step ?? 0);
      if (!Number.isFinite(step) || step < 0) {
        return res.status(400).json({ error: "step inválido" });
      }

      user.activity.inProgress.routine = {
        refId: String(refId),
        step,
        updatedAt,
      };
    }

    if (refType === "challenge") {
      const progress = Number(payload?.progress ?? 0);
      if (!Number.isFinite(progress) || progress < 0) {
        return res.status(400).json({ error: "progress inválido" });
      }

      user.activity.inProgress.challenge = {
        refId: String(refId),
        progress,
        updatedAt,
      };
    }

    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error en PATCH /activity/in-progress:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
