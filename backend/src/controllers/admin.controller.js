// backend/src/controllers/admin.controller.js
const User = require("../models/User");
const UserChallenge = require("../models/UserChallenge");

exports.getUsers = async (req, res) => {
  try {
    const search = String(req.query.search ?? "").trim();

    const pageRaw = parseInt(String(req.query.page ?? "1"), 10);
    const limitRaw = parseInt(String(req.query.limit ?? "20"), 10);

    const page = Number.isFinite(pageRaw) ? Math.max(1, pageRaw) : 1;
    const limit = Number.isFinite(limitRaw)
      ? Math.min(100, Math.max(1, limitRaw))
      : 20;

    const skip = (page - 1) * limit;

    const q =
      search.length > 0
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {};

    const [total, users] = await Promise.all([
      User.countDocuments(q),
      User.find(q)
        .select("_id name email role createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    return res.json({
      page,
      limit,
      total,
      users: users.map((u) => ({
        id: String(u._id),
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error en GET /api/admin/users:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar formato de ObjectId de MongoDB (24 hex chars)
    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    // Impedir que el admin se elimine a sí mismo
    if (id === req.userId) {
      return res.status(400).json({
        error: "No puedes eliminar tu propia cuenta desde el panel de administración",
      });
    }

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ message: "Usuario eliminado correctamente", id });
  } catch (err) {
    console.error("Error en DELETE /api/admin/users/:id:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ error: "Rol inválido. Debe ser 'user' o 'admin'" });
    }

    if (id === req.userId) {
      return res.status(400).json({
        error: "No puedes cambiar tu propio rol",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select("_id name email role");

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({
      message: "Rol actualizado correctamente",
      id: String(user._id),
      role: user.role,
    });
  } catch (err) {
    console.error("Error en PATCH /api/admin/users/:id/role:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({ error: "ID de usuario inválido" });
    }

    const user = await User.findById(id).select(
      "_id name email role picture level xp createdAt activity.stats activity.medals"
    );

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const stats = user.activity?.stats || {};
    const medals = user.activity?.medals || [];

    const userChallenges = await UserChallenge.find({ userId: id })
      .populate("challengeId", "title category icon difficulty goalUnit")
      .sort({ updatedAt: -1 })
      .lean();

    return res.json({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture || null,
      level: user.level ?? 1,
      xp: user.xp ?? 0,
      createdAt: user.createdAt,
      stats: {
        streakCurrent: stats.streakCurrent ?? 0,
        streakBest: stats.streakBest ?? 0,
        lastActiveLocalDate: stats.lastActiveLocalDate ?? null,
        completed: {
          article: stats.completed?.article ?? 0,
          routine: stats.completed?.routine ?? 0,
          challenge: userChallenges.filter((uc) => uc.status === "completed").length,
        },
      },
      medals: medals.map((m) => ({
        id: m.id,
        earnedAt: m.earnedAt,
      })),
      challenges: userChallenges.map((uc) => ({
        id: String(uc._id),
        title: uc.challengeId?.title ?? "Desafío eliminado",
        category: uc.challengeId?.category ?? null,
        icon: uc.challengeId?.icon ?? null,
        difficulty: uc.challengeId?.difficulty ?? null,
        goalUnit: uc.challengeId?.goalUnit ?? null,
        status: uc.status,
        progress: uc.progress,
        goalValue: uc.goalValue,
        startedAt: uc.startedAt,
        completedAt: uc.completedAt,
      })),
    });
  } catch (err) {
    console.error("Error en GET /api/admin/users/:id:", err?.message || err);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};