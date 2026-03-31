const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole
} = require("../controllers/userController");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.get("/", authenticate, requireAdmin, getAllUsers);
router.get("/customers", authenticate, requireAdmin, getCustomers);
router.post("/", authenticate, requireAdmin, createUser);
router.put("/:id", authenticate, requireAdmin, updateUser);
router.delete("/:id", authenticate, requireAdmin, deleteUser);
router.put("/:id/role", authenticate, requireAdmin, updateUserRole);

module.exports = router;