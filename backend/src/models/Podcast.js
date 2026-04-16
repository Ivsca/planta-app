const mongoose = require("mongoose");

const podcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    audioUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },

    imageUrl: { type: String, default: null },
    imageCloudinaryId: { type: String, default: null },

    format: { type: String, default: "audio/mp4" },
    duration: { type: Number },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Podcast", podcastSchema);