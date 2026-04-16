// backend/src/models/UserChallenge.js
const mongoose = require("mongoose");

/**
 * Log diario de datos de salud (Health Connect / Apple Health).
 * Un registro por día por UserChallenge.
 */
const DailyLogSchema = new mongoose.Schema(
  {
    /** Fecha normalizada "YYYY-MM-DD" */
    date: {
      type: String,
      required: true,
    },

    /** Valor registrado ese día (pasos, km, kcal, min, etc.) */
    value: {
      type: Number,
      required: true,
      min: 0,
    },

    /** Origen del dato */
    source: {
      type: String,
      enum: ["health_connect", "apple_health", "manual"],
      required: true,
    },

    /** Cuándo se sincronizó */
    syncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const userChallengeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },

    /**
     * Estado del reto para este usuario:
     * - in_progress: aceptado y en curso
     * - completed:   meta alcanzada
     * - failed:      expiró sin completar
     * - abandoned:   el usuario lo abandonó
     */
    status: {
      type: String,
      enum: ["in_progress", "completed", "failed", "abandoned"],
      default: "in_progress",
      index: true,
    },

    /**
     * Progreso acumulado.
     * Se recalcula como SUM(dailyLogs[].value) en health_tracking,
     * o se incrementa manualmente en self_report/timer.
     */
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },

    /**
     * Cache de goalValue del Challenge.
     * Evita populate en lecturas frecuentes (listados, cards).
     */
    goalValue: {
      type: Number,
      required: true,
      min: 0,
    },

    /** Datos diarios de Health Connect / Apple Health */
    dailyLogs: {
      type: [DailyLogSchema],
      default: [],
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    /**
     * Fecha de expiración.
     * startedAt + challenge.duration días.
     * null = sin expiración.
     */
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "user_challenges",
  }
);

/**
 * Índice compuesto: previene que un usuario acepte el mismo reto
 * dos veces mientras está in_progress.
 * (Puede re-iniciar un reto completado/abandonado creando un nuevo doc).
 */
userChallengeSchema.index({ userId: 1, challengeId: 1, status: 1 });

/** Índice para queries frecuentes: "mis retos activos" */
userChallengeSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("UserChallenge", userChallengeSchema);
