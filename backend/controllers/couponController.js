const Coupon = require("../models/Coupon");

function generateCouponCode(length = 24) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

async function generateUniqueCouponCode() {
  let code = generateCouponCode();
  let existed = await Coupon.findOne({ code });

  while (existed) {
    code = generateCouponCode();
    existed = await Coupon.findOne({ code });
  }

  return code;
}

function getRemainingDays(expireAt) {
  const now = new Date();
  const expiry = new Date(expireAt);
  const diffMs = expiry - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    const result = coupons.map((coupon) => ({
      _id: coupon._id,
      id: coupon._id,
      code: coupon.code,
      name: coupon.name,
      discountPercent: coupon.discountPercent,
      minOrderValue: coupon.minOrderValue,
      expireAt: coupon.expireAt,
      createdAt: coupon.createdAt,
      remainingDays: getRemainingDays(coupon.expireAt)
    }));

    return res.json({
      success: true,
      coupons: result
    });
  } catch (error) {
    console.error("getCoupons error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách coupon."
    });
  }
};

const createCoupon = async (req, res) => {
  try {
    const { name, discountPercent, expireInDays } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Tên coupon không được để trống."
      });
    }

    const discount = Number(discountPercent);
    const days = Number(expireInDays);

    if (Number.isNaN(discount) || discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        message: "Giảm giá phải từ 0 đến 100%."
      });
    }

    if (Number.isNaN(days) || days <= 0) {
      return res.status(400).json({
        success: false,
        message: "Số ngày hết hạn phải lớn hơn 0."
      });
    }

    const now = new Date();
    const expireAt = new Date(now);
    expireAt.setDate(expireAt.getDate() + days);

    const newCoupon = await Coupon.create({
      code: await generateUniqueCouponCode(),
      name: name.trim(),
      discountPercent: discount,
      minOrderValue: 50,
      expireAt
    });

    return res.status(201).json({
      success: true,
      message: "Tạo coupon thành công.",
      coupon: {
        _id: newCoupon._id,
        id: newCoupon._id,
        code: newCoupon.code,
        name: newCoupon.name,
        discountPercent: newCoupon.discountPercent,
        minOrderValue: newCoupon.minOrderValue,
        expireAt: newCoupon.expireAt,
        createdAt: newCoupon.createdAt,
        remainingDays: getRemainingDays(newCoupon.expireAt)
      }
    });
  } catch (error) {
    console.error("createCoupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo coupon."
    });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập mã coupon."
      });
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase()
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon không tồn tại."
      });
    }

    const remainingDays = getRemainingDays(coupon.expireAt);

    if (remainingDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon đã hết hạn."
      });
    }

    const orderSubtotal = Number(subtotal);

    if (orderSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Coupon chỉ áp dụng cho đơn từ ${coupon.minOrderValue.toLocaleString("vi-VN")} VNĐ.`
      });
    }

    const discountAmount = Math.floor(
      (orderSubtotal * coupon.discountPercent) / 100
    );

    return res.json({
      success: true,
      message: "Áp dụng coupon thành công.",
      coupon: {
        _id: coupon._id,
        id: coupon._id,
        code: coupon.code,
        name: coupon.name,
        discountPercent: coupon.discountPercent,
        minOrderValue: coupon.minOrderValue,
        expireAt: coupon.expireAt,
        createdAt: coupon.createdAt,
        remainingDays
      },
      discountAmount
    });
  } catch (error) {
    console.error("validateCoupon error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi kiểm tra coupon."
    });
  }
};

module.exports = {
  getCoupons,
  createCoupon,
  validateCoupon
};