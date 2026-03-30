const User = require("../models/User");

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

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["customer", "admin", "doctor"];

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
  updateUserRole
};