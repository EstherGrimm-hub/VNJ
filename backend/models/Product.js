const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      sparse: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    oldPrice: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },
    reviews: {
      type: String,
      default: "0 Reviews"
    },

    ratingAverage: {
      type: Number,
      default: 0
    },
    ratingCount: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      default: 0
    },
    images: {
      type: [String],
      default: []
    },
    colors: {
      type: [String],
      default: []
    },
    sizes: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      default: ""
    },
    specs: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);