import React, { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import { saveCurrentUser } from "../utils/storage";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await loginUser(loginEmail.trim(), loginPassword.trim());

      if (!result.success) {
        alert(result.message);
        return;
      }

      saveCurrentUser(result.user);
      alert(`Xin chào ${result.user.name} (${result.user.role})`);
      onAuthSuccess(result.user);
      onClose();

      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.error("Login error:", error);
      alert("Không thể đăng nhập. Vui lòng thử lại.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      alert("Vui lòng nhập đủ thông tin.");
      return;
    }

    try {
      const result = await registerUser({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword.trim()
      });

      if (!result.success) {
        alert(result.message);
        return;
      }

      saveCurrentUser(result.user);
      alert(`Đăng ký thành công. Xin chào ${result.user.name}`);
      onAuthSuccess(result.user);
      onClose();

      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } catch (error) {
      console.error("Register error:", error);
      alert("Không thể đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-modal active">
      <div className="auth-box">
        <button className="close-auth" type="button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="auth-tabs">
          <button
            className={`tab ${activeTab === "login" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          <button
            className={`tab ${activeTab === "register" ? "active" : ""}`}
            type="button"
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {activeTab === "login" ? (
          <form className="auth-form active" onSubmit={handleLoginSubmit}>
            <h3>Sign In</h3>

            <input
              type="email"
              placeholder="Email Address"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button type="submit" className="primary-btn">
              Login
            </button>
          </form>
        ) : (
          <form className="auth-form active" onSubmit={handleRegisterSubmit}>
            <h3>Create New Account</h3>

            <input
              type="text"
              name="name"
              placeholder="Name"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              required
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              required
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />

            <label className="terms">
              <input type="checkbox" defaultChecked />
              I Agree The Terms & Conditions
            </label>

            <button type="submit" className="primary-btn">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}