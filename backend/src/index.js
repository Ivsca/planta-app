require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const activityRoutes = require("./routes/activity.routes");
const achievementsRoutes = require("./routes/achievements.routes");
const authRoutes = require("./routes/auth.routes");
const contentRoutes = require("./routes/content.routes");

const app = express();
const PORT = process.env.PORT || 5000;

/* ── Middlewares ── */
app.use(cors());
app.use(express.json());

/* ── Rutas ── */
app.use("/api/auth", authRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/achievements", achievementsRoutes);
app.use("/api/content", contentRoutes);
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
});

});
