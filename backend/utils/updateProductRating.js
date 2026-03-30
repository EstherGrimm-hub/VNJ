const Review = require("../models/Review");
const Product = require("../models/Product");

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ productId });

  const ratingCount = reviews.length;

  const ratingAverage =
    ratingCount === 0
      ? 0
      : reviews.reduce((sum, item) => sum + item.rating, 0) / ratingCount;

  await Product.findByIdAndUpdate(productId, {
    ratingAverage: Number(ratingAverage.toFixed(1)),
    ratingCount,
    rating: Math.round(ratingAverage),
    reviews: `${ratingCount} Reviews`
  });
};

module.exports = updateProductRating;