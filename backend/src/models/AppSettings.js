// backend/src/models/AppSettings.js
const mongoose = require("mongoose");

/**
 * Documento singleton para configuraciones generales de la app.
 * Se garantiza unicidad mediante el campo `slug` con valor fijo "main".
 */
const appSettingsSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      default: "main",
      immutable: true,
      unique: true,
    },
    /** Meta de progreso general en la pantalla de logros */
    achievementsGoal: {
      type: Number,
      default: 50,
      min: 1,
    },
    /** Número de WhatsApp de soporte (con código de país, sin +) */
    whatsappNumber: {
      type: String,
      default: "573187767326",
      trim: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "app_settings",
  }
);

module.exports = mongoose.model("AppSettings", appSettingsSchema);
