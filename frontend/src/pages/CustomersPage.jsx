import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import { getCart, saveCart, getCurrentUser } from "../utils/storage";
import { fetchUsers } from "../services/userServices";

export default function CustomersPage() {
  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }, [cart]);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const result = await fetchUsers();
        setCustomers(result.users || []);
      } catch (error) {
        console.error("loadCustomers error:", error);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const keyword = search.toLowerCase();
    return (
      (customer.name || "").toLowerCase().includes(keyword) ||
      (customer.email || "").toLowerCase().includes(keyword)
    );
  });

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
          <section className="admin-denied container" style={{ padding: "40px 0" }}>
            <h2>Access Denied</h2>
            <p>Chỉ tài khoản Admin mới được truy cập Customers.</p>
          </section>
        ) : (
          <section className="container" style={{ padding: "30px 0 50px" }}>
            <div className="admin-panel" style={{ marginBottom: "20px" }}>
              <div className="admin-panel-header">
                <h4>Customers</h4>
              </div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    maxWidth: "320px",
                    height: "40px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    padding: "0 14px",
                    outline: "none"
                  }}
                />
              </div>

              {loading ? (
                <p>Loading customers...</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length ? (
                      filteredCustomers.map((customer, index) => (
                        <tr key={customer._id || customer.id || index}>
                          <td>{index + 1}</td>
                          <td>{customer.name || "No name"}</td>
                          <td>{customer.email || "No email"}</td>
                          <td>{customer.role || "customer"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">Không có customer nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}