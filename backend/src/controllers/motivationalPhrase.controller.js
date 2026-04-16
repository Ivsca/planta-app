// backend/src/controllers/motivationalPhrase.controller.js
const MotivationalPhrase = require("../models/MotivationalPhrase");

// ── GET /api/motivational-phrase ──────────────────────────────────────────────
// Pública. Devuelve la frase actual o 404 si aún no fue creada.
exports.getPhrase = async (req, res) => {
  try {
    const phrase = await MotivationalPhrase.findOne({ slug: "main" }).select(
      "-updatedBy -__v"
    );

    if (!phrase) {
      return res
        .status(404)
        .json({ error: "Aún no hay una frase motivacional configurada" });
    }

    return res.json(phrase);
  } catch (err) {
    console.error("Error en GET /api/motivational-phrase:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// ── POST /api/motivational-phrase ─────────────────────────────────────────────
// Solo admin. Crea la frase si todavía no existe; si ya existe, rechaza con 409.
exports.createPhrase = async (req, res) => {
  try {
    const exists = await MotivationalPhrase.findOne({ slug: "main" });
    if (exists) {
      return res.status(409).json({
        error:
          "Ya existe una frase motivacional. Usa el método PUT para actualizarla.",
      });
    }

    const { text, author } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "El campo 'text' es obligatorio" });
    }

    if (text.trim().length > 300) {
      return res
        .status(400)
        .json({ error: "La frase no puede superar los 300 caracteres" });
    }

    const phrase = await MotivationalPhrase.create({
      text: text.trim(),
      author: author?.trim() || "",
      updatedBy: req.userId,
    });

    return res.status(201).json(phrase);
  } catch (err) {
    console.error("Error en POST /api/motivational-phrase:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

// ── PUT /api/motivational-phrase ──────────────────────────────────────────────
// Solo admin. Actualiza la frase existente. Si aún no existe, devuelve 404.
exports.updatePhrase = async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "El campo 'text' es obligatorio" });
    }

    if (text.trim().length > 300) {
      return res
        .status(400)
        .json({ error: "La frase no puede superar los 300 caracteres" });
    }

    const phrase = await MotivationalPhrase.findOneAndUpdate(
      { slug: "main" },
      {
        text: text.trim(),
        author: author?.trim() ?? "",
        updatedBy: req.userId,
      },
      { new: true, runValidators: true }
    );

    if (!phrase) {
      return res.status(404).json({
        error:
          "No existe una frase motivacional. Créala primero con el método POST.",
      });
    }

    return res.json(phrase);
  } catch (err) {
    console.error("Error en PUT /api/motivational-phrase:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
