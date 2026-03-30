const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error("getProducts error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách sản phẩm."
    });
  }
};
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error("createProduct error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo sản phẩm."
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error("getProductById error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy chi tiết sản phẩm."
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};