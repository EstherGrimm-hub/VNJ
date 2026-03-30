import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import {
  getCart,
  saveCart,
  getCurrentUser,
  formatPrice,
  getBuyNowItem,
  clearBuyNowItem
} from "../utils/storage";
import { createOrder } from "../services/orderService";
import { validateCoupon } from "../services/couponService";

export default function CheckoutPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const currentUser = getCurrentUser();
  const buyNowItem = getBuyNowItem();

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const checkoutItems = buyNowItem ? [buyNowItem] : cart;

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const taxes = 20;
  const delivery = 0;
  const total = subtotal + taxes + delivery - discountAmount;

  const handleRemoveItem = (targetItem) => {
    if (buyNowItem) {
      clearBuyNowItem();
      navigate("/checkout");
      return;
    }

    const updatedCart = cart.filter(
      (item) =>
        !(
          item.id === targetItem.id &&
          item.size === targetItem.size &&
          item.image === targetItem.image
        )
    );

    setCart(updatedCart);
    saveCart(updatedCart);
  };

  const handleApplyCoupon = async () => {
    const result = await validateCoupon({
      code: couponCode,
      subtotal
    });

    if (!result.success) {
      alert(result.message);
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    setAppliedCoupon(result.coupon);
    setDiscountAmount(result.discountAmount);
    alert(result.message);
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      alert("Bạn cần đăng nhập trước khi thanh toán.");
      return;
    }

    if (!checkoutItems.length) {
      alert("Giỏ hàng đang trống.");
      return;
    }

    const result = await createOrder({
      userId: currentUser.id,
      customerName: currentUser.name,
      items: checkoutItems,
      subtotal,
      taxes,
      delivery,
      total,
      couponCode: appliedCoupon?.code || null,
      discountAmount
    });

    if (!result.success) {
      alert(result.message || "Checkout thất bại.");
      return;
    }

    if (buyNowItem) {
      clearBuyNowItem();
    } else {
      setCart([]);
      saveCart([]);
    }

    alert("Thanh toán thành công!");
    navigate("/");
  };

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
      />

      <main>
        <section className="checkout-layout">
          <div className="checkout-main">
            <div className="checkout-left">
              <h1 className="checkout-title">My Cart</h1>
              <p className="checkout-selected">{checkoutItems.length} Items Selected</p>

              <div className="checkout-list">
                {checkoutItems.length ? (
                  checkoutItems.map((item, index) => (
                    <div
                      className="checkout-card"
                      key={`${item.id}-${item.size}-${index}`}
                    >
                      <div className="checkout-card-left">
                        <input type="checkbox" checked readOnly className="checkout-check" />
                        <img
                          src={item.image}
                          alt={item.name}
                          className="checkout-product-image"
                        />
                      </div>

                      <div className="checkout-card-info">
                        <div className="checkout-card-top">
                          <h4>{item.name}</h4>
                          <button
                            className="checkout-remove"
                            onClick={() => handleRemoveItem(item)}
                          >
                            ×
                          </button>
                        </div>

                        <div className="checkout-price-line">
                          <span className="checkout-price">
                            {formatPrice(item.price)}
                          </span>

                          {item.oldPrice ? (
                            <span className="checkout-old-price">
                              {formatPrice(item.oldPrice)}
                            </span>
                          ) : null}
                        </div>

                        <div className="checkout-meta">Qty: {item.quantity}</div>
                        <div className="checkout-meta">
                          Size: {item.size || "Standard"}
                        </div>

                        <div className="checkout-extra">
                          <span>30 Days return available</span>
                        </div>
                        <div className="checkout-extra">
                          <span>Delivered by Mar 29, 2025</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="checkout-empty">Your cart is empty.</div>
                )}
              </div>
            </div>

            <aside className="checkout-right">
              <div className="summary-box">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="coupon-box">
                  <label>Enter Discount Code</label>
                  <div className="coupon-input-wrap">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                    />
                    <button type="button" onClick={handleApplyCoupon}>
                      APPLY
                    </button>
                  </div>
                  {appliedCoupon ? (
                    <p style={{ marginTop: "8px", color: "green", fontSize: "12px" }}>
                      Applied: {appliedCoupon.name} (-{appliedCoupon.discountPercent}%)
                    </p>
                  ) : null}
                </div>

                <div className="summary-row">
                  <span>Discount</span>
                  <span>- {formatPrice(discountAmount)}</span>
                </div>

                <div className="summary-row">
                  <span>Taxes</span>
                  <span>{formatPrice(taxes)}</span>
                </div>

                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className="free-text">FREE</span>
                </div>

                <div className="summary-row grand-total">
                  <span>Grand Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button className="checkout-final-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}