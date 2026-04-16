// backend/src/controllers/challenge.controller.js
const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const User = require("../models/User");
const { DateTime } = require("luxon");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const QRCode = require("qrcode");

const XP_PER_LEVEL = 100;
const QR_SCHEME = "plantaapp://challenge-qr";

// ── Helpers ────────────────────────────────────

function bogotaLocalDateNow() {
  return DateTime.now().setZone("America/Bogota").toISODate();
}

function makeQrCodeId() {
  return crypto.randomBytes(8).toString("hex");
}

function getQrSecret() {
  return process.env.QR_SECRET || process.env.JWT_SECRET;
}

function buildQrToken(challengeId, codeId) {
  const secret = getQrSecret();
  if (!secret) {
    throw new Error("QR_SECRET/JWT_SECRET no configurado");
  }

  return jwt.sign(
    {
      kind: "challenge_qr",
      challengeId: String(challengeId),
      codeId: String(codeId),
    },
    secret
  );
}

function buildQrValue(challengeId, codeId) {
  const token = buildQrToken(challengeId, codeId);
  return `${QR_SCHEME}?token=${encodeURIComponent(token)}`;
}

async function buildQrPayload(challenge) {
  const codeId = challenge?.qrConfig?.codeId;
  if (!codeId) throw new Error("Reto QR sin codeId");

  const qrValue = buildQrValue(challenge._id, codeId);
  const qrImageDataUrl = await QRCode.toDataURL(qrValue, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
  });

  return {
    challengeId: String(challenge._id),
    title: challenge.title,
    locationLabel: challenge?.qrConfig?.locationLabel || "",
    qrValue,
    qrImageDataUrl,
  };
}

function extractQrToken(scannedValue) {
  if (!scannedValue || typeof scannedValue !== "string") return null;
  const raw = scannedValue.trim();
  if (!raw) return null;

  if (raw.startsWith("eyJ")) return raw;

  try {
    const url = new URL(raw);
    const token = url.searchParams.get("token");
    if (token) return token;
  } catch {
    // noop
  }

  const tokenMatch = raw.match(/[?&]token=([^&]+)/i);
  if (tokenMatch?.[1]) {
    return decodeURIComponent(tokenMatch[1]);
  }

  return null;
}

function levelFromXp(totalXp) {
  const xp = Number(totalXp ?? 0);
  if (!Number.isFinite(xp) || xp <= 0) return 1;
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

/**
 * Recalcula progreso total a partir de dailyLogs.
 */
function recalcProgress(uc) {
  if (!Array.isArray(uc.dailyLogs) || uc.dailyLogs.length === 0) {
    uc.progress = 0;
    return;
  }
  uc.progress = uc.dailyLogs.reduce((sum, log) => sum + (log.value || 0), 0);
}

/**
 * Integración con el sistema de actividad existente.
 * Registra evento + actualiza stats + otorga medallas.
 */
async function triggerChallengeCompleted(userId, challengeId, meta = {}) {
  const challenge = await Challenge.findById(challengeId).select("xpReward").lean();
  const xpRewardRaw = Number(challenge?.xpReward ?? 0);
  const xpReward = Number.isFinite(xpRewardRaw) && xpRewardRaw > 0 ? xpRewardRaw : 0;

  const user = await User.findById(userId).select(
    "activity streak lastActiveDate xp level"
  );
  if (!user) return;

  user.activity = user.activity || {};
  user.activity.events = Array.isArray(user.activity.events)
    ? user.activity.events
    : [];
  user.activity.stats = user.activity.stats || {};
  user.activity.stats.completed = user.activity.stats.completed || {};

  const todayLocalDate = bogotaLocalDateNow();

  // Idempotencia: no duplicar evento si ya existe
  const already = user.activity.events.some(
    (e) =>
      e.type === "challenge_completed" &&
      e.refType === "challenge" &&
      String(e.refId) === String(challengeId)
  );
  if (already) return;

  user.xp = Number(user.xp ?? 0);
  if (!Number.isFinite(user.xp) || user.xp < 0) user.xp = 0;
  if (xpReward > 0) {
    user.xp += xpReward;
  }
  user.level = levelFromXp(user.xp);

  // Agregar evento
  user.activity.events = [
    {
      type: "challenge_completed",
      refType: "challenge",
      refId: String(challengeId),
      meta: {
        ...meta,
        xpAwarded: xpReward,
        totalXp: user.xp,
        level: user.level,
      },
      at: new Date(),
      localDate: todayLocalDate,
    },
    ...user.activity.events,
  ].slice(0, 100);

  // Actualizar stats
  const stats = user.activity.stats;
  stats.completed.challenge = (stats.completed.challenge || 0) + 1;

  // Streak
  const last = stats.lastActiveLocalDate;
  if (last !== todayLocalDate) {
    const yesterday = DateTime.fromISO(todayLocalDate, {
      zone: "America/Bogota",
    })
      .minus({ days: 1 })
      .toISODate();

    if (last === yesterday) {
      stats.streakCurrent = (stats.streakCurrent || 0) + 1;
    } else {
      stats.streakCurrent = 1;
    }
    stats.lastActiveLocalDate = todayLocalDate;
    stats.streakBest = Math.max(stats.streakBest || 0, stats.streakCurrent);
  }

  // Legacy compat
  user.streak = stats.streakCurrent;
  user.lastActiveDate = new Date();

  // Medallas
  user.activity.medals = Array.isArray(user.activity.medals)
    ? user.activity.medals
    : [];
  const hasMedal = (id) => user.activity.medals.some((m) => m.id === id);
  const grant = (id) => {
    if (!hasMedal(id)) {
      user.activity.medals.push({ id, earnedAt: new Date(), meta: {} });
    }
  };

  if (stats.completed.challenge >= 1) grant("FIRST_CHALLENGE");
  if (stats.completed.challenge >= 5) grant("CHALLENGES_5");
  if (stats.completed.challenge >= 10) grant("CHALLENGES_10");
  if (stats.streakCurrent >= 3) grant("STREAK_3");
  if (stats.streakCurrent >= 7) grant("STREAK_7");

  // Limpiar inProgress.challenge legacy (si coincide)
  if (user.activity.inProgress?.challenge?.refId === String(challengeId)) {
    user.activity.inProgress.challenge = {
      refId: null,
      progress: 0,
      updatedAt: new Date(),
    };
  }

  await user.save();

  return {
    xpAwarded: xpReward,
    totalXp: user.xp,
    level: user.level,
  };
}


// ═══════════════════════════════════════════════
// PUBLIC — Catálogo
// ═══════════════════════════════════════════════

/**
 * GET /api/challenges
 * Query: ?category=fitness&difficulty=easy&limit=20
 */
exports.getAll = async (req, res) => {
  try {
    const { category, difficulty, type, limit } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (type) filter.type = type;

    let q = Challenge.find(filter).sort({ createdAt: -1 });
    if (limit) q = q.limit(parseInt(limit, 10));

    const items = await q;
    res.json(items);
  } catch (err) {
    console.error("Error en GET /challenges:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * GET /api/challenges/:id
 */
exports.getById = async (req, res) => {
  try {
    const item = await Challenge.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Reto no encontrado" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ═══════════════════════════════════════════════
// ADMIN — CRUD
// ═══════════════════════════════════════════════

/**
 * GET /api/challenges/admin/all
 * Incluye retos inactivos.
 */
exports.getAllAdmin = async (req, res) => {
  try {
    const items = await Challenge.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * GET /api/challenges/admin/:id/qr
 * Devuelve el valor QR firmado + imagen (data URL) para retos tipo qr_scan.
 */
exports.getAdminQr = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Reto no encontrado" });
    if (challenge.type !== "qr_scan") {
      return res.status(400).json({ error: "Este reto no es de tipo qr_scan" });
    }

    if (!challenge.qrConfig?.codeId) {
      challenge.qrConfig = {
        codeId: makeQrCodeId(),
        locationLabel: challenge.qrConfig?.locationLabel || "",
      };
      await challenge.save();
    }

    const qr = await buildQrPayload(challenge);
    res.json(qr);
  } catch (err) {
    console.error("Error obteniendo QR admin:", err.message);
    res.status(500).json({ error: "Error al generar QR" });
  }
};

/**
 * POST /api/challenges
 * Body: { title, description, category, type, healthMetric, goalValue, goalUnit, duration, difficulty, icon, thumbnail, xpReward }
 */
exports.create = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      healthMetric,
      qrLocationLabel,
      goalValue,
      goalUnit,
      duration,
      difficulty,
      icon,
      thumbnail,
      xpReward,
    } = req.body;

    if (!title || !category || !type || goalValue == null || !goalUnit) {
      return res
        .status(400)
        .json({ error: "title, category, type, goalValue y goalUnit son obligatorios" });
    }

    if (type === "health_tracking" && !healthMetric) {
      return res
        .status(400)
        .json({ error: "healthMetric es obligatorio para retos de health_tracking" });
    }

    const isQrScan = type === "qr_scan";
    const qrConfig = isQrScan
      ? {
          codeId: makeQrCodeId(),
          locationLabel: String(qrLocationLabel || "").trim(),
        }
      : null;

    const challenge = await Challenge.create({
      title,
      description: description || "",
      category,
      type,
      healthMetric: type === "health_tracking" ? healthMetric : null,
      qrConfig,
      goalValue,
      goalUnit,
      duration: duration || 1,
      difficulty: difficulty || "easy",
      icon: icon || "🏆",
      thumbnail: thumbnail || "",
      xpReward: xpReward || 50,
      createdBy: req.userId,
    });

    if (isQrScan) {
      const qr = await buildQrPayload(challenge);
      return res.status(201).json({ ...challenge.toObject(), qr });
    }

    res.status(201).json(challenge);
  } catch (err) {
    console.error("Error creando reto:", err.message);
    res.status(500).json({ error: err.message || "Error al crear reto" });
  }
};

/**
 * PUT /api/challenges/:id
 */
exports.update = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      healthMetric,
      qrLocationLabel,
      goalValue,
      goalUnit,
      duration,
      difficulty,
      icon,
      thumbnail,
      xpReward,
      isActive,
    } = req.body;

    const current = await Challenge.findById(req.params.id);
    if (!current) return res.status(404).json({ error: "Reto no encontrado" });

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (type !== undefined) updates.type = type;
    if (healthMetric !== undefined) updates.healthMetric = healthMetric;
    if (goalValue !== undefined) updates.goalValue = goalValue;
    if (goalUnit !== undefined) updates.goalUnit = goalUnit;
    if (duration !== undefined) updates.duration = duration;
    if (difficulty !== undefined) updates.difficulty = difficulty;
    if (icon !== undefined) updates.icon = icon;
    if (thumbnail !== undefined) updates.thumbnail = thumbnail;
    if (xpReward !== undefined) updates.xpReward = xpReward;
    if (isActive !== undefined) updates.isActive = !!isActive;

    const nextType = type !== undefined ? type : current.type;
    if (nextType === "health_tracking" && healthMetric === undefined && !current.healthMetric) {
      return res
        .status(400)
        .json({ error: "healthMetric es obligatorio para retos de health_tracking" });
    }

    if (nextType === "qr_scan") {
      updates.healthMetric = null;
      updates.qrConfig = {
        codeId: current.qrConfig?.codeId || makeQrCodeId(),
        locationLabel:
          qrLocationLabel !== undefined
            ? String(qrLocationLabel || "").trim()
            : current.qrConfig?.locationLabel || "",
      };
    } else if (type !== undefined && type !== "qr_scan") {
      updates.qrConfig = null;
    }

    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!challenge) return res.status(404).json({ error: "Reto no encontrado" });

    if (challenge.type === "qr_scan") {
      const qr = await buildQrPayload(challenge);
      return res.json({ ...challenge.toObject(), qr });
    }

    res.json(challenge);
  } catch (err) {
    console.error("Error actualizando reto:", err.message);
    res.status(500).json({ error: err.message || "Error al actualizar reto" });
  }
};

/**
 * DELETE /api/challenges/:id
 */
exports.remove = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) return res.status(404).json({ error: "Reto no encontrado" });
    res.json({ message: "Reto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al eliminar reto" });
  }
};

// ═══════════════════════════════════════════════
// USER — Aceptar reto / Mis retos / Sync / Abandonar
// ═══════════════════════════════════════════════

/**
 * POST /api/challenges/:id/start
 * El usuario acepta un reto.
 * Crea un UserChallenge en estado in_progress.
 * Previene duplicados (no puede tener 2 in_progress del mismo reto).
 */
exports.start = async (req, res) => {
  try {
    const challengeId = req.params.id;
    const userId = req.userId;

    // Verificar que el reto existe y está activo
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) return res.status(404).json({ error: "Reto no encontrado" });
    if (!challenge.isActive) return res.status(400).json({ error: "Este reto no está disponible" });

    // Verificar que no tenga este reto ya in_progress
    const existing = await UserChallenge.findOne({
      userId,
      challengeId,
      status: "in_progress",
    });
    if (existing) {
      return res.status(409).json({
        error: "Ya tienes este reto en progreso",
        userChallenge: existing,
      });
    }

    // Calcular fecha de expiración
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + challenge.duration);

    const uc = await UserChallenge.create({
      userId,
      challengeId,
      status: "in_progress",
      progress: 0,
      goalValue: challenge.goalValue,
      dailyLogs: [],
      startedAt: now,
      expiresAt,
    });

    // Registrar evento challenge_started en activity del usuario
    try {
      const user = await User.findById(userId).select("activity");
      if (user) {
        user.activity = user.activity || {};
        user.activity.events = Array.isArray(user.activity.events)
          ? user.activity.events
          : [];

        user.activity.events = [
          {
            type: "challenge_started",
            refType: "challenge",
            refId: String(challengeId),
            meta: { title: challenge.title },
            at: now,
            localDate: bogotaLocalDateNow(),
          },
          ...user.activity.events,
        ].slice(0, 100);

        // Actualizar inProgress.challenge legacy
        user.activity.inProgress = user.activity.inProgress || {};
        user.activity.inProgress.challenge = {
          refId: String(challengeId),
          progress: 0,
          updatedAt: now,
        };

        await user.save();
      }
    } catch (err) {
      // No bloquear si falla el evento de actividad
      console.error("Error registrando challenge_started:", err.message);
    }

    res.status(201).json(uc);
  } catch (err) {
    console.error("Error en start challenge:", err.message);
    res.status(500).json({ error: "Error al aceptar el reto" });
  }
};

/**
 * GET /api/challenges/me
 * Devuelve los retos del usuario autenticado.
 * Query: ?status=in_progress | ?status=completed | (sin filtro = todos)
 *
 * Respuesta incluye datos del challenge (populate selectivo).
 */
exports.getMine = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;

    // Expirar retos vencidos on-the-fly para este usuario
    const now = new Date();
    await UserChallenge.updateMany(
      {
        userId,
        status: "in_progress",
        expiresAt: { $ne: null, $lte: now },
      },
      { $set: { status: "abandoned" } }
    );

    const filter = { userId };
    if (status) filter.status = status;

    const items = await UserChallenge.find(filter)
      .populate({
        path: "challengeId",
        select: "title description category type healthMetric qrConfig goalValue goalUnit duration difficulty icon thumbnail xpReward",
      })
      .sort({ updatedAt: -1 });

    // Formatear respuesta para frontend
    const result = items
      .filter((uc) => uc.challengeId) // Filtrar retos eliminados
      .map((uc) => ({
        _id: uc._id,
        challenge: uc.challengeId,
        status: uc.status,
        progress: uc.progress,
        goalValue: uc.goalValue,
        dailyLogs: uc.dailyLogs,
        startedAt: uc.startedAt,
        completedAt: uc.completedAt,
        expiresAt: uc.expiresAt,
        updatedAt: uc.updatedAt,
      }));

    res.json(result);
  } catch (err) {
    console.error("Error en getMine:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/**
 * PATCH /api/challenges/me/:ucId/sync
 * Sincronizar datos de Health Connect / Apple Health.
 *
 * Body: { date: "YYYY-MM-DD", value: 4523, source: "health_connect" }
 *
 * - Upsert: si ya hay un log para esa fecha, lo reemplaza.
 * - Recalcula progreso total.
 * - Si progress >= goalValue → marca completado + dispara evento.
 */
exports.sync = async (req, res) => {
  try {
    const { ucId } = req.params;
    const userId = req.userId;
    const { date, value, source } = req.body;

    // Validaciones
    if (!date || value == null || !source) {
      return res
        .status(400)
        .json({ error: "date, value y source son obligatorios" });
    }

    // Validar formato de fecha
    const parsedDate = DateTime.fromISO(date, { zone: "America/Bogota" });
    if (!parsedDate.isValid) {
      return res.status(400).json({ error: "Formato de fecha inválido (YYYY-MM-DD)" });
    }

    const numValue = Number(value);
    if (!Number.isFinite(numValue) || numValue < 0) {
      return res.status(400).json({ error: "value debe ser un número >= 0" });
    }

    const validSources = ["health_connect", "apple_health", "manual"];
    if (!validSources.includes(source)) {
      return res.status(400).json({ error: "source inválido" });
    }

    // Buscar UserChallenge
    const uc = await UserChallenge.findOne({
      _id: ucId,
      userId,
      status: "in_progress",
    });

    if (!uc) {
      return res.status(404).json({ error: "Reto no encontrado o ya completado" });
    }

    // Upsert daily log: si ya hay un log para esa fecha, reemplazarlo
    const normalizedDate = parsedDate.toISODate(); // "YYYY-MM-DD"
    const existingIdx = uc.dailyLogs.findIndex(
      (log) => log.date === normalizedDate
    );

    const logEntry = {
      date: normalizedDate,
      value: numValue,
      source,
      syncedAt: new Date(),
    };

    if (existingIdx >= 0) {
      uc.dailyLogs[existingIdx] = logEntry;
    } else {
      uc.dailyLogs.push(logEntry);
    }

    // Recalcular progreso
    recalcProgress(uc);

    // ¿Meta cumplida?
    let justCompleted = false;
    if (uc.progress >= uc.goalValue && uc.status === "in_progress") {
      uc.status = "completed";
      uc.completedAt = new Date();
      justCompleted = true;
    }

    await uc.save();

    // Si acaba de completar, disparar evento en el sistema de actividad
    let reward = null;
    if (justCompleted) {
      try {
        reward = await triggerChallengeCompleted(userId, uc.challengeId, {
          progress: uc.progress,
          goalValue: uc.goalValue,
        });
      } catch (err) {
        // No bloquear si falla el evento
        console.error("Error en triggerChallengeCompleted:", err.message);
      }
    }

    res.json({
      ok: true,
      progress: uc.progress,
      goalValue: uc.goalValue,
      status: uc.status,
      justCompleted,
      xpAwarded: reward?.xpAwarded || 0,
      totalXp: reward?.totalXp,
      level: reward?.level,
    });
  } catch (err) {
    console.error("Error en sync:", err.message);
    res.status(500).json({ error: "Error al sincronizar datos" });
  }
};

/**
 * PATCH /api/challenges/me/:ucId/sync-bulk
 * Sincronizar múltiples días a la vez (más eficiente para Health Connect).
 *
 * Body: { logs: [{ date, value, source }, ...] }
 */
exports.syncBulk = async (req, res) => {
  try {
    const { ucId } = req.params;
    const userId = req.userId;
    const { logs } = req.body;

    if (!Array.isArray(logs) || logs.length === 0) {
      return res.status(400).json({ error: "logs debe ser un array no vacío" });
    }

    if (logs.length > 90) {
      return res.status(400).json({ error: "Máximo 90 registros por sync" });
    }

    const uc = await UserChallenge.findOne({
      _id: ucId,
      userId,
      status: "in_progress",
    });

    if (!uc) {
      return res.status(404).json({ error: "Reto no encontrado o ya completado" });
    }

    // Procesar cada log
    for (const entry of logs) {
      const { date, value, source } = entry;
      if (!date || value == null || !source) continue;

      const parsed = DateTime.fromISO(date, { zone: "America/Bogota" });
      if (!parsed.isValid) continue;

      const numVal = Number(value);
      if (!Number.isFinite(numVal) || numVal < 0) continue;

      const normalizedDate = parsed.toISODate();
      const idx = uc.dailyLogs.findIndex((l) => l.date === normalizedDate);

      const logEntry = {
        date: normalizedDate,
        value: numVal,
        source,
        syncedAt: new Date(),
      };

      if (idx >= 0) {
        uc.dailyLogs[idx] = logEntry;
      } else {
        uc.dailyLogs.push(logEntry);
      }
    }

    recalcProgress(uc);

    let justCompleted = false;
    if (uc.progress >= uc.goalValue && uc.status === "in_progress") {
      uc.status = "completed";
      uc.completedAt = new Date();
      justCompleted = true;
    }

    await uc.save();

    let reward = null;
    if (justCompleted) {
      try {
        reward = await triggerChallengeCompleted(userId, uc.challengeId, {
          progress: uc.progress,
          goalValue: uc.goalValue,
        });
      } catch (err) {
        console.error("Error en triggerChallengeCompleted:", err.message);
      }
    }

    res.json({
      ok: true,
      progress: uc.progress,
      goalValue: uc.goalValue,
      status: uc.status,
      justCompleted,
      logsCount: uc.dailyLogs.length,
      xpAwarded: reward?.xpAwarded || 0,
      totalXp: reward?.totalXp,
      level: reward?.level,
    });
  } catch (err) {
    console.error("Error en syncBulk:", err.message);
    res.status(500).json({ error: "Error al sincronizar datos" });
  }
};

/**
 * PATCH /api/challenges/me/:ucId/report
 * Para retos tipo "self_report" — el usuario confirma manualmente.
 *
 * Body: { value?: 1 }  (default: incrementa progress en 1)
 */
exports.report = async (req, res) => {
  try {
    const { ucId } = req.params;
    const userId = req.userId;
    const increment = Number(req.body.value ?? 1);

    if (!Number.isFinite(increment) || increment <= 0) {
      return res.status(400).json({ error: "value debe ser un número > 0" });
    }

    const uc = await UserChallenge.findOne({
      _id: ucId,
      userId,
      status: "in_progress",
    });

    if (!uc) {
      return res.status(404).json({ error: "Reto no encontrado o ya completado" });
    }

    // Registrar como log del día
    const todayDate = bogotaLocalDateNow();
    const idx = uc.dailyLogs.findIndex((l) => l.date === todayDate);
    const logEntry = {
      date: todayDate,
      value: increment,
      source: "manual",
      syncedAt: new Date(),
    };

    if (idx >= 0) {
      // Sumar al valor existente del día
      uc.dailyLogs[idx].value += increment;
      uc.dailyLogs[idx].syncedAt = new Date();
    } else {
      uc.dailyLogs.push(logEntry);
    }

    recalcProgress(uc);

    let justCompleted = false;
    if (uc.progress >= uc.goalValue && uc.status === "in_progress") {
      uc.status = "completed";
      uc.completedAt = new Date();
      justCompleted = true;
    }

    await uc.save();

    let reward = null;
    if (justCompleted) {
      try {
        reward = await triggerChallengeCompleted(userId, uc.challengeId, {
          progress: uc.progress,
          goalValue: uc.goalValue,
        });
      } catch (err) {
        console.error("Error en triggerChallengeCompleted:", err.message);
      }
    }

    res.json({
      ok: true,
      progress: uc.progress,
      goalValue: uc.goalValue,
      status: uc.status,
      justCompleted,
      xpAwarded: reward?.xpAwarded || 0,
      totalXp: reward?.totalXp,
      level: reward?.level,
    });
  } catch (err) {
    console.error("Error en report:", err.message);
    res.status(500).json({ error: "Error al reportar progreso" });
  }
};

/**
 * PATCH /api/challenges/me/:ucId/scan
 * Completa un reto tipo qr_scan validando un token QR firmado.
 *
 * Body: { scannedValue: string }
 */
exports.scan = async (req, res) => {
  try {
    const { ucId } = req.params;
    const userId = req.userId;
    const scannedValue = String(req.body?.scannedValue || "").trim();

    if (!scannedValue) {
      return res.status(400).json({ error: "scannedValue es obligatorio" });
    }

    const uc = await UserChallenge.findOne({
      _id: ucId,
      userId,
      status: "in_progress",
    }).populate({
      path: "challengeId",
      select: "type qrConfig goalValue",
    });

    if (!uc || !uc.challengeId) {
      return res.status(404).json({ error: "Reto no encontrado o ya completado" });
    }

    const challenge = uc.challengeId;
    if (challenge.type !== "qr_scan") {
      return res.status(400).json({ error: "Este reto no es de escaneo QR" });
    }

    if (!challenge.qrConfig?.codeId) {
      return res.status(400).json({ error: "Este reto QR no tiene código configurado" });
    }

    const token = extractQrToken(scannedValue);
    if (!token) {
      return res.status(400).json({ error: "Código QR inválido" });
    }

    const secret = getQrSecret();
    if (!secret) {
      return res.status(500).json({ error: "QR_SECRET/JWT_SECRET no configurado" });
    }

    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return res.status(400).json({ error: "Código QR inválido o expirado" });
    }

    if (
      decoded?.kind !== "challenge_qr" ||
      String(decoded?.challengeId) !== String(challenge._id) ||
      String(decoded?.codeId) !== String(challenge.qrConfig.codeId)
    ) {
      return res.status(400).json({ error: "El QR no corresponde a este reto" });
    }

    uc.status = "completed";
    uc.completedAt = new Date();
    uc.progress = uc.goalValue;
    await uc.save();

    let reward = null;
    try {
      reward = await triggerChallengeCompleted(userId, challenge._id, {
        method: "qr_scan",
        progress: uc.progress,
        goalValue: uc.goalValue,
      });
    } catch (err) {
      console.error("Error en triggerChallengeCompleted (scan):", err.message);
    }

    return res.json({
      ok: true,
      progress: uc.progress,
      goalValue: uc.goalValue,
      status: uc.status,
      justCompleted: true,
      xpAwarded: reward?.xpAwarded || 0,
      totalXp: reward?.totalXp,
      level: reward?.level,
    });
  } catch (err) {
    console.error("Error en scan QR:", err.message);
    return res.status(500).json({ error: "Error al validar el QR" });
  }
};

/**
 * PATCH /api/challenges/me/:ucId/abandon
 * El usuario abandona un reto en progreso.
 */
exports.abandon = async (req, res) => {
  try {
    const { ucId } = req.params;
    const userId = req.userId;

    const uc = await UserChallenge.findOneAndUpdate(
      { _id: ucId, userId, status: "in_progress" },
      { status: "abandoned" },
      { new: true }
    );

    if (!uc) {
      return res.status(404).json({ error: "Reto no encontrado o ya finalizado" });
    }

    // Limpiar inProgress.challenge legacy
    try {
      await User.findByIdAndUpdate(userId, {
        "activity.inProgress.challenge": {
          refId: null,
          progress: 0,
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      console.error("Error limpiando inProgress:", err.message);
    }

    res.json({ ok: true, status: "abandoned" });
  } catch (err) {
    console.error("Error en abandon:", err.message);
    res.status(500).json({ error: "Error al abandonar reto" });
  }
};
