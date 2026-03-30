const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");
const updateProductRating = require("../utils/updateProductRating");

const createReview = async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    if (!productId || !userId || !userName || !rating) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin đánh giá."
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tồn tại."
      });
    }

    const existed = await Review.findOne({ productId, userId });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đánh giá sản phẩm này rồi."
      });
    }

    const purchasedOrder = await Order.findOne({
      userId,
      status: "Paid",
      items: {
        $elemMatch: {
          id: product.id
        }
      }
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        success: false,
        message: "Bạn cần mua sản phẩm này trước khi đánh giá."
      });
    }

    const review = await Review.create({
      productId,
      userId,
      userName,
      rating: Number(rating),
      comment: comment || ""
    });

    await updateProductRating(productId);

    return res.status(201).json({
      success: true,
      message: "Đánh giá thành công.",
      review
    });
  } catch (error) {
    console.error("createReview error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đánh giá."
    });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error("getReviewsByProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đánh giá."
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá."
      });
    }

    if (rating) {
      review.rating = Number(rating);
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();
    await updateProductRating(review.productId);

    return res.json({
      success: true,
      message: "Cập nhật đánh giá thành công.",
      review
    });
  } catch (error) {
    console.error("updateReview error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật đánh giá."
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đánh giá."
      });
    }

    const productId = review.productId;

    await Review.findByIdAndDelete(reviewId);
    await updateProductRating(productId);

    return res.json({
      success: true,
      message: "Xóa đánh giá thành công."
    });
  } catch (error) {
    console.error("deleteReview error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa đánh giá."
    });
  }
};

module.exports = {
  createReview,
  getReviewsByProduct,
  updateReview,
  deleteReview
};