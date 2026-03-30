import React from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/storage";

export default function QuickCart({ isOpen, cart, onClose, onRemoveItem }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`quick-cart ${isOpen ? "active" : ""}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button id="closeCart" type="button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="cart-items">
        {cart.length ? (
          cart.map((item, index) => (
            <div className="cart-item" key={`${item.id}-${item.size}-${index}`}>
              <div className="cart-item-thumb">
                <img src={item.image || item.images?.[0]} alt={item.name} />
              </div>

              <div className="cart-item-info">
                <h4>{item.name}</h4>

                <div className="cart-item-price">
                  <span className="cart-price-new">{formatPrice(item.price)}</span>
                  {item.oldPrice ? (
                    <span className="cart-price-old">{formatPrice(item.oldPrice)}</span>
                  ) : null}
                </div>

                <div className="cart-item-meta">QTY: {item.quantity}</div>
                <div className="cart-item-meta">Size: {item.size || "Standard"}</div>

                {onRemoveItem ? (
                  <button className="remove" onClick={() => onRemoveItem(item)}>
                    ×
                  </button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="quick-cart-empty">Your cart is empty.</div>
        )}
      </div>

      <div className="cart-footer">
        <div className="subtotal">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>

        <Link to="/checkout" className="checkout-btn" onClick={onClose}>
          Checkout
        </Link>
      </div>
    </div>
  );
}