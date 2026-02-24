const User = require("../models/User");

module.exports = async function requireAdmin(req, res, next) {
  try {
    if (!req.userId) return res.status(401).json({ error: "No autenticado" });

    const me = await User.findById(req.userId).select("role").lean();
    if (!me) return res.status(401).json({ error: "Usuario no existe" });

    if (me.role !== "admin") {
      return res.status(403).json({ error: "No autorizado" });
    }

    next();
  } catch{
    return res.status(500).json({ error: "Error en el servidor" });
  }
};