import React, { useEffect, useMemo, useState } from "react";
import AuthModal from "../components/AuthModal";
import QuickCart from "../components/QuickCart";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { siteContent } from "../data/siteContent";
import { clearCurrentUser, getCart, getCurrentUser } from "../utils/storage";
import { fetchProducts } from "../services/productService";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const cart = getCart();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const result = await fetchProducts(selectedCategory || "");
      setProducts(result.products || []);
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <>
      <Navbar
        currentUser={currentUser}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => {
          clearCurrentUser();
          setCurrentUser(null);
          alert("Bạn đã đăng xuất.");
        }}
      />

      <QuickCart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUser(user)}
      />

      <main>
        <section className="hero-section">
          <div className="container hero-content">
            <div className="hero-text">
              <h1>{siteContent.hero.title}</h1>
              <p>{siteContent.hero.description}</p>
              <button className="shop-btn">{siteContent.hero.buttonText}</button>
            </div>

            <div className="hero-image">
              <img src={siteContent.hero.image} alt={siteContent.hero.title} />
            </div>
          </div>
        </section>

        <section className="brands-section">
          <div className="container brand-strip">
            {siteContent.brands.map((brand, index) => (
              <div className="brand-item" key={index}>
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
          </div>
        </section>

        <section className="category-section">
          <div className="container">
            <h2 className="section-title">Shop By Category</h2>

            <div className="category-grid">
              {siteContent.categories.map((category) => (
                <div className="category-card" key={category.key}>
                  <img src={category.image} alt={category.title} />

                  <button
                    className="category-filter-btn"
                    onClick={() => setSelectedCategory(category.key)}
                  >
                    {category.title}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="products-section">
          <div className="container">
            <div className="products-header">
              <h2 className="section-title">
                {selectedCategory
                  ? siteContent.categories.find((c) => c.key === selectedCategory)?.title
                  : "All Products"}
              </h2>

              <button
                className="view-all"
                onClick={() => setSelectedCategory(null)}
              >
                View All
              </button>
            </div>

            <div className="product-grid">
              {loading ? (
                <p>Loading products...</p>
              ) : (
                products.map((product) => (
  <ProductCard key={product._id || product.id} product={product} />
))
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}