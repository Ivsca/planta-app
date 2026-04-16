// backend/src/helpers/activityHelpers.js
const { DateTime } = require("luxon");

// ── Constantes ──────────────────────────────────

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

// ── Helpers de fecha ────────────────────────────

function bogotaLocalDateNow() {
  return DateTime.now().setZone("America/Bogota").toISODate(); // "YYYY-MM-DD"
}

// ── Helpers de tipo ─────────────────────────────

function isCompletedType(type) {
  return typeof type === "string" && type.endsWith("_completed");
}

// ── Stats ───────────────────────────────────────

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

// ── Racha (streak) ──────────────────────────────

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

// ── Contadores de completados ───────────────────

function bumpCompleted(stats, type) {
  if (type === "article_completed") stats.completed.article += 1;
  if (type === "routine_completed") stats.completed.routine += 1;
  if (type === "challenge_completed") stats.completed.challenge += 1;
}

// ── Medallas ────────────────────────────────────

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

// ── Limpiar inProgress al completar ─────────────

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

module.exports = {
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
};
