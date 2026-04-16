// backend/src/models/Challenge.js
const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },

    /**
     * Categoría del reto.
     * - fitness:      actividad física (pasos, distancia, calorías)
     * - environment:  retos ambientales (autoreporte)
     * - wellness:     bienestar (respiración, meditación, sueño)
     */
    category: {
      type: String,
      enum: ["fitness", "environment", "wellness"],
      required: true,
    },

    /**
     * Cómo se verifica el reto:
     * - health_tracking: datos de Health Connect / Apple Health
     * - self_report:     el usuario marca manualmente (ej: "7 días sin plástico")
     * - timer:           temporizador interno de la app (ej: meditación 5 min)
     * - qr_scan:         escaneo de código QR en un punto físico
     */
    type: {
      type: String,
      enum: ["health_tracking", "self_report", "timer", "qr_scan"],
      required: true,
    },

    /**
     * Métrica de Health Connect / Apple Health.
     * Solo aplica cuando type === "health_tracking".
     * null para self_report y timer.
     */
    healthMetric: {
      type: String,
      enum: [
        "steps",           // Pasos
        "distance",        // Distancia (km)
        "calories",        // Calorías quemadas (kcal)
        "activeMinutes",   // Minutos activos
        "heartRate",       // Frecuencia cardíaca promedio (bpm)
        null,
      ],
      default: null,
    },

    /**
     * Valor numérico de la meta.
     * Ej: 1000 (pasos), 1.0 (km), 30 (minutos), 1 (self_report = 1 confirmación)
     */
    goalValue: {
      type: Number,
      required: true,
      min: 0,
    },

    /**
     * Unidad de medida legible para UI.
     */
    goalUnit: {
      type: String,
      required: true,
      trim: true,
      // Ej: "pasos", "km", "kcal", "min", "bpm", "días"
    },

    /**
     * Duración del reto en días.
     * 1 = solo hoy, 7 = reto semanal, 30 = reto mensual.
     */
    duration: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },

    /** Emoji o nombre de icono para UI */
    icon: {
      type: String,
      default: "🏆",
    },

    /** URL de imagen (thumbnail) */
    thumbnail: {
      type: String,
      default: "",
    },

    /** Configuración interna para retos de escaneo QR */
    qrConfig: {
      codeId: {
        type: String,
        default: null,
      },
      locationLabel: {
        type: String,
        default: "",
        trim: true,
      },
    },

    /** XP otorgados al completar el reto */
    xpReward: {
      type: Number,
      default: 50,
      min: 0,
    },

    /** Admin puede desactivar retos sin borrarlos */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /** Admin que creó el reto */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "challenges",
  }
);

module.exports = mongoose.model("Challenge", challengeSchema);
