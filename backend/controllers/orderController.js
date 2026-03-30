const mongoose = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      customerName,
      items,
      subtotal,
      taxes,
      delivery,
      total,
      couponCode,
      discountAmount
    } = req.body;

    if (!userId || !customerName) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin người dùng."
      });
    }

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng đang trống."
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "userId không hợp lệ."
      });
    }

    const existedUser = await User.findById(userId);

    if (!existedUser) {
      return res.status(404).json({
        success: false,
        message: "Người dùng không tồn tại."
      });
    }

    const newOrder = await Order.create({
      userId,
      customerName,
      items,
      subtotal: Number(subtotal) || 0,
      taxes: Number(taxes) || 0,
      delivery: Number(delivery) || 0,
      discountAmount: Number(discountAmount) || 0,
      couponCode: couponCode || null,
      total: Number(total) || 0,
      status: "Paid"
    });

    return res.status(201).json({
      success: true,
      message: "Thanh toán thành công!",
      order: {
        id: newOrder._id,
        userId: newOrder.userId,
        customerName: newOrder.customerName,
        items: newOrder.items,
        subtotal: newOrder.subtotal,
        taxes: newOrder.taxes,
        delivery: newOrder.delivery,
        discountAmount: newOrder.discountAmount,
        couponCode: newOrder.couponCode,
        total: newOrder.total,
        status: newOrder.status,
        createdAt: newOrder.createdAt
      }
    });
  } catch (error) {
    console.error("createOrder error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo đơn hàng."
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("getOrders error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách đơn hàng."
    });
  }
};

const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "userId không hợp lệ."
      });
    }

    const userOrders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      orders: userOrders
    });
  } catch (error) {
    console.error("getOrdersByUserId error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy đơn hàng theo user."
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByUserId
};