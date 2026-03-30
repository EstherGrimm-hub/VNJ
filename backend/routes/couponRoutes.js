const express = require("express");
const router = express.Router();
const {
  getCoupons,
  createCoupon,
  validateCoupon
} = require("../controllers/couponController");

router.get("/", getCoupons);
router.post("/", createCoupon);
router.post("/validate", validateCoupon);

module.exports = router;