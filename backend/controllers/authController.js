const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập email và mật khẩu."
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      password
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Sai email hoặc mật khẩu!"
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập."
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
        message: "Email đã tồn tại, hãy đăng nhập."
      });
    }

    const newUser = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: "customer"
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
    console.error("register error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký."
    });
  }
};

module.exports = {
  login,
  register
};