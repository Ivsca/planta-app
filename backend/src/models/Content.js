// backend/src/models/Content.js
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["video", "article"],
      required: true,
    },
    category: {
      type: String,
      enum: ["environment", "fitness", "routine", "challenges"],
      required: true,
    },
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
    thumbnail: {
      type: String,
      default: "",
    },

    // ── Video fields ──
    videoSource: {
      type: String,
      enum: ["youtube", "url"],
      default: null,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    youtubeId: {
      type: String,
      default: null,
    },

    // ── Article fields ──
    body: {
      type: String,
      default: "",
    },

    // ── Meta ──
    views: { type: Number, default: 0 },
    isNew: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "contents",
  }
);

module.exports = mongoose.model("Content", contentSchema);
