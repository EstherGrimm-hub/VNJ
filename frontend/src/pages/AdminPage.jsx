import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import OrdersManagement from "../pages/OrdersManagement";
import CustomersPage from "../pages/CustomersPage";
import CouponsPage from "../pages/CouponsPage";
import AddProductPage from "../pages/AddProductPage";
import AdminRolePage from "../pages/AdminRolePage";
import ProductListPage from "../pages/ProductListPage";
import { Link, useSearchParams } from "react-router-dom";
import {
  getCart,
  saveCart,
  getCurrentUser,
  formatPrice
} from "../utils/storage";
import { fetchOrders } from "../services/orderService";
import { fetchProducts } from "../services/productService";



export default function AdminPage({ currentUser, onLogout }) {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // const currentUser = getCurrentUser(); // Đã được truyền vào từ props

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
    const orderSubtotal = Number(order.subtotal) || 0;
    const orderDiscount = Number(order.discountAmount) || 0;

    (order.items || []).forEach((item) => {
      if (!productSummaryMap[item.name]) {
        productSummaryMap[item.name] = {
          name: item.name,
          totalQty: 0,
          revenue: 0,
        };
      }

      const itemPrice = Number(item.price) || 0;
      const itemQty = Number(item.quantity) || 0;
      const itemTotalValue = itemPrice * itemQty;

      productSummaryMap[item.name].totalQty += itemQty;

      // Tính toán doanh thu thực tế của sản phẩm,
      // bằng cách phân bổ đều coupon (nếu có) cho từng sản phẩm trong đơn hàng.
      let itemRevenue = itemTotalValue;
      if (orderSubtotal > 0 && orderDiscount > 0) {
        itemRevenue -= (itemTotalValue / orderSubtotal) * orderDiscount;
      }
      productSummaryMap[item.name].revenue += itemRevenue;
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
        onLogout={onLogout}
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
            <p>Hãy đăng nhập bằng tài khoản Admin để truy cập trang này.</p>
          </section>
        ) : loading ? (
          <section className="container" style={{ padding: "40px 0" }}>
            <h2>Loading dashboard...</h2>
          </section>
        ) : (
          <section className="admin-dashboard">
            <aside className="admin-sidebar">
              {/* ======================================= */}
              {/* ĐÃ CHỈNH SỬA: SỬ DỤNG ?tab= ĐỂ ĐIỀU HƯỚNG */}
              {/* ======================================= */}
              <div className="admin-menu-group">
                <p className="admin-menu-title">Main menu</p>
                <Link 
                  to="?tab=dashboard" 
                  className={`admin-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="?tab=orders" 
                  className={`admin-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
                >
                  Order Management
                </Link>
                <Link 
                  to="?tab=customers" 
                  className={`admin-menu-item ${activeTab === 'customers' ? 'active' : ''}`}
                >
                  Customers
                </Link>
                <Link 
                  to="?tab=coupons" 
                  className={`admin-menu-item ${activeTab === 'coupons' ? 'active' : ''}`}
                >
                  Coupon Code
                </Link>
              </div>

              <div className="admin-menu-group">
                <p className="admin-menu-title">Product</p>
                <Link 
                  to="?tab=products" 
                  className={`admin-menu-item ${activeTab === 'products' ? 'active' : ''}`}
                >
                  Products
                </Link>
              </div>

              <div className="admin-menu-group">
                <p className="admin-menu-title">Admin</p>
                <Link 
                  to="?tab=roles" 
                  className={`admin-menu-item ${activeTab === 'roles' ? 'active' : ''}`}
                >
                  Admin role
                </Link>
              </div>
            </aside>

            <div className="admin-content">
              {/* ==================================================== */}
              {/* KỸ THUẬT KEEP-ALIVE: ẨN HIỆN TAB BẰNG DISPLAY: NONE  */}
              {/* ==================================================== */}

              {/* TAB 1: DASHBOARD (Toàn bộ code cũ của bạn nằm trong thẻ div này) */}
              <div style={{ display: activeTab === 'dashboard' ? 'block' : 'none' }}>
                

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
                                {/* ĐÃ CHỈNH SỬA: LIÊN KẾT CHÉO SANG TAB CUSTOMERS */}
                                <td>
                                  <span 
                                    onClick={() => handleTabChange('customers')}
                                    style={{ 
                                      cursor: "pointer", 
                                      color: "#007bff", 
                                      fontWeight: "600" 
                                    }}
                                    title="View this customer details"
                                  >
                                    {order.customerName}
                                  </span>
                                </td>
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
                                matchedProduct?.images?.[0] || null;

                              return (
                                <tr key={item.name || index}>
                                  <td>
                                    <div className="admin-product-cell">
                                      {productImage ? (
                                        <img src={productImage} alt={item.name} />
                                      ) : (
                                        <div 
                                          className="admin-product-placeholder"
                                          style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '10px',
                                            color: '#666',
                                            borderRadius: '4px'
                                          }}
                                        >
                                          No Image
                                        </div>
                                      )}
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
                              matchedProduct?.images?.[0] || null;

                            return (
                              <div
                                className="admin-product-row"
                                key={item.name || index}
                              >
                                <div className="admin-product-info">
                                  {productImage ? (
                                    <img src={productImage} alt={item.name} />
                                  ) : (
                                    <div 
                                      className="admin-product-placeholder"
                                      style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#f0f0f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        color: '#666',
                                        borderRadius: '4px'
                                      }}
                                    >
                                      No Image
                                    </div>
                                  )}
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

              {/* TAB 2: QUẢN LÝ ĐƠN HÀNG */}
              <div style={{ display: activeTab === 'orders' ? 'block' : 'none' }}>
                  <OrdersManagement orders={orders} setActiveTab={handleTabChange} />
              </div>

              {/* TAB 3: QUẢN LÝ KHÁCH HÀNG */}
              <div style={{ display: activeTab === 'customers' ? 'block' : 'none' }}>
                  <CustomersPage />
              </div>

              {/* TAB 4: MÃ GIẢM GIÁ */}
              <div style={{ display: activeTab === 'coupons' ? 'block' : 'none' }}>
                  <CouponsPage />
              </div>

              {/* TAB: DANH SÁCH SẢN PHẨM */}
              <div style={{ display: activeTab === 'products' ? 'block' : 'none' }}>
                  <ProductListPage />
              </div>

              {/* TAB 5: THÊM SẢN PHẨM */}
              <div style={{ display: activeTab === 'add-product' ? 'block' : 'none' }}>
                  <AddProductPage />
              </div>

              {/* TAB 6: ADMIN ROLES */}
              <div style={{ display: activeTab === 'roles' ? 'block' : 'none' }}>
                  <AdminRolePage />
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