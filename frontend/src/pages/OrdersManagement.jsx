import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import {
  getCart,
  saveCart,
  getCurrentUser,
  formatPrice
} from "../utils/storage";
import { fetchOrders } from "../services/orderService";

export default function OrderManagementPage() {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const result = await fetchOrders();
      setOrders(result.orders || []);
      setLoading(false);
    };

    loadOrders();
  }, []);

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
            <p>Chỉ tài khoản Admin mới được truy cập Order Management.</p>
          </section>
        ) : (
          <section className="container" style={{ padding: "32px 0 48px" }}>
            <div style={{ marginBottom: "20px" }}>
              <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Order Management</h1>
              <p style={{ color: "#666" }}>Quản lý toàn bộ đơn hàng trong hệ thống.</p>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "16px",
                padding: "20px",
                overflowX: "auto"
              }}
            >
              {loading ? (
                <p>Loading orders...</p>
              ) : orders.length ? (
                <table className="admin-table" style={{ width: "100%", minWidth: "1200px" }}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Products</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                      <th>Discount</th>
                      <th>Coupon</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const productNames =
                        order.items?.map((item) => `${item.name}${item.size ? ` (${item.size})` : ""}`).join(", ") || "-";

                      const totalQty =
                        order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

                      return (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customerName}</td>
                          <td style={{ maxWidth: "280px", whiteSpace: "normal" }}>{productNames}</td>
                          <td>{totalQty}</td>
                          <td>{formatPrice(order.subtotal || 0)}</td>
                          <td>{formatPrice(order.discountAmount || 0)}</td>
                          <td>{order.couponCode || "-"}</td>
                          <td>{formatPrice(order.total || 0)}</td>
                          <td>{order.status}</td>
                          <td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p>Chưa có đơn hàng nào.</p>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}