// backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function requireAuth(req, res, next) {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = h.slice("Bearer ".length);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) return res.status(401).json({ error: "Token inválido" });

    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expirado" });
    }
    return res.status(401).json({ error: "Token inválido" });
  }
}

async function requireAdmin(req, res, next) {
  try {
    const me = await User.findById(req.userId).select("role");
    if (!me) return res.status(401).json({ error: "Usuario no existe" });
    if (me.role !== "admin") return res.status(403).json({ error: "No autorizado" });
    next();
  } catch (err) {
    console.error("Error en requireAdmin:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}

module.exports = { requireAuth, requireAdmin };