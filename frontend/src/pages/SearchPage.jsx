import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/productService";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage({ currentUser, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useQuery();
  const initialQuery = query.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchQuery = new URLSearchParams(location.search).get("q") || "";
    setSearchTerm(searchQuery);

    const loadProducts = async () => {
      setLoading(true);
      const result = await fetchProducts("", searchQuery);
      const data = result.products || [];
      const lowerQuery = searchQuery.trim().toLowerCase();
      const sortedData = data
        .map((p) => {
          const name = (p.name || "").toLowerCase();
          const desc = (p.description || "").toLowerCase();
          const category = (p.category || "").toLowerCase();
          let score = 0;

          if (lowerQuery && name.startsWith(lowerQuery)) score += 100;
          else if (lowerQuery && name.includes(lowerQuery)) score += 75;

          if (lowerQuery && category.startsWith(lowerQuery)) score += 40;
          else if (lowerQuery && category.includes(lowerQuery)) score += 20;

          if (lowerQuery && desc.includes(lowerQuery)) score += 20;

          return { product: p, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((x) => x.product);

      setProducts(sortedData);
      setLoading(false);
    };

    loadProducts();
  }, [location.search]);

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      navigate("/");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        cartCount={0}
        onCartClick={() => {}}
        onOpenAuth={() => {}}
        onLogout={onLogout}
        searchTerm={searchTerm}
        onSearchTermChange={(value) => setSearchTerm(value)}
        onSearch={handleSearch}
      />

      <main>
        <section className="search-page container" style={{ padding: "40px 0" }}>
          <h2 style={{ marginBottom: "20px" }}>
            Kết quả tìm kiếm cho: <strong>{`"${searchTerm}"`}</strong>
          </h2>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>Không tìm thấy sản phẩm phù hợp.</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <button
              className="view-all"
              type="button"
              onClick={() => navigate("/")}
            >
              Quay về trang chủ
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
