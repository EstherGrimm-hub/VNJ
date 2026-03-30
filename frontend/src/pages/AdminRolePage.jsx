import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import { getCart, saveCart, getCurrentUser } from "../utils/storage";
import { fetchUsers, updateUserRole } from "../services/userServices";

export default function AdminRolePage() {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const result = await fetchUsers();
        setUsers(result.users || []);
      } catch (error) {
        console.error("loadUsers error:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    try {
      const result = await updateUserRole(userId, newRole);

      if (!result.success) {
        alert(result.message || "Không thể cập nhật role.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      alert("Cập nhật role thành công.");
    } catch (error) {
      console.error("handleChangeRole error:", error);
      alert("Lỗi khi cập nhật role.");
    }
  };

  return (
    <>
      <Navbar
        currentUser={currentUser}
        cartCount={cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)}
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
          <section className="container" style={{ padding: "40px 0" }}>
            <h2>Access Denied</h2>
            <p>Chỉ admin mới được truy cập trang phân quyền.</p>
          </section>
        ) : loading ? (
          <section className="container" style={{ padding: "40px 0" }}>
            <h2>Loading role management...</h2>
          </section>
        ) : (
          <section className="container" style={{ padding: "40px 0" }}>
            <h2 style={{ marginBottom: "20px" }}>Admin Role Management</h2>

            <table className="admin-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length ? (
                  users.map((user, index) => (
                    <tr key={user._id || index}>
                      <td>{index + 1}</td>
                      <td>{user.name || "No name"}</td>
                      <td>{user.email || "No email"}</td>
                      <td>{user.role || "customer"}</td>
                      <td>
                        <select
                          value={user.role || "customer"}
                          onChange={(e) =>
                            handleChangeRole(user._id, e.target.value)
                          }
                        >
                          <option value="customer">customer</option>
                          <option value="admin">admin</option>
                          <option value="doctor">doctor</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">Chưa có user nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}