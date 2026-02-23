// backend/src/routes/achievements.routes.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

/**
 * GET /api/achievements/summary
 * Devuelve resumen de logros:
 * - racha (current/best)
 * - completados (article/routine/challenge)
 * - medallas
 * - retos completados recientes (de events)
 */
router.get("/summary", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("activity");
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const stats = user.activity?.stats || {
      lastActiveLocalDate: null,
      streakCurrent: 0,
      streakBest: 0,
      completed: { article: 0, routine: 0, challenge: 0 },
    };

    const medals = Array.isArray(user.activity?.medals) ? user.activity.medals : [];

    const events = Array.isArray(user.activity?.events) ? user.activity.events : [];
    const recentChallenges = events
      .filter((e) => e.type === "challenge_completed")
      .slice()
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 5)
      .map((e) => ({
        refId: e.refId,
        at: e.at,
        meta: e.meta || {},
      }));

    return res.json({
      streak: {
        current: stats.streakCurrent || 0,
        best: stats.streakBest || 0,
        lastActiveLocalDate: stats.lastActiveLocalDate || null,
      },
      progress: {
        completed: {
          article: stats.completed?.article || 0,
          routine: stats.completed?.routine || 0,
          challenge: stats.completed?.challenge || 0,
        },
      },
      challenges: {
        completedCount: stats.completed?.challenge || 0,
        recent: recentChallenges,
      },
      medals,
    });
  } catch (err) {
    console.error("Error en GET /achievements/summary:", err?.message);
    return res.status(500).json({ error: "Error en el servidor" });
  }
});

module.exports = router;