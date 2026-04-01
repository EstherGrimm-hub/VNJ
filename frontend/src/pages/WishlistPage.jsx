import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import ProductCard from "../components/ProductCard";
import { getCurrentUser } from "../utils/storage";
import { fetchWishlist, removeFromWishlist } from "../services/userServices";

export default function WishlistPage({ currentUser, onLogout }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        const response = await fetchWishlist();
        if (response.success) {
          setWishlist(response.wishlist || []);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("loadWishlist error:", err);
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadWishlist();
    } else {
      setLoading(false);
      setWishlist([]);
    }
  }, [currentUser]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (err) {
      console.error("removeFromWishlist error:", err);
      alert(err.message || "Không thể xoá sản phẩm khỏi wishlist.");
    }
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        cartCount={0}
        onCartClick={() => setIsCartOpen(true)}
        onOpenAuth={() => {}}
        onLogout={onLogout}
      />

      <QuickCart isOpen={isCartOpen} cart={cart} onClose={() => setIsCartOpen(false)} />

      <main style={{ background: "#f3f4f7" }}>
        <div className="breadcrumb container">
          <Link to="/">Home</Link>
          <span> &gt; </span>
          <span className="current">Wishlist</span>
        </div>

        <div className="container">
          <section className="wishlist-section">
            <div className="wishlist-header">
              <h1>My Wishlist</h1>
              <p className="wishlist-subtitle">{wishlist.length} items saved</p>
            </div>

            {!currentUser && (
              <div className="wishlist-empty-state">
                <i className="fa-regular fa-heart" style={{ fontSize: "48px", marginBottom: "16px" }}></i>
                <p>Vui lòng đăng nhập để xem wishlist của bạn.</p>
                <Link to="/" className="btn-back">Quay về trang chủ</Link>
              </div>
            )}

            {currentUser && (
              <>
                {loading ? (
                  <div className="wishlist-loading">
                    <p>Đang tải wishlist...</p>
                  </div>
                ) : wishlist.length === 0 ? (
                  <div className="wishlist-empty-state">
                    <i className="fa-regular fa-heart" style={{ fontSize: "48px", marginBottom: "16px" }}></i>
                    <p>Wishlist của bạn trống.</p>
                    <p style={{ fontSize: "14px", color: "#999", marginBottom: "20px" }}>
                      Hãy thêm các sản phẩm yêu thích để lưu lại.
                    </p>
                    <Link to="/" className="btn-back">Tiếp tục mua sắm</Link>
                  </div>
                ) : (
                  <div className="wishlist-content">
                    <div className="product-grid">
                      {wishlist.map((product) => (
                        <div key={product._id} className="wishlist-item">
                          <ProductCard product={product} />
                          <button
                            className="wishlist-remove-btn"
                            onClick={() => handleRemove(product._id)}
                            title="Remove from wishlist"
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
