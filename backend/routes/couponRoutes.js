const express = require("express");
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  validateCoupon
} = require("../controllers/couponController");
const { authenticate, requireAdmin } = require("../middleware/auth");

router.get("/", getCoupons);
router.post("/", authenticate, requireAdmin, createCoupon);
router.post("/validate", validateCoupon);

module.exports = router;