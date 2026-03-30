import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import { Link } from "react-router-dom";
import {
  getCart,
  saveCart,
  getCurrentUser,
  formatPrice
} from "../utils/storage";
import { fetchOrders } from "../services/orderService";
import { fetchProducts } from "../services/productService";

export default function AdminPage() {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [cart]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setLoading(true);

        const [ordersResult, productsResult] = await Promise.all([
          fetchOrders(),
          fetchProducts()
        ]);

        setOrders(ordersResult?.orders || []);
        setProducts(productsResult?.products || []);
      } catch (error) {
        console.error("loadAdminData error:", error);
        setOrders([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const totalSales = orders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0
  );

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;
  const canceledOrders = orders.filter(
    (order) => order.status === "Canceled"
  ).length;

  const latestTransactions = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const productSummaryMap = {};

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      if (!productSummaryMap[item.name]) {
        productSummaryMap[item.name] = {
          name: item.name,
          totalQty: 0,
          revenue: 0
        };
      }

      productSummaryMap[item.name].totalQty += Number(item.quantity) || 0;
      productSummaryMap[item.name].revenue +=
        (Number(item.price) || 0) * (Number(item.quantity) || 0);
    });
  });

  const bestSellingProducts = Object.values(productSummaryMap)
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 5);

  const revenueLast7Days = getRevenueLast7Days(orders);

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
          <section
            className="admin-denied container"
            style={{ padding: "40px 0" }}
          >
            <h2>Access Denied</h2>
            <p>Chỉ tài khoản Admin mới được truy cập Dashboard.</p>
            <p>Hãy đăng nhập bằng:</p>
            <p>
              <strong>Email:</strong> admin@vnj.com
            </p>
            <p>
              <strong>Password:</strong> 123456
            </p>
          </section>
        ) : loading ? (
          <section className="container" style={{ padding: "40px 0" }}>
            <h2>Loading dashboard...</h2>
          </section>
        ) : (
          <section className="admin-dashboard">
            <aside className="admin-sidebar">
              <div className="admin-menu-group">
                <p className="admin-menu-title">Main menu</p>
                <a href="#" className="admin-menu-item active">
                  Dashboard
                </a>

                <Link to="/admin/orders" className="admin-menu-item">
                  Order Management
                </Link>
                <Link to="/admin/customers" className="admin-menu-item">
                  Customers
                </Link>
                <Link to="/admin/coupons" className="admin-menu-item">
                  Coupon Code
                </Link>
              </div>

              <div className="admin-menu-group">
                <p className="admin-menu-title">Product</p>
                <Link to="/admin/products/add" className="admin-menu-item">
                  Add Products
                </Link>
                
              </div>

              <div className="admin-menu-group">
                <p className="admin-menu-title">Admin</p>
                <Link to="/admin/roles" className="admin-menu-item">
  Admin role
</Link>
                
              </div>
            </aside>

            <div className="admin-content">
              <div className="admin-topbar">
                <h2>Dashboard</h2>
                <div className="admin-topbar-right">
                  <input
                    type="text"
                    placeholder="Search data, users, or reports"
                  />
                  <i className="fa-regular fa-bell"></i>
                  <div className="admin-avatar">
                    {currentUser?.name?.charAt(0) || "A"}
                  </div>
                </div>
              </div>

              <div className="admin-main-grid">
                <div className="admin-left">
                  <div className="admin-stats">
                    <div className="admin-stat-card">
                      <p>Total Income</p>
                      <h3>{formatPrice(totalSales)}</h3>
                      <span>Updated from paid orders</span>
                    </div>

                    <div className="admin-stat-card">
                      <p>Total Orders</p>
                      <h3>{totalOrders}</h3>
                      <span>Auto updated after checkout</span>
                    </div>

                    <div className="admin-stat-card">
                      <p>Pending / Canceled</p>
                      <h3>
                        {pendingOrders} / {canceledOrders}
                      </h3>
                      <span>Live from order storage</span>
                    </div>
                  </div>

                  <div className="admin-panel admin-report-panel">
                    <div className="admin-panel-header">
                      <h4>Revenue - Last 7 Days ( $ )</h4>
                      <button type="button">Details</button>
                    </div>

                    <div className="admin-chart-placeholder">
                      <div className="simple-chart">
                        {renderRevenueBars(revenueLast7Days)}
                      </div>
                    </div>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h4>Transactions</h4>
                      <button type="button">Latest</button>
                    </div>

                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Customer</th>
                          <th>Order Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                        </tr>
                      </thead>

                      <tbody>
                        {latestTransactions.length ? (
                          latestTransactions.map((order, index) => (
                            <tr key={order._id || order.id || index}>
                              <td>{index + 1}</td>
                              <td>{order.customerName}</td>
                              <td>
                                {order.createdAt
                                  ? new Date(order.createdAt).toLocaleString()
                                  : ""}
                              </td>
                              <td>{order.status}</td>
                              <td>{formatPrice(Number(order.total) || 0)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5">Chưa có giao dịch nào.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h4>Best selling product</h4>
                      <button type="button">Auto</button>
                    </div>

                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Total Order Qty</th>
                          <th>Status</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>

                      <tbody>
                        {bestSellingProducts.length ? (
                          bestSellingProducts.map((item, index) => {
                            const matchedProduct = products.find(
                              (p) => p.name === item.name
                            );
                            const productImage =
                              matchedProduct?.images?.[0] || "";

                            return (
                              <tr key={item.name || index}>
                                <td>
                                  <div className="admin-product-cell">
                                    <img src={productImage} alt={item.name} />
                                    <div>
                                      <strong>{item.name}</strong>
                                      <span>Top seller</span>
                                    </div>
                                  </div>
                                </td>
                                <td>{item.totalQty}</td>
                                <td>
                                  <span className="admin-status in-stock">
                                    In Report
                                  </span>
                                </td>
                                <td>{formatPrice(item.revenue)}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="4">
                              Chưa có dữ liệu sản phẩm bán chạy.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="admin-right">
                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h4>Users in last 30 minutes</h4>
                    </div>
                    <h3
                      style={{
                        fontSize: "22px",
                        margin: "0 0 6px",
                        fontWeight: 800
                      }}
                    >
                      21.5K
                    </h3>
                    <p
                      style={{
                        fontSize: "10px",
                        color: "#888",
                        margin: "0 0 8px"
                      }}
                    >
                      Users per minute
                    </p>
                    <div className="admin-mini-chart">
                      {[12, 18, 25, 15, 20, 30, 28, 35, 22, 18, 26].map(
                        (v, i) => (
                          <span key={i} style={{ height: v }}></span>
                        )
                      )}
                    </div>
                    <button className="admin-black-btn">View Insight</button>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h4>Top Products</h4>
                      <a href="#">All product</a>
                    </div>

                    <div className="admin-product-list">
                      {bestSellingProducts.length ? (
                        bestSellingProducts.map((item, index) => {
                          const matchedProduct = products.find(
                            (p) => p.name === item.name
                          );
                          const productImage =
                            matchedProduct?.images?.[0] || "";

                          return (
                            <div
                              className="admin-product-row"
                              key={item.name || index}
                            >
                              <div className="admin-product-info">
                                <img src={productImage} alt={item.name} />
                                <div>
                                  <span>{item.name}</span>
                                  <small>{item.totalQty} sold</small>
                                </div>
                              </div>
                              <strong>{formatPrice(item.revenue)}</strong>
                            </div>
                          );
                        })
                      ) : (
                        <div className="admin-product-row">
                          <span>No data yet</span>
                          <strong>0</strong>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-panel">
                    <div className="admin-panel-header">
                      <h4>Total Paid Revenue</h4>
                      <a href="#">Finance</a>
                    </div>

                    <div className="admin-category-list">
                      <div className="admin-category-item">
                        {formatPrice(totalSales)}
                      </div>
                      <div className="admin-category-item">
                        Orders: {totalOrders}
                      </div>
                      <div className="admin-category-item">
                        Role: {currentUser.role}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

function getRevenueLast7Days(allOrders) {
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const key = d.toISOString().slice(0, 10);

    const dayRevenue = allOrders
      .filter((order) => order.createdAt?.slice(0, 10) === key)
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    result.push({
      label: `${d.getDate()}/${d.getMonth() + 1}`,
      total: dayRevenue
    });
  }

  return result;
}

function renderRevenueBars(data) {
  const maxValue = Math.max(...data.map((item) => item.total), 1);

  return data.map((item, index) => (
    <div className="chart-bar-wrap" key={index}>
      <div className="chart-value">
        {item.total > 0 ? item.total.toFixed(0) : ""}
      </div>
      <div
        className="chart-bar"
        style={{ height: `${(item.total / maxValue) * 180}px` }}
      ></div>
      <div className="chart-label">{item.label}</div>
    </div>
  ));
}