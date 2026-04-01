import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser
} from "../utils/storage";
import { createProduct } from "../services/productService";

export default function AddProductPage({ isModal, onClose, onProductAdded, productToEdit, onProductUpdated }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();


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

  useEffect(() => {
    if (productToEdit) {
      setForm({
        category: productToEdit.category || "",
        name: productToEdit.name || "",
        price: productToEdit.price || "",
        oldPrice: productToEdit.oldPrice || "",
        stock: productToEdit.stock || "",
        imagesText: productToEdit.images?.join("\n") || "",
        colorsText: productToEdit.colors?.join("\n") || "",
        sizesText: productToEdit.sizes?.join(",") || "",
        description: productToEdit.description || "",
        model: productToEdit.specs?.model || "",
        display: productToEdit.specs?.display || "",
        strapColor: productToEdit.specs?.strapColor || "",
        strapMaterial: productToEdit.specs?.strapMaterial || "",
        sizeSpec: productToEdit.specs?.size || "",
        touchscreen: productToEdit.specs?.touchscreen || "",
        waterResistant: productToEdit.specs?.waterResistant || "",
        compatibleOS: productToEdit.specs?.compatibleOS || ""
      });
    }
  }, [productToEdit]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
        <main>
          <section className="admin-denied container" style={{ padding: "40px 0" }}>
            <h2>Access Denied</h2>
            <p>Chỉ tài khoản Admin mới được truy cập trang này.</p>
          </section>
        </main>
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

    if (payload.price < 0 || payload.oldPrice < 0 || payload.stock < 0) {
      alert("Giá và tồn kho không được âm.");
      return;
    }

    if (productToEdit) {
      if (onProductUpdated) {
        setSubmitting(true);
        await onProductUpdated(payload); // Chờ cho đến khi cập nhật hoàn tất
        setSubmitting(false);
      }
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
    if (onProductAdded) onProductAdded();
    if (onClose) onClose();

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

  const formContent = (
    <div className="admin-panel" style={{ maxWidth: "1500px", margin: "0 auto", boxShadow: isModal ? "none" : undefined, border: isModal ? "none" : undefined }}>
              <div className="admin-panel-header">
                <h4>{productToEdit ? "Edit Product Information" : "New Product Information"}</h4>
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
                      min="0"
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
                      min="0"
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
                      min="0"
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
                  <button type="button" className="admin-secondary-btn" onClick={() => onClose ? onClose() : navigate("/admin")}>
                    Cancel
                  </button>

                  <button type="submit" className="admin-black-btn" disabled={submitting}>
                    {submitting ? "Đang lưu..." : (productToEdit ? "Update Product" : "Add Product")}
                  </button>
                </div>
              </form>
            </div>
  );

  if (isModal) return formContent;

  return (
    <main>
      <section className="container" style={{ padding: "32px 0 48px" }}>
        <div className="admin-content">
          {formContent}
        </div>
      </section>
    </main>
  );
}