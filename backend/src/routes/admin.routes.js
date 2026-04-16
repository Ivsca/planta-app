// backend/src/routes/admin.routes.js
const router = require("express").Router();
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { getUsers, getUserById, deleteUser, changeRole } = require("../controllers/admin.controller");

router.get("/users", requireAuth, requireAdmin, getUsers);
router.get("/users/:id", requireAuth, requireAdmin, getUserById);
router.patch("/users/:id/role", requireAuth, requireAdmin, changeRole);
router.delete("/users/:id", requireAuth, requireAdmin, deleteUser);

module.exports = router;
