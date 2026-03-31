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

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
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
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Tên không được để trống."
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name: name.trim() },
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
  updateUserRole
};