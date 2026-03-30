import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import OrderManagementPage from "./pages/OrdersManagement";
import CustomersPage from "./pages/CustomersPage";
import CouponsPage from "./pages/CouponsPage";
import Account from "./pages/Account";
import AddProductPage from "./pages/AddProductPage";
import AdminRolePage from "./pages/AdminRolePage";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(savedUser || null);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    alert("Bạn đã đăng xuất.");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            onLogout={handleLogout}
          />
        }
      />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/admin/orders" element={<OrderManagementPage />} />
      <Route path="/admin/customers" element={<CustomersPage />} />
      <Route path="/admin/coupons" element={<CouponsPage />} />
      <Route path="/account" element={<Account />} />
      <Route path="/admin/products/add" element={<AddProductPage />} />
      <Route path="/admin/roles" element={<AdminRolePage />} />

    </Routes>
  );
}