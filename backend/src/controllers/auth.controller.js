
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const uploadToCloudinary = require("../helpers/uploadToCloudinary");
const fs = require("fs");
const deleteFromCloudinary = require("../helpers/deleteFromCloudinary");

const googleClient = new OAuth2Client(process.env.GOOGLE_WEB_CLIENT_ID);

/* ── Helpers ── */
const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

/* ── POST /api/auth/register ── */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación de campos obligatorios
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el correo ya existe
    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(409)
        .json({ error: "El correo ya está registrado" });
    }

    // Crear usuario (el hash de la contraseña se hace en el pre-save del modelo)
    const user = await User.create({ name, email, password });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
      },
    });
  } catch (err) {
    console.error("Error en register:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/* ── POST /api/auth/login ── */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        picture: user.picture || null,
      },
    });
  } catch (err) {
    console.error("Error en login:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/* ── GET /api/auth/me ── */
const getMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
};

/* ── PUT /api/auth/me ── Actualizar datos (nombre, contraseña) — NO el correo ── */
const updateMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { name, password, picture } = req.body;

    // Actualizar nombre si se proporcionó
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: "El nombre no puede estar vacío" });
      }
      user.name = name.trim();
    }

    // Actualizar contraseña si se proporcionó
    if (password !== undefined) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "La contraseña debe tener al menos 6 caracteres" });
      }
      user.password = password; // el pre-save del modelo la hashea
    }

    // Subir nueva foto si se envió archivo
    if (req.file) {
      try {
        // Si hay una foto anterior en Cloudinary, eliminarla
        if (user.picture && typeof user.picture === "string" && user.picture.includes("cloudinary.com")) {
          // Extraer public_id de la URL
          // Ejemplo de URL: https://res.cloudinary.com/<cloud_name>/image/upload/v1234567890/avatars/filename.jpg
          const regex = /\/upload\/(?:v\d+\/)?(.+)(\.[a-zA-Z0-9]+)?$/;
          const match = user.picture.match(regex);
          if (match && match[1]) {
            const publicId = match[1].replace(/\\/g, "/");
            try {
              await deleteFromCloudinary(publicId, "image");
            } catch (e) {
              // No bloquear si falla el borrado
              console.error("No se pudo borrar imagen anterior de Cloudinary:", e.message);
            }
          }
        }
        const result = await uploadToCloudinary(req.file.path, "image", "avatars");
        user.picture = result.secure_url;
        // Eliminar archivo temporal
        fs.unlink(req.file.path, () => {});
      } catch (err) {
        return res.status(500).json({ error: "Error al subir imagen" });
      }
    } else if (picture !== undefined) {
      // Si se envía picture como string (URL), actualizarlo
      user.picture = picture;
    }

    await user.save();

    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        picture: user.picture || null,
      },
    });

  } catch (err) {
    console.error("Error en updateMe:", err.message);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error en el servidor" });
  }
};

/* ── DELETE /api/auth/me ── Eliminar cuenta ── */
const deleteMe = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndDelete(decoded.id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Cuenta eliminada correctamente" });
  } catch (err) {
    console.error("Error en deleteMe:", err.message);
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token inválido" });
    }
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { register, login, getMe, updateMe, deleteMe, googleLogin };

/* ── POST /api/auth/google ── */
async function googleLogin(req, res) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "idToken es requerido" });
    }

    // Verificar el token con Google
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_WEB_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ error: "Token de Google inválido" });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ error: "No se obtuvo email de la cuenta de Google" });
    }

    // Buscar por googleId primero, luego por email (para vincular cuentas existentes)
    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        // Vincular cuenta existente con Google
        user.googleId = googleId;
        if (picture && !user.picture) user.picture = picture;
        await user.save();
      } else {
        // Crear nuevo usuario
        user = await User.create({ name, email, googleId, picture: picture || null });
      }
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        level: user.level,
        xp: user.xp,
        picture: user.picture || null,
      },
    });
  } catch (err) {
    console.error("Error en googleLogin:", err.message);
    res.status(500).json({ error: "Error en el servidor" });
  }
}
