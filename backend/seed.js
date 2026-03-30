require("dotenv").config();
const connectDB = require("./config/db");

const Product = require("./models/Product");
const Coupon = require("./models/Coupon");

const products = require("./data/products");
const coupons = require("./data/coupons");

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Coupon.deleteMany();

    await Product.insertMany(products);

    await Coupon.insertMany(
      coupons.map((coupon) => ({
        code: coupon.code,
        name: coupon.name,
        discountPercent: coupon.discountPercent,
        minOrderValue: coupon.minOrderValue || 50,
        expireAt: coupon.expireAt,
        createdAt: coupon.createdAt || new Date()
      }))
    );

    console.log("Seed data success");
    process.exit();
  } catch (error) {
    console.error("Seed data error:", error);
    process.exit(1);
  }
};

seedData();