// backend/src/controllers/settings.controller.js
const AppSettings = require("../models/AppSettings");

// ── GET /api/settings ─────────────────────────────────
// Pública. Devuelve la configuración actual (o valores por defecto).
exports.getSettings = async (req, res) => {
  try {
    let settings = await AppSettings.findOne({ slug: "main" }).select(
      "-updatedBy -__v"
    );

    if (!settings) {
      // Devolver valores por defecto sin crear en BD
      return res.json({ achievementsGoal: 50, whatsappNumber: "573187767326" });
    }

    return res.json({
      achievementsGoal: settings.achievementsGoal,
      whatsappNumber: settings.whatsappNumber,
      updatedAt: settings.updatedAt,
    });
  } catch (err) {
    console.error("Error en GET /api/settings:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// ── PUT /api/settings ─────────────────────────────────
// Solo admin. Crea o actualiza la configuración (upsert).
exports.updateSettings = async (req, res) => {
  try {
    const { achievementsGoal, whatsappNumber } = req.body;

    if (
      achievementsGoal === undefined ||
      achievementsGoal === null ||
      !Number.isFinite(Number(achievementsGoal))
    ) {
      return res
        .status(400)
        .json({ error: "El campo 'achievementsGoal' es obligatorio y debe ser un número" });
    }

    const goal = Number(achievementsGoal);
    if (goal < 1) {
      return res
        .status(400)
        .json({ error: "La meta debe ser al menos 1" });
    }

    const update = {
      achievementsGoal: goal,
      updatedBy: req.userId,
    };

    if (whatsappNumber !== undefined) {
      const cleaned = String(whatsappNumber).replace(/\D/g, "");
      if (!cleaned) {
        return res
          .status(400)
          .json({ error: "El número de WhatsApp no es válido" });
      }
      update.whatsappNumber = cleaned;
    }

    const settings = await AppSettings.findOneAndUpdate(
      { slug: "main" },
      update,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).select("-__v");

    return res.json({
      achievementsGoal: settings.achievementsGoal,
      whatsappNumber: settings.whatsappNumber,
      updatedAt: settings.updatedAt,
    });
  } catch (err) {
    console.error("Error en PUT /api/settings:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
