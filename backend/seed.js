require("dotenv").config();
const connectDB = require("./config/db");
const bcrypt = require("bcrypt");

const Product = require("./models/Product");
const Coupon = require("./models/Coupon");
const User = require("./models/User");

const products = require("./data/products");
const coupons = require("./data/coupons");

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Coupon.deleteMany();
    await User.deleteMany();

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

    // Seed users (passwords will be hashed)
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedCustomerPassword = await bcrypt.hash("pass123", 10);

    await User.insertMany([
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedAdminPassword,
        role: "admin"
      },
      {
        name: "Customer One",
        email: "customer1@example.com",
        password: hashedCustomerPassword,
        role: "customer"
      },
      {
        name: "Customer Two",
        email: "customer2@example.com",
        password: hashedCustomerPassword,
        role: "customer"
      }
    ]);

    console.log("Seed data success");
    process.exit();
  } catch (error) {
    console.error("Seed data error:", error);
    process.exit(1);
  }
};

seedData();