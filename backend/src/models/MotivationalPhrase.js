// backend/src/models/MotivationalPhrase.js
const mongoose = require("mongoose");

/**
 * Documento singleton: solo existe uno en la colección.
 * Se garantiza mediante el campo `slug` con unique: true y valor fijo "main".
 * El admin puede crearlo una única vez y actualizarlo las veces que quiera.
 * No se permite eliminarlo.
 */
const motivationalPhraseSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      default: "main",
      immutable: true, // nunca cambia
      unique: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    author: {
      type: String,
      trim: true,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "motivational_phrase",
  }
);

module.exports = mongoose.model("MotivationalPhrase", motivationalPhraseSchema);
