// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const activityRoutes = require("./routes/activity.routes");
const achievementsRoutes = require("./routes/achievements.routes");
const authRoutes = require("./routes/auth.routes");
const contentRouter = require("./routes/content.routes");
const adminRoutes = require("./routes/admin.routes");
const podcastRoutes = require("./routes/podcast.routes");
const challengeRoutes = require("./routes/challenge.routes");
const motivationalPhraseRoutes = require("./routes/motivationalPhrase.routes");
const settingsRoutes = require("./routes/settings.routes");
const notificationRoutes = require("./routes/notification.routes");
const { startExpireCron } = require("./jobs/expireChallenges");

  // para mirar documentacion swagger http://localhost:5000/api-docs 

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middlewares ── */
app.use(cors());
app.use(express.json());

/* ── Documentación Swagger ── */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ── Rutas ── */
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/content", contentRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/motivational-phrase", motivationalPhraseRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationRoutes);

/* ── Health check ── */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ── Conexión a MongoDB y arranque ── */
connectDB().then(() => {
  // app.listen(PORT, () => {
  //   console.log(`Backend corriendo en http://localhost:${PORT}`);
  // });

  app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend corriendo en http://0.0.0.0:${PORT}`);
  console.log("BOOT: backend/src/index.js LOADED");
  startExpireCron();
});

});
