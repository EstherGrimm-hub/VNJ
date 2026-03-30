import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import QuickCart from "../components/QuickCart";
import ProductCard from "../components/ProductCard";
import {
  getCart,
  getCurrentUser,
  saveCart,
  saveBuyNowItem
} from "../utils/storage";
import { fetchProductById, fetchProducts } from "../services/productService";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [cart, setCart] = useState(getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const currentUser = getCurrentUser();
  const [reviews, setReviews] = useState([]);
const [reviewRating, setReviewRating] = useState(5);
const [reviewComment, setReviewComment] = useState("");
const [submittingReview, setSubmittingReview] = useState(false);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);
  const loadReviews = async (productMongoId) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/reviews/product/${productMongoId}`
    );
    const data = await res.json();

    if (data.success) {
      setReviews(data.reviews || []);
    } else {
      setReviews([]);
    }
  } catch (error) {
    console.error("loadReviews error:", error);
    setReviews([]);
  }
};
const handleSubmitReview = async () => {
  if (!currentUser) {
    alert("Bạn cần đăng nhập để đánh giá.");
    return;
  }

  if (!product?._id) {
    alert("Không tìm thấy sản phẩm.");
    return;
  }

  try {
    setSubmittingReview(true);

    const res = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product._id,
        userId: currentUser.id,
        userName: currentUser.name,
        rating: reviewRating,
        comment: reviewComment
      })
    });

    const data = await res.json();
    alert(data.message);

    if (data.success) {
      setReviewRating(5);
      setReviewComment("");

      const refreshedProduct = await fetchProductById(id);
      if (refreshedProduct.success) {
        setProduct(refreshedProduct.product);
      }

      await loadReviews(product._id);
    }
  } catch (error) {
    console.error("handleSubmitReview error:", error);
    alert("Không thể gửi đánh giá.");
  } finally {
    setSubmittingReview(false);
  }
};

  useEffect(() => {
  const loadProduct = async () => {
    setLoading(true);

    const productResult = await fetchProductById(id);
    const allProductsResult = await fetchProducts();

    if (productResult.success) {
      const loadedProduct = productResult.product;
      setProduct(loadedProduct);
      setSelectedImage(loadedProduct?.images?.[0] || "");
      setSelectedSize(loadedProduct?.sizes?.[0] || "");

      if (loadedProduct?._id) {
        await loadReviews(loadedProduct._id);
      }
    } else {
      setProduct(null);
      setReviews([]);
    }

    setAllProducts(allProductsResult.products || []);
    setLoading(false);
  };

  loadProduct();
}, [id]);

  if (loading) {
    return <div className="container">Loading product...</div>;
  }

  if (!product) {
    return <div className="container">Product not found.</div>;
  }

  const similarProducts = allProducts.filter(
    (p) => p.id !== product.id && p.category === product.category
  );

  const handleAddToCart = () => {
    const existingItem = cart.find(
      (item) =>
        item.id === product.id &&
        item.image === selectedImage &&
        item.size === selectedSize
    );

    let updatedCart = [];

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id &&
        item.image === selectedImage &&
        item.size === selectedSize
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        oldPrice: product.oldPrice,
        image: selectedImage,
        size: selectedSize,
        quantity
      };

      updatedCart = [...cart, newItem];
    }

    setCart(updatedCart);
    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    const buyNowItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: selectedImage,
      size: selectedSize,
      quantity
    };

    saveBuyNowItem(buyNowItem);
    navigate("/checkout");
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
        <div className="breadcrumb container">
          <Link to="/">Home</Link>
          <span> &gt; </span>
          <Link to="/">Shop</Link>
          <span> &gt; </span>
          <span className="current">{product.name}</span>
        </div>

        <section className="product-detail container">
          <div className="product-gallery">
           {selectedImage ? (
  <img src={selectedImage} alt={product.name} className="main-image" />
) : (
  <div className="main-image no-image">No Image</div>
)}

            <div className="thumbs">
              {product.colors.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className="thumb"
                  alt={product.name}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>

            <div className="rating">
  {"★".repeat(Math.round(product.ratingAverage || 0))}
  <span>
    {" "}
    {product.ratingAverage || 0} ({product.ratingCount || 0} đánh giá)
  </span>
</div>

            <div className="price">
              <span className="new">${product.price}</span>
              <span className="old">${product.oldPrice}</span>
            </div>

            <p className="stock">Only {product.stock} items left in stock</p>

            <h4>Color</h4>
            <div className="colors">
              {product.colors.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="color option"
                  className={`color-option ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>

            <h4>Size</h4>
            <div className="sizes">
              {(product.sizes || []).map((size, index) => (
                <button
                  key={index}
                  className={`size ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="qty">
              <button
                type="button"
                className="qty-minus"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>

              <input value={quantity} readOnly />

              <button
                type="button"
                className="qty-plus"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button className="add-cart" onClick={handleAddToCart}>
              Add To Cart
            </button>

            <button type="button" className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </section>

        <section className="description container">
          <h2>Description</h2>
          <p>{product.description}</p>
        </section>

        <section className="specs container">
          <h2>Product Specifications</h2>

          <table>
            <tbody>
             <tr><td>Model</td><td>{product.specs?.model}</td></tr>
<tr><td>Display</td><td>{product.specs?.display}</td></tr>
<tr><td>Strap Color</td><td>{product.specs?.strapColor}</td></tr>
<tr><td>Strap Material</td><td>{product.specs?.strapMaterial}</td></tr>
<tr><td>Size</td><td>{product.specs?.size}</td></tr>
<tr><td>Touchscreen</td><td>{product.specs?.touchscreen}</td></tr>
<tr><td>Water Resistant</td><td>{product.specs?.waterResistant}</td></tr>
<tr><td>Compatible OS</td><td>{product.specs?.compatibleOS}</td></tr>
            </tbody>
          </table>
        </section>
        <section className="reviews-section container">
  <h2>Đánh giá sản phẩm</h2>

  <div className="review-form">
    <label>Số sao</label>
    <select
      value={reviewRating}
      onChange={(e) => setReviewRating(Number(e.target.value))}
    >
      <option value={5}>5 sao</option>
      <option value={4}>4 sao</option>
      <option value={3}>3 sao</option>
      <option value={2}>2 sao</option>
      <option value={1}>1 sao</option>
    </select>

    <label>Nhận xét</label>
    <textarea
      value={reviewComment}
      onChange={(e) => setReviewComment(e.target.value)}
      placeholder="Chia sẻ trải nghiệm của bạn..."
      rows={4}
    />

    <button onClick={handleSubmitReview} disabled={submittingReview}>
      {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
    </button>
  </div>

  <div className="review-list">
    {reviews.length === 0 ? (
      <p>Chưa có đánh giá nào.</p>
    ) : (
      reviews.map((review) => (
        <div className="review-item" key={review._id}>
          <div className="review-top">
            <strong>{review.userName}</strong>
            <span>{"★".repeat(review.rating)}</span>
          </div>

          <p>{review.comment || "Không có nhận xét."}</p>
          <small>{new Date(review.createdAt).toLocaleString()}</small>
        </div>
      ))
    )}
  </div>
</section>

        <section className="similar container">
          <h2>Similar Products</h2>

          {similarProducts.length ? (
            <div className="product-grid">
              {similarProducts.slice(0, 4).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="similar-empty">
              No similar products found in this category.
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}