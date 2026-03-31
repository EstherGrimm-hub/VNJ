import React, { useEffect, useState } from "react";
import { createCoupon, fetchCoupons } from "../services/couponService";
import { getCurrentUser } from "../utils/storage";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    name: "",
    discountPercent: "",
    minOrderValue: "",
    validUntil: "",
  });

  const currentUser = getCurrentUser();

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const result = await fetchCoupons();
      const couponsWithRemainingDays = (result.coupons || []).map(c => {
        const remaining = Math.ceil((new Date(c.expireAt || c.validUntil) - new Date()) / (1000 * 60 * 60 * 24));
        return { ...c, remainingDays: remaining > 0 ? remaining : 0 };
      });
      setCoupons(couponsWithRemainingDays);
    } catch (error) {
      console.error("loadCoupons error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createCoupon(form);
      if (result.success) {
        alert("Đã tạo mã giảm giá thành công!");
        setForm({ code: "", name: "", discountPercent: "", minOrderValue: "", validUntil: "" });
        loadCoupons();
      } else {
        alert(result.message || "Có lỗi xảy ra khi tạo coupon.");
      }
    } catch (error) {
      console.error("Create coupon error:", error);
      alert("Lỗi kết nối khi tạo coupon.");
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <section className="admin-denied container" style={{ padding: "40px 0" }}>
        <h2>Access Denied</h2>
        <p>Chỉ tài khoản Admin mới được truy cập trang này.</p>
      </section>
    );
  }

  return (
    <section className="container" style={{ padding: "30px 0 50px" }}>
      <div className="admin-panel" style={{ marginBottom: "20px" }}>
        <div className="admin-panel-header">
          <h4>Create New Coupon</h4>
        </div>
        <form onSubmit={handleSubmit} className="add-product-form" style={{ padding: "16px" }}>
          <div className="add-product-grid three-cols">
            <div className="form-group">
              <label>Coupon Code</label>
              <input name="code" value={form.code} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Coupon Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Discount (%)</label>
              <input name="discountPercent" type="number" value={form.discountPercent} onChange={handleChange} required />
            </div>
          </div>
          <div className="add-product-grid three-cols">
            <div className="form-group">
              <label>Min Order Value</label>
              <input name="minOrderValue" type="number" value={form.minOrderValue} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Valid Until</label>
              <input name="validUntil" type="date" value={form.validUntil} onChange={handleChange} required />
            </div>
          </div>
          <button type="submit" className="admin-black-btn">Create Coupon</button>
        </form>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h4>Existing Coupons</h4>
        </div>
        {loading ? (
          <p>Loading coupons...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Code</th>
                <th>Name</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Remaining Days</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length ? (
                coupons.map((coupon, index) => (
                  <tr key={coupon.id || coupon._id || index}>
                    <td>{index + 1}</td>
                    <td>{coupon.code}</td>
                    <td>{coupon.name}</td>
                    <td>{coupon.discountPercent}%</td>
                    <td>{coupon.minOrderValue.toLocaleString("vi-VN")} VNĐ</td>
                    <td>{coupon.remainingDays}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Chưa có mã giảm giá nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
