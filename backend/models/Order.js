const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.Mixed
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      default: 0
    },
    quantity: {
      type: Number,
      default: 1
    },
    image: {
      type: String,
      default: ""
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    customerName: {
      type: String,
      required: true,
      trim: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      default: []
    },
    subtotal: {
      type: Number,
      default: 0
    },
    taxes: {
      type: Number,
      default: 0
    },
    delivery: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      default: null
    },
    total: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: "Paid"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", orderSchema);