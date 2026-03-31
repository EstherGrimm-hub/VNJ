import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../services/productService";
import { getCurrentUser, formatPrice } from "../utils/storage";
import AddProductPage from "./AddProductPage";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const loadProducts = async () => {
    try {
      setLoading(true);
      const result = await fetchProducts();
      setProducts(result.products || []);
    } catch (error) {
      console.error("loadProducts error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleEditProduct = (productId) => {
    const product = products.find(p => (p._id || p.id) === productId);
    if (product) {
      setEditingProduct(product);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/products/${productId}`, { 
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          setProducts(products.filter(p => p._id !== productId && p.id !== productId));
          alert("Đã xóa sản phẩm thành công!");
        } else {
          const errorData = await res.json();
          alert(errorData.message || "Lỗi khi xóa sản phẩm.");
        }
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Lỗi kết nối khi xóa sản phẩm.");
      }
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
    <section className="container" style={{ padding: "30px 0 50px", position: "relative" }}>
      <div className="admin-panel">
        <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h4>Product List</h4>
          <button onClick={() => setShowAddModal(true)} className="admin-black-btn" style={{ padding: "8px 16px", width: "auto" }}>
            + Thêm sản phẩm
          </button>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((product, index) => (
                  <tr key={product._id || product.id || index}>
                    <td>{index + 1}</td>
                    <td>
                      <img src={product.images?.[0]} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'normal' }}>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button onClick={() => handleEditProduct(product._id || product.id)} style={{ marginRight: '10px', color: 'blue', cursor: 'pointer', background: 'none', border: 'none' }}>Sửa</button>
                      <button onClick={() => handleDeleteProduct(product._id || product.id)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">Không có sản phẩm nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL THÊM SẢN PHẨM MỚI */}
      {showAddModal && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          overflowY: 'auto', padding: '40px 20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '900px', backgroundColor: '#fff',
            borderRadius: '12px', padding: '24px', position: 'relative',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <button
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#555', zIndex: 10 }}
            >
              &times;
            </button>
            <AddProductPage isModal={true} onClose={() => setShowAddModal(false)} onProductAdded={loadProducts} />
          </div>
        </div>
      )}

      {/* MODAL SỬA SẢN PHẨM */}
      {editingProduct && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          overflowY: 'auto', padding: '40px 20px'
        }}>
          <div style={{
            width: '100%', maxWidth: '900px', backgroundColor: '#fff',
            borderRadius: '12px', padding: '24px', position: 'relative',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <button
              onClick={() => setEditingProduct(null)}
              style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#555', zIndex: 10 }}
            >
              &times;
            </button>
            <AddProductPage 
              isModal={true} 
              productToEdit={editingProduct} 
              onClose={() => setEditingProduct(null)} 
              onProductUpdated={async (updatedData) => {
                try {
                  const id = editingProduct._id || editingProduct.id;
                  const token = localStorage.getItem("token");
                  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
                    method: "PUT",
                    headers: { 
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData),
                  });
                  if (res.ok) {
                    const updatedProductFromServer = await res.json();
                    setProducts(products.map(p => (p._id || p.id) === id ? updatedProductFromServer.product : p));
                    alert("Đã cập nhật sản phẩm thành công!");
                    setEditingProduct(null); // Đóng modal khi thành công
                  } else {
                    const errorData = await res.json();
                    alert(errorData.message || "Có lỗi xảy ra khi cập nhật sản phẩm.");
                  }
                } catch (error) {
                  console.error("Lỗi:", error);
                  alert("Lỗi kết nối khi cập nhật sản phẩm.");
                }
              }} 
            />
          </div>
        </div>
      )}
    </section>
  );
}