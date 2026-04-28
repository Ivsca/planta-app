const express = require("express");
const { register, login, getMe, updateMe, deleteMe, googleLogin } = require("../controllers/auth.controller");
const upload = require("../config/multer");

const router = express.Router();

/* ── POST /api/auth/register ── */
router.post("/register", register);

/* ── POST /api/auth/login ── */
router.post("/login", login);

/* ── POST /api/auth/google ── */
router.post("/google", googleLogin);

/* ── GET /api/auth/me ── */
router.get("/me", getMe);

/* ── PUT /api/auth/me ── Actualizar perfil */
router.put("/me", upload.single("picture"),updateMe);

/* ── DELETE /api/auth/me ── Eliminar cuenta */
router.delete("/me", deleteMe);

module.exports = router;
