// backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.id) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err?.name === "JsonWebTokenError" || err?.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.status(500).json({ error: "Error en el servidor" });
  }
};