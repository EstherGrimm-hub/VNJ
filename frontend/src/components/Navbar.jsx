import React from "react";
import { Link } from "react-router-dom";
import { siteContent } from "../data/siteContent";

export default function Navbar({
  currentUser,
  cartCount,
  onCartClick,
  onOpenAuth,
  onLogout
}) {
  return (
    <header className="site-header">
      <div className="top-bar">
        <div className="container top-bar-inner">
          <p>{siteContent.topBar.text}</p>

          <div className="top-bar-right">
            <span>{siteContent.topBar.currency}</span>
            <span>{siteContent.topBar.language}</span>
          </div>
        </div>
      </div>

      <div className="main-navbar">
        <div className="container nav-inner">
          <Link to="/" className="logo">
            {siteContent.nav.logo}
          </Link>

          <nav className="nav-menu">
            {siteContent.nav.menu.map((item) => (
              <a href="#" key={item}>
                {item}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <a href="#">
              <i className="fa-solid fa-magnifying-glass"></i>
            </a>

            {currentUser ? (
              <>
                <Link to="/account" className="user-link">
                  <i className="fa-regular fa-circle-user"></i>
                  <span>{currentUser.name}</span>
                </Link>

                <button type="button" className="signin-link" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button type="button" className="signin-link" onClick={onOpenAuth}>
                <i className="fa-regular fa-circle-user"></i>
                <span>Sign in / Register</span>
              </button>
            )}

            <a href="#">
              <i className="fa-regular fa-heart"></i>
            </a>

            <button type="button" className="cart-btn" onClick={onCartClick}>
              <div className="cart-icon">
                <i className="fa-solid fa-cart-shopping"></i>
                <span id="cartCount">{cartCount}</span>
              </div>
            </button>

            {currentUser?.role === "admin" && (
              <Link to="/admin" className="dashboard-link">
                <i className="fa-solid fa-table-columns"></i>
                <span>Dashboard</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}