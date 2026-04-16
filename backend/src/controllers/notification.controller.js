const User = require("../models/User");
const { getFirebaseAdmin } = require("../config/firebase");

/**
 * POST /api/notifications/register-token
 * El frontend envía el token FCM del dispositivo.
 * Requiere autenticación (Bearer token).
 */
exports.registerPushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken || typeof pushToken !== "string") {
      return res.status(400).json({ error: "pushToken es requerido" });
    }

    await User.findByIdAndUpdate(req.userId, { pushToken });

    res.json({ message: "Token registrado" });
  } catch (err) {
    console.error("Error registrando push token:", err.message);
    res.status(500).json({ error: "Error al registrar token" });
  }
};

/**
 * POST /api/admin/notifications/broadcast
 * Admin envía una notificación push a todos los usuarios.
 * Body: { title, body }
 */
exports.broadcast = async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: "title y body son requeridos" });
    }

    if (title.length > 100) {
      return res.status(400).json({ error: "El título no puede tener más de 100 caracteres" });
    }

    if (body.length > 500) {
      return res.status(400).json({ error: "El mensaje no puede tener más de 500 caracteres" });
    }

    const firebaseApp = getFirebaseAdmin();
    if (!firebaseApp) {
      return res.status(503).json({ error: "Firebase no está configurado en el servidor" });
    }

    // Obtener todos los tokens de push válidos
    const users = await User.find(
      { pushToken: { $ne: null, $exists: true } },
      { pushToken: 1 }
    ).lean();

    const tokens = users.map((u) => u.pushToken).filter(Boolean);

    if (tokens.length === 0) {
      return res.json({ message: "No hay dispositivos registrados", sent: 0, failed: 0 });
    }

    const messaging = firebaseApp.messaging();

    // Enviar en lotes (FCM permite hasta 500 por lote)
    const batchSize = 500;
    let sent = 0;
    let failed = 0;
    const invalidTokens = [];

    for (let i = 0; i < tokens.length; i += batchSize) {
      const batch = tokens.slice(i, i + batchSize);

      const response = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: { title, body },
        android: {
          priority: "high",
          notification: { channelId: "default" },
        },
      });

      sent += response.successCount;
      failed += response.failureCount;

      // Recopilar tokens inválidos para limpiar
      response.responses.forEach((resp, idx) => {
        if (
          !resp.success &&
          resp.error &&
          (resp.error.code === "messaging/invalid-registration-token" ||
            resp.error.code === "messaging/registration-token-not-registered")
        ) {
          invalidTokens.push(batch[idx]);
        }
      });
    }

    // Limpiar tokens inválidos de la BD
    if (invalidTokens.length > 0) {
      await User.updateMany(
        { pushToken: { $in: invalidTokens } },
        { $set: { pushToken: null } }
      );
    }

    res.json({
      message: "Notificación enviada",
      sent,
      failed,
      cleaned: invalidTokens.length,
    });
  } catch (err) {
    console.error("Error en broadcast:", err.message);
    res.status(500).json({ error: "Error al enviar notificaciones" });
  }
};
