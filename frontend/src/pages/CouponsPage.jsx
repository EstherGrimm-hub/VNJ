import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import { getCart, saveCart, getCurrentUser } from "../utils/storage";
import { createCoupon, fetchCoupons } from "../services/couponService";

export default function CouponsPage() {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [expireInDays, setExpireInDays] = useState("");

  const currentUser = getCurrentUser();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const loadCoupons = async () => {
    setLoading(true);
    const result = await fetchCoupons();
    setCoupons(result.coupons || []);
    setLoading(false);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    const result = await createCoupon({
      name,
      discountPercent,
      expireInDays
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    alert("Tạo coupon thành công.");
    setName("");
    setDiscountPercent("");
    setExpireInDays("");
    loadCoupons();
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
        {!currentUser || currentUser.role !== "admin" ? (
          <section className="admin-denied container" style={{ padding: "40px 0" }}>
            <h2>Access Denied</h2>
            <p>Chỉ tài khoản Admin mới được truy cập Coupon Code.</p>
          </section>
        ) : (
          <section className="container" style={{ padding: "30px 0 50px" }}>
            <div className="admin-panel" style={{ marginBottom: "20px" }}>
              <div className="admin-panel-header">
                <h4>Create Coupon</h4>
              </div>

              <form
                onSubmit={handleCreateCoupon}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "12px"
                }}
              >
                <input
                  type="text"
                  placeholder="Coupon name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                />

                <input
                  type="number"
                  placeholder="Discount %"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  style={inputStyle}
                />

                <input
                  type="number"
                  placeholder="Expire in days"
                  value={expireInDays}
                  onChange={(e) => setExpireInDays(e.target.value)}
                  style={inputStyle}
                />

                <button type="submit" className="admin-black-btn" style={{ width: "fit-content" }}>
                  Create Coupon
                </button>
              </form>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <h4>Coupon List</h4>
              </div>

              {loading ? (
                <p>Loading coupons...</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Min Order</th>
                      <th>Remaining Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.length ? (
                      coupons.map((coupon, index) => (
                        <tr key={coupon.id}>
                          <td>{index + 1}</td>
                          <td>{coupon.name}</td>
                          <td>{coupon.code}</td>
                          <td>{coupon.discountPercent}%</td>
                          <td>{coupon.minOrderValue.toLocaleString("vi-VN")} VNĐ</td>
                          <td>{coupon.remainingDays}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">Chưa có coupon nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

const inputStyle = {
  width: "100%",
  height: "42px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "0 14px",
  outline: "none"
};