const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcrypt");

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find(
      { role: "customer" },
      { password: 0 }
    ).sort({ createdAt: -1 });

    return res.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error("getCustomers error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách khách hàng."
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error("getAllUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách user."
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    console.error("getWishlist error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy wishlist."
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const already = user.wishlist.some((item) => item.toString() === productId);
    if (already) {
      return res.status(400).json({ success: false, message: "Product already in wishlist." });
    }

    user.wishlist.push(productId);
    await user.save();

    return res.json({ success: true, message: "Added to wishlist.", wishlist: user.wishlist });
  } catch (error) {
    console.error("addToWishlist error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server khi thêm wishlist." });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const exists = user.wishlist.some((item) => item.toString() === productId);
    if (!exists) {
      return res.status(404).json({ success: false, message: "Product not in wishlist." });
    }

    user.wishlist = user.wishlist.filter((item) => item.toString() !== productId);
    await user.save();

    return res.json({ success: true, message: "Removed from wishlist.", wishlist: user.wishlist });
  } catch (error) {
    console.error("removeFromWishlist error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server khi xóa wishlist." });
  }
};


const createUser = async (req, res) => {
  try {
    const { name, email, password, role = "customer" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đủ thông tin."
      });
    }

    const existed = await User.findOne({
      email: email.trim().toLowerCase()
    });

    if (existed) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại."
      });
    }

    const allowedRoles = ["customer", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role
    });

    return res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo user."
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData = {};

    if (name && name.trim() !== "") {
      updateData.name = name.trim();
    }

    if (email && email.trim() !== "") {
      updateData.email = email.trim().toLowerCase();
      const existing = await User.findOne({ email: updateData.email, _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại, không thể cập nhật."
        });
      }
    }

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      updateData.password = hashedPassword;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cần ít nhất 1 trường để cập nhật (name/email/password)."
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user."
      });
    }

    return res.json({
      success: true,
      message: "Cập nhật tên thành công.",
      user: updatedUser
    });
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật user."
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user."
      });
    }

    return res.json({
      success: true,
      message: "Xóa user thành công."
    });
  } catch (error) {
    console.error("deleteUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa user."
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["customer", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role không hợp lệ."
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy user."
      });
    }

    return res.json({
      success: true,
      message: "Cập nhật role thành công.",
      user: updatedUser
    });
  } catch (error) {
    console.error("updateUserRole error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật role."
    });
  }
};

module.exports = {
  getCustomers,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserRole,
  getWishlist,
  addToWishlist,
  removeFromWishlist
};