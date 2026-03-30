import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import {
  getCart,
  saveCart,
  getCurrentUser
} from "../utils/storage";
import { createProduct } from "../services/productService";

export default function AddProductPage() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [form, setForm] = useState({
    category: "",
    name: "",
    price: "",
    oldPrice: "",
    stock: "",
    imagesText: "",
    colorsText: "",
    sizesText: "",
    description: "",
    model: "",
    display: "",
    strapColor: "",
    strapMaterial: "",
    sizeSpec: "",
    touchscreen: "",
    waterResistant: "",
    compatibleOS: ""
  });

  const [submitting, setSubmitting] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <>
        <Navbar
          currentUser={currentUser}
          cartCount={cartCount}
          onCartClick={() => setIsCartOpen(true)}
        />

        <QuickCart
          isOpen={isCartOpen}
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onRemoveItem={(targetItem) => {
            const updatedCart = cart.filter(
              (item) =>
                !(
                  item.id === targetItem.id &&
                  item.image === targetItem.image &&
                  item.size === targetItem.size
                )
            );

            setCart(updatedCart);
            saveCart(updatedCart);
          }}
        />

        <main>
          <section className="admin-denied container" style={{ padding: "40px 0" }}>
            <h2>Access Denied</h2>
            <p>Chỉ tài khoản Admin mới được truy cập trang này.</p>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      category: form.category.trim(),
      name: form.name.trim(),
      price: Number(form.price) || 0,
      oldPrice: Number(form.oldPrice) || 0,
      stock: Number(form.stock) || 0,
      images: form.imagesText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      colors: form.colorsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      sizes: form.sizesText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      description: form.description.trim(),
      specs: {
        model: form.model.trim(),
        display: form.display.trim(),
        strapColor: form.strapColor.trim(),
        strapMaterial: form.strapMaterial.trim(),
        size: form.sizeSpec.trim(),
        touchscreen: form.touchscreen.trim(),
        waterResistant: form.waterResistant.trim(),
        compatibleOS: form.compatibleOS.trim()
      }
    };

    if (!payload.category || !payload.name || !payload.price) {
      alert("Vui lòng nhập category, tên sản phẩm và giá.");
      return;
    }

    setSubmitting(true);
    const result = await createProduct(payload);
    setSubmitting(false);

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Thêm sản phẩm thành công!");

    setForm({
      category: "",
      name: "",
      price: "",
      oldPrice: "",
      stock: "",
      imagesText: "",
      colorsText: "",
      sizesText: "",
      description: "",
      model: "",
      display: "",
      strapColor: "",
      strapMaterial: "",
      sizeSpec: "",
      touchscreen: "",
      waterResistant: "",
      compatibleOS: ""
    });
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <QuickCart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onRemoveItem={(targetItem) => {
          const updatedCart = cart.filter(
            (item) =>
              !(
                item.id === targetItem.id &&
                item.image === targetItem.image &&
                item.size === targetItem.size
              )
          );

          setCart(updatedCart);
          saveCart(updatedCart);
        }}
      />

      <main>
        <section className="admin-dashboard">
          <aside className="admin-sidebar">
            <div className="admin-menu-group">
              <p className="admin-menu-title">Main menu</p>
              <Link to="/admin" className="admin-menu-item">Dashboard</Link>
              <Link to="/admin/orders" className="admin-menu-item">Order Management</Link>
              <Link to="/admin/customers" className="admin-menu-item">Customers</Link>
              <Link to="/admin/coupons" className="admin-menu-item">Coupon Code</Link>
            </div>

            <div className="admin-menu-group">
              <p className="admin-menu-title">Product</p>
              <Link to="/admin/products/add" className="admin-menu-item active">
                Add Products
              </Link>
              <a href="#" className="admin-menu-item">Product Reviews</a>
            </div>
          </aside>

          <div className="admin-content">
            <div className="admin-topbar">
              <h2>Add Product</h2>
              <div className="admin-topbar-right">
                <button
                  type="button"
                  className="admin-black-btn"
                  onClick={() => navigate("/admin")}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="admin-panel" style={{ maxWidth: "1000px" }}>
              <div className="admin-panel-header">
                <h4>New Product Information</h4>
              </div>

              <form className="add-product-form" onSubmit={handleSubmit}>
                <div className="add-product-grid two-cols">
                  <div className="form-group">
                    <label>Tên sản phẩm</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="Ví dụ: phone, laptop, headphones"
                      required
                    />
                  </div>
                </div>

                <div className="add-product-grid three-cols">
                  <div className="form-group">
                    <label>Giá mới</label>
                    <input
                      name="price"
                      type="number"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Giá cũ</label>
                    <input
                      name="oldPrice"
                      type="number"
                      value={form.oldPrice}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tồn kho</label>
                    <input
                      name="stock"
                      type="number"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Ảnh sản phẩm</label>
                  <textarea
                    name="imagesText"
                    rows={5}
                    value={form.imagesText}
                    onChange={handleChange}
                    placeholder={`Mỗi dòng một link ảnh\nhttps://...\nhttps://...`}
                  />
                </div>

                <div className="form-group">
                  <label>Ảnh màu sắc</label>
                  <textarea
                    name="colorsText"
                    rows={4}
                    value={form.colorsText}
                    onChange={handleChange}
                    placeholder={`Mỗi dòng một link ảnh màu`}
                  />
                </div>

                <div className="form-group">
                  <label>Sizes</label>
                  <input
                    name="sizesText"
                    value={form.sizesText}
                    onChange={handleChange}
                    placeholder="Ví dụ: 42mm, 46mm hoặc 256GB, 512GB"
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    rows={5}
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Mô tả sản phẩm"
                  />
                </div>

                <h3 className="form-section-title">Specifications</h3>

                <div className="add-product-grid two-cols">
                  <div className="form-group">
                    <label>Model</label>
                    <input name="model" value={form.model} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Display</label>
                    <input name="display" value={form.display} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Strap Color</label>
                    <input name="strapColor" value={form.strapColor} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Strap Material</label>
                    <input name="strapMaterial" value={form.strapMaterial} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Size Spec</label>
                    <input name="sizeSpec" value={form.sizeSpec} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Touchscreen</label>
                    <input name="touchscreen" value={form.touchscreen} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Water Resistant</label>
                    <input name="waterResistant" value={form.waterResistant} onChange={handleChange} />
                  </div>

                  <div className="form-group">
                    <label>Compatible OS</label>
                    <input name="compatibleOS" value={form.compatibleOS} onChange={handleChange} />
                  </div>
                </div>

                <div className="add-product-actions">
                  <button type="button" className="admin-secondary-btn" onClick={() => navigate("/admin")}>
                    Cancel
                  </button>

                  <button type="submit" className="admin-black-btn" disabled={submitting}>
                    {submitting ? "Đang thêm..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}