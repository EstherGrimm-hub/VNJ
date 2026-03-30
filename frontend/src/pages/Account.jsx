import { useEffect, useState } from "react";
import { clearCurrentUser, getCurrentUser } from "../utils/storage";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserOrders = async () => {
      const savedUser = getCurrentUser();
      setUser(savedUser);

      if (!savedUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/user/${savedUser.id}`
        );
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders || []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Lỗi lấy đơn hàng:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, []);

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/");
  };

  if (loading) {
    return <div className="account-loading">Đang tải dữ liệu...</div>;
  }

  if (!user) {
    return <div className="account-loading">Bạn chưa đăng nhập.</div>;
  }

  const latestOrderDate = orders.length
    ? new Date(orders[0].createdAt).toLocaleDateString()
    : "Chưa có";

  return (
    <div className="profile-page">
      <div className="profile-shell modern-account-shell">
        <aside className="profile-sidebar modern-sidebar">
          <button className="profile-back-btn" onClick={() => navigate("/")}>
            ←
          </button>

          <div className="profile-user-block modern-user-block">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar">
                {user.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>

            <h2>{user.name}</h2>
            <p>{user.role === "admin" ? "Administrator" : "Customer"}</p>

            <div className="profile-user-meta">
              <span>{user.email}</span>
            </div>
          </div>

          <div className="profile-menu modern-profile-menu">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              Profile
            </button>

            <button
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              Order History
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </aside>

        <section className="profile-main modern-profile-main">
          <div className="account-page-header">
            <div>
              <h1>{activeTab === "profile" ? "Tài khoản của bạn" : "Lịch sử đơn hàng"}</h1>
              <p>
                {activeTab === "profile"
                  ? "Quản lý thông tin cá nhân và xem tổng quan hoạt động."
                  : "Theo dõi các đơn hàng bạn đã đặt gần đây."}
              </p>
            </div>
          </div>

          {activeTab === "profile" && (
            <>
              <div className="account-summary-grid">
                <div className="overview-box modern-overview-box">
                  <span>Tổng đơn hàng</span>
                  <strong>{orders.length}</strong>
                </div>

                <div className="overview-box modern-overview-box">
                  <span>Đơn gần nhất</span>
                  <strong>{latestOrderDate}</strong>
                </div>

                <div className="overview-box modern-overview-box">
                  <span>Vai trò</span>
                  <strong>{user.role}</strong>
                </div>
              </div>

              <div className="profile-card modern-profile-card">
                <h3>Thông tin cá nhân</h3>

                <div className="info-grid modern-info-grid">
                  <div className="info-item">
                    <span>ID người dùng</span>
                    <strong>{user.id}</strong>
                  </div>

                  <div className="info-item">
                    <span>Họ tên</span>
                    <strong>{user.name}</strong>
                  </div>

                  <div className="info-item">
                    <span>Email</span>
                    <strong>{user.email}</strong>
                  </div>

                  <div className="info-item">
                    <span>Vai trò</span>
                    <strong>{user.role}</strong>
                  </div>
                </div>
              </div>

              <div className="profile-card modern-profile-card">
                <h3>Đơn hàng gần đây</h3>

                {orders.length === 0 ? (
                  <p className="empty-order">Bạn chưa có đơn hàng nào.</p>
                ) : (
                  <div className="recent-orders-preview">
                    {orders.slice(0, 2).map((order) => (
                      <div
                        className="recent-order-card"
                        key={order._id || order.id}
                      >
                        <div className="recent-order-top">
                          <div>
                            <span>Mã đơn</span>
                            <strong>{order._id || order.id}</strong>
                          </div>
                          <div>
                            <span>Tổng tiền</span>
                            <strong>{Number(order.total || 0).toLocaleString()}đ</strong>
                          </div>
                          <div>
                            <span>Ngày tạo</span>
                            <strong>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "orders" && (
            <div className="profile-card modern-profile-card">
              <h3>Lịch sử đơn hàng</h3>

              {orders.length === 0 ? (
                <p className="empty-order">Bạn chưa có đơn hàng nào.</p>
              ) : (
                <div className="orders-list modern-orders-list">
                  {orders.map((order) => (
                    <div className="order-item modern-order-item" key={order._id || order.id}>
                      <div className="order-header-grid">
                        <div className="order-header-box">
                          <span>Mã đơn</span>
                          <strong>{order._id || order.id}</strong>
                        </div>

                        <div className="order-header-box">
                          <span>Trạng thái</span>
                          <strong className="order-status-badge">
                            {order.status}
                          </strong>
                        </div>

                        <div className="order-header-box">
                          <span>Ngày tạo</span>
                          <strong>
                            {new Date(order.createdAt).toLocaleString()}
                          </strong>
                        </div>

                        <div className="order-header-box">
                          <span>Tổng tiền</span>
                          <strong>{Number(order.total || 0).toLocaleString()}đ</strong>
                        </div>
                      </div>

                      <div className="order-products modern-order-products">
                        <p className="order-products-title">Sản phẩm trong đơn</p>

                        <div className="order-products-list">
                          {(order.items || []).map((item, index) => {
                            const itemImage =
                              Array.isArray(item.images) && item.images.length > 0
                                ? item.images[0]
                                : item.image || null;

                            return (
                              <div className="order-product-card" key={index}>
                                <div className="order-product-image-wrap">
                                  {itemImage ? (
                                    <img
                                      src={itemImage}
                                      alt={item.name}
                                      className="order-product-image"
                                    />
                                  ) : (
                                    <div className="order-product-no-image">
                                      No Image
                                    </div>
                                  )}
                                </div>

                                <div className="order-product-info">
                                  <h4>{item.name}</h4>

                                  <div className="order-product-meta">
                                    <span>SL: {item.quantity}</span>
                                    {item.size && <span>Size: {item.size}</span>}
                                    <span>
                                      Giá: {Number(item.price || 0).toLocaleString()}đ
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {order.couponCode && (
                        <div className="order-extra-row">
                          <span>Mã giảm giá</span>
                          <strong>{order.couponCode}</strong>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Account;