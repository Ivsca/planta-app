// backend/src/routes/activity.routes.js
const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// Recomendado: npm i luxon
const { DateTime } = require("luxon");

const allowedTypes = new Set([
  "article_started",
  "article_completed",
  "routine_started",
  "routine_completed",
  "challenge_started",
  "challenge_completed",
  "quiz_submitted",
]);

const allowedRefTypes = new Set(["article", "routine", "challenge", "quiz"]);
const allowedInProgressRefTypes = new Set(["article", "routine", "challenge"]);

function bogotaLocalDateNow() {
  return DateTime.now().setZone("America/Bogota").toISODate(); // "YYYY-MM-DD"
}

function isCompletedType(type) {
  return typeof type === "string" && type.endsWith("_completed");
}

/**
 * Limpia inProgress cuando se completa algo
 * (si el inProgress actual coincide con el refId completado)
 */
function clearInProgressIfCompleted(user, type, refId) {
  if (!user.activity) user.activity = {};
  if (!user.activity.inProgress) user.activity.inProgress = {};

  const rid = String(refId);

  if (type === "article_completed") {
    const cur = user.activity.inProgress.article;
    if (cur?.refId && String(cur.refId) === rid) {
      user.activity.inProgress.article = {
        refId: null,
        lastSeenIndex: 0,
        furthestIndex: 0,
        updatedAt: new Date(),
      };
    }
  }

  if (type === "routine_completed") {
    const cur = user.activity.inProgress.routine;
    if (cur?.refId && String(cur.refId) === rid) {
      user.activity.inProgress.routine = {
        refId: null,
        step: 0,
        updatedAt: new Date(),
      };
    }
  }

  if (type === "challenge_completed") {
    const cur = user.activity.inProgress.challenge;
    if (cur?.refId && String(cur.refId) === rid) {
      user.activity.inProgress.challenge = {
        refId: null,
        progress: 0,
        updatedAt: new Date(),
      };
    }
  }
}

function ensureStats(user) {
  user.activity = user.activity || {};
  user.activity.stats = user.activity.stats || {};
  user.activity.stats.completed = user.activity.stats.completed || {};

  user.activity.stats.lastActiveLocalDate =
    user.activity.stats.lastActiveLocalDate ?? null;

  user.activity.stats.streakCurrent = Number(user.activity.stats.streakCurrent ?? 0);
  if (!Number.isFinite(user.activity.stats.streakCurrent) || user.activity.stats.streakCurrent < 0) {
    user.activity.stats.streakCurrent = 0;
  }

  user.activity.stats.streakBest = Number(user.activity.stats.streakBest ?? 0);
  if (!Number.isFinite(user.activity.stats.streakBest) || user.activity.stats.streakBest < 0) {
    user.activity.stats.streakBest = 0;
  }

  user.activity.stats.completed.article = Number(user.activity.stats.completed.article ?? 0);
  if (!Number.isFinite(user.activity.stats.completed.article) || user.activity.stats.completed.article < 0) {
    user.activity.stats.completed.article = 0;
  }

  user.activity.stats.completed.routine = Number(user.activity.stats.completed.routine ?? 0);
  if (!Number.isFinite(user.activity.stats.completed.routine) || user.activity.stats.completed.routine < 0) {
    user.activity.stats.completed.routine = 0;
  }

  user.activity.stats.completed.challenge = Number(user.activity.stats.completed.challenge ?? 0);
  if (!Number.isFinite(user.activity.stats.completed.challenge) || user.activity.stats.completed.challenge < 0) {
    user.activity.stats.completed.challenge = 0;
  }
}

function updateStreak(stats, todayLocalDate) {
  const last = stats.lastActiveLocalDate;

  // ya contó hoy
  if (last === todayLocalDate) return;

  const yesterday = DateTime.fromISO(todayLocalDate, { zone: "America/Bogota" })
    .minus({ days: 1 })
    .toISODate();

  if (last === yesterday) {
    stats.streakCurrent += 1;
  } else {
    stats.streakCurrent = 1;
  }

  stats.lastActiveLocalDate = todayLocalDate;
  stats.streakBest = Math.max(stats.streakBest, stats.streakCurrent);
}

function bumpCompleted(stats, type) {
  if (type === "article_completed") stats.completed.article += 1;
  if (type === "routine_completed") stats.completed.routine += 1;
  if (type === "challenge_completed") stats.completed.challenge += 1;
}

function hasMedal(user, id) {
  const medals = Array.isArray(user.activity?.medals) ? user.activity.medals : [];
  return medals.some((m) => m.id === id);
}

function grantMedal(user, id, meta = {}) {
  user.activity.medals = Array.isArray(user.activity.medals) ? user.activity.medals : [];
  if (!hasMedal(user, id)) {
    user.activity.medals.push({ id, earnedAt: new Date(), meta });
  }
}

function awardMedalsFromStats(user) {
  const s = user.activity.stats;

  // primeras veces
  if (s.completed.article >= 1) grantMedal(user, "FIRST_ARTICLE");
  if (s.completed.routine >= 1) grantMedal(user, "FIRST_ROUTINE");
  if (s.completed.challenge >= 1) grantMedal(user, "FIRST_CHALLENGE");

  // rachas
  if (s.streakCurrent >= 3) grantMedal(user, "STREAK_3");
  if (s.streakCurrent >= 7) grantMedal(user, "STREAK_7");

  // volumen
  if (s.completed.challenge >= 5) grantMedal(user, "CHALLENGES_5");
}

/**
 * GET /api/activity/me
 * Devuelve:
 * - inProgress (para botón "Continuar")
 * - events (últimos 20, ordenados desc por fecha)
 */
router.get("/me", auth, async (req, res) => {
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
});

/**
 * GET /api/activity/article/:id/in-progress
 * Devuelve progreso guardado para un artículo específico
 */
router.get("/article/:id/in-progress", auth, async (req, res) => {
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
});

/**
 * POST /api/activity/event
 * Body:
 * { type, refType, refId, meta? }
 *
 * Importante:
 * - Guarda el evento al inicio
 * - Recorta a 100 para que no crezca infinito
 * - Dedupe para *_completed (idempotencia)
 * - Si es *_completed: actualiza stats (racha/contadores) + medallas
 * - Si es *_completed, limpia inProgress correspondiente
 */
router.post("/event", auth, async (req, res) => {
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
    } else {
      // para started/quiz, igual podrías limpiar inProgress? NO. Solo completados.
      // Deja inProgress como está.
    }

    await user.save();
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error en POST /activity/event:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

/**
 * PATCH /api/activity/in-progress
 * Body:
 * { refType: "article"|"routine"|"challenge", refId, payload? }
 *
 * Guarda el "último punto" para continuar.
 */
router.patch("/in-progress", auth, async (req, res) => {
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
    console.error("❌ Error en PATCH /activity/in-progress:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;