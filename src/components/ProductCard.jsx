import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/useWishlist";
import "./ProductCard.scss";

export default function ProductCard({ product, onAddToCart }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const isFavorite = isInWishlist(product.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <div className="product-card-header">
        <button
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
          onClick={handleToggleFavorite}
          title={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div
        className="product-image"
        onClick={handleViewDetails}
        style={{ cursor: "pointer" }}
      >
        <img src={product.image} alt={product.name} />
      </div>

      <div className="product-info">
        <h3
          className="product-name"
          onClick={handleViewDetails}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h3>

        <p className="product-description">{product.description}</p>

        {product.rating && (
          <div className="product-rating">
            <span>⭐ {product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">R$ {product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            🛒 Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
