const express = require("express");
const {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", createReview);
router.get("/product/:productId", getReviewsByProduct);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;