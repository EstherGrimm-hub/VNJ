import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;

  return (
   <Link
  to={`/product/${product._id || product.id}`}
  className="product-card"
>
      {image ? (
        <img src={image} alt={product.name} />
      ) : (
        <div
          style={{
            height: "220px",
            background: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          No Image
        </div>
      )}

      <h3>{product.name}</h3>

      <div className="price">
        <span className="new">${product.price}</span>
        {!!product.oldPrice && <span className="old">${product.oldPrice}</span>}
      </div>
    </Link>
  );
}