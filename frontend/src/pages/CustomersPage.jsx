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

  // Hàm thêm khách hàng
  const handleAddCustomer = async () => {
    const name = prompt("Nhập tên khách hàng:");
    const email = prompt("Nhập email khách hàng:");
    const password = prompt("Nhập mật khẩu cho khách hàng mới:");
    if (name && email && password) {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/users`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name, email, password, role: "customer" }),
        });
        const data = await res.json();
        if (res.ok) {
          setCustomers([...customers, data]); // Giả định backend trả về user vừa tạo
          alert("Đã thêm khách hàng thành công!");
        } else {
          alert(data.message || "Có lỗi xảy ra khi thêm khách hàng.");
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi kết nối khi thêm khách hàng.");
      }
    }
  };

  // Hàm sửa tên khách hàng
  const handleEditCustomer = async (id, currentName) => {
    const newName = prompt("Nhập tên mới:", currentName);
    if (newName && newName.trim() !== "") {
      try {
        const token = currentUser?.token || localStorage.getItem("token");
        const res = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ name: newName }),
        });
        if (res.ok) {
          setCustomers(customers.map(c => (c._id === id || c.id === id) ? { ...c, name: newName } : c));
          alert("Cập nhật tên thành công!");
        } else {
          alert("Có lỗi xảy ra khi cập nhật tên.");
        }
      } catch (error) {
        console.error("Lỗi:", error);
        alert("Lỗi kết nối khi cập nhật tên.");
      }
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
                <button onClick={handleAddCustomer} className="admin-black-btn" style={{ padding: "8px 16px", width: "auto" }}>+ Thêm KH</button>
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
                            <button onClick={() => handleEditCustomer(customer._id || customer.id, customer.name)} style={{ marginRight: '10px', color: 'blue', cursor: 'pointer', background: 'none', border: 'none' }}>Sửa</button>
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
    </>
  );
}