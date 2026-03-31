import React, { useEffect, useState } from "react";
import { fetchOrders } from "../services/orderService";
import { formatPrice } from "../utils/storage";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const result = await fetchOrders();
        setOrders(result.orders || []);
      } catch (error) {
        console.error("loadOrders error:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  return (
    <section className="container" style={{ padding: "30px 0 50px" }}>
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h4>Order Management</h4>
        </div>
        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Customer</th>
                <th>Subtotal</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={order.id || order._id || index}>
                    <td>{index + 1}</td>
                    <td>{order.customerName}</td>
                    <td>{formatPrice(order.subtotal || 0)}</td>
                    <td>{formatPrice(order.discountAmount || 0)}</td>
                    <td>{formatPrice(order.total || 0)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.createdAt).toLocaleString("vi-VN")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Chưa có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
