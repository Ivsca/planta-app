// backend/src/jobs/expireChallenges.js
const cron = require("node-cron");
const UserChallenge = require("../models/UserChallenge");

/**
 * Marca como "abandoned" los retos in_progress cuyo expiresAt ya pasó.
 */
async function expireOverdueChallenges() {
  try {
    const now = new Date();

    const result = await UserChallenge.updateMany(
      {
        status: "in_progress",
        expiresAt: { $ne: null, $lte: now },
      },
      { $set: { status: "abandoned" } }
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[CRON] ${result.modifiedCount} reto(s) marcado(s) como abandonado(s) por expiración.`
      );
    }
  } catch (err) {
    console.error("[CRON] Error al expirar retos:", err.message);
  }
}

/**
 * Inicia el cron: revisa cada minuto si hay retos vencidos.
 */
function startExpireCron() {
  cron.schedule("* * * * *", expireOverdueChallenges);
  console.log("[CRON] Job de expiración de retos iniciado (cada minuto).");
}

module.exports = { startExpireCron };
