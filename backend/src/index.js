require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const app = express();
const PORT = process.env.PORT || 4000;

/* ── Middlewares ── */
app.use(cors());
app.use(express.json());

/* ── Rutas ── */
app.use("/api/auth", authRoutes);

/* ── Health check ── */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ── Conexión a MongoDB y arranque ── */
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
});
