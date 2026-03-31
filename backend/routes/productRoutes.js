const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const { authenticate, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authenticate, requireAdmin, createProduct);
router.put("/:id", authenticate, requireAdmin, updateProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

module.exports = router;