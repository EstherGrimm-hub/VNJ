import React, { useEffect, useState } from "react";
import QuickCart from "../components/QuickCart";
import { getCart, saveCart, getCurrentUser } from "../utils/storage";
import { fetchUsers } from "../services/userServices";

export default function CustomersPage() {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", password: "" });

  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadCustomers = async () => {
      const user = getCurrentUser();
      // Only load customers if user is admin
      if (!user || user.role !== "admin") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await fetchUsers();
        setCustomers(result.users || []);
      } catch (error) {
        console.error("loadCustomers error:", error);
        if (error.message?.includes('401') || error.status === 401) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        } else {
          setError("Không thể tải danh sách khách hàng.");
        }
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const openAddCustomerModal = () => {
    setIsEditMode(false);
    setEditingCustomerId(null);
    setCustomerForm({ name: "", email: "", password: "" });
    setIsCustomerModalOpen(true);
  };

  const openEditCustomerModal = (customer) => {
    setIsEditMode(true);
    setEditingCustomerId(customer._id || customer.id);
    setCustomerForm({ name: customer.name || "", email: customer.email || "", password: "" });
    setIsCustomerModalOpen(true);
  };

  const closeCustomerModal = () => {
    setIsCustomerModalOpen(false);
    setCustomerForm({ name: "", email: "", password: "" });
    setEditingCustomerId(null);
    setIsEditMode(false);
  };

  const handleSaveCustomer = async () => {
    const name = customerForm.name.trim();
    const email = customerForm.email.trim();
    const password = customerForm.password.trim();

    if (!name || !email || (!isEditMode && !password)) {
      alert("Vui lòng nhập đủ thông tin.");
      return;
    }

    try {
      const token = currentUser?.token || localStorage.getItem("token");
      if (isEditMode) {
        const res = await fetch(`http://localhost:5000/api/users/${editingCustomerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name, email })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Cập nhật khách hàng thất bại.");
        }

        const data = await res.json();
        const updated = data.user || data;
        setCustomers(customers.map(c => (c._id === editingCustomerId || c.id === editingCustomerId) ? updated : c));
        alert("Cập nhật khách hàng thành công!");
      } else {
        const res = await fetch(`http://localhost:5000/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name, email, password, role: "customer" })
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Thêm khách hàng thất bại.");
        }

        const data = await res.json();
        setCustomers([...customers, data.user || data]);
        alert("Thêm khách hàng thành công!");
      }

      closeCustomerModal();
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.message || "Lỗi kết nối.");
    }
  };

  // Hàm xóa khách hàng
  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/users/${id}`, { 
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          setCustomers(customers.filter(c => c._id !== id && c.id !== id));
          alert("Đã xóa khách hàng thành công!");
        } else {
          alert("Có lỗi xảy ra khi xóa khách hàng.");
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi kết nối khi xóa khách hàng.");
      }
    }
  };

  return (
    <>
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
            <p>Chỉ tài khoản Admin mới được truy cập trang này.</p>
          </section>
        ) : (
          <section className="container" style={{ padding: "30px 0 50px" }}>
            <div className="admin-panel" style={{ marginBottom: "20px" }}>
              <div className="admin-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Customers</h4>
                <button onClick={openAddCustomerModal} className="admin-black-btn" style={{ padding: "8px 16px", width: "auto" }}>+ Thêm KH</button>
              </div>

              {loading ? (
                <p>Loading customers...</p>
              ) : error ? (
                <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                  <p>{error}</p>
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.length ? (
                      customers.map((customer, index) => (
                        <tr key={customer._id || customer.id || index}>
                          <td>{index + 1}</td>
                          <td>{customer.name || "No name"}</td>
                          <td>{customer.email || "No email"}</td>
                          <td>{customer.role || "customer"}</td>
                          <td>
                            <button onClick={() => openEditCustomerModal(customer)} style={{ marginRight: '10px', color: 'blue', cursor: 'pointer', background: 'none', border: 'none' }}>Sửa</button>
                            <button onClick={() => handleDeleteCustomer(customer._id || customer.id)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>Xóa</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">Chưa có khách hàng nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>

      {isCustomerModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            width: '100%', maxWidth: '430px', backgroundColor: '#fff', borderRadius: '10px', padding: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', position: 'relative'
          }}>
            <button onClick={closeCustomerModal} style={{ position: 'absolute', top: '14px', right: '14px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
            <h3>{isEditMode ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}</h3>

            <div style={{ marginBottom: '10px' }}>
              <label>Tên</label>
              <input type="text" value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label>Email</label>
              <input type="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
            </div>
            {!isEditMode && (
              <div style={{ marginBottom: '10px' }}>
                <label>Mật khẩu</label>
                <input type="password" value={customerForm.password} onChange={(e) => setCustomerForm({ ...customerForm, password: e.target.value })} style={{ width: '100%', padding: '8px', marginTop: '4px' }} />
              </div>
            )}

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={closeCustomerModal} style={{ padding: '8px 14px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}>Hủy</button>
              <button onClick={handleSaveCustomer} style={{ padding: '8px 14px', border: 'none', background: '#111', color: '#fff', cursor: 'pointer' }}>{isEditMode ? 'Lưu' : 'Thêm'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}