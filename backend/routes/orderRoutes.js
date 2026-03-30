const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByUserId
} = require("../controllers/orderController");

router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUserId);
router.post("/", createOrder);

module.exports = router;