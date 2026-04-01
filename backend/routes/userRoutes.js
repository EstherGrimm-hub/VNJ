const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require("../controllers/userController");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.get("/", authenticate, requireAdmin, getAllUsers);
router.get("/customers", authenticate, requireAdmin, getCustomers);
router.post("/", authenticate, requireAdmin, createUser);
router.put("/:id", authenticate, requireAdmin, updateUser);
router.delete("/:id", authenticate, requireAdmin, deleteUser);
router.put("/:id/role", authenticate, requireAdmin, updateUserRole);

// Wishlist APIs (user-specific)
router.get("/wishlist", authenticate, getWishlist);
router.post("/wishlist/:productId", authenticate, addToWishlist);
router.delete("/wishlist/:productId", authenticate, removeFromWishlist);

module.exports = router;