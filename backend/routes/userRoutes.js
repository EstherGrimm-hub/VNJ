const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getAllUsers,
  updateUserRole
} = require("../controllers/userController");

router.get("/", getAllUsers);
router.get("/customers", getCustomers);
router.put("/:id/role", updateUserRole);

module.exports = router;