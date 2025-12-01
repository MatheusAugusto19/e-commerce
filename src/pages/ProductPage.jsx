import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/useCart";
import { useNotification } from "../context/useNotification";
import ReviewSection from "../components/ReviewSection";
import db from "../../db.json";
import "./ProductPage.scss";

export default function ProductPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    // Simulating an API call
    const foundProduct = db.products.find((p) => p.id === parseInt(productId));
    setProduct(foundProduct);
    setLoading(false);
  }, [productId]);

  if (loading) {
    return (
      <div className="product-page-container">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-container">
        <h2>Oops!</h2>
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    addNotification(
      `${quantity} ${
        quantity > 1 ? "unidades" : "unidade"
      } de ${product.name} adicionada(s) ao carrinho!`,
      "success"
    );
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-page-container">
      <div className="product-detail-container">
        {/* Imagem */}
        <div className="detail-image-section">
          <img src={product.image} alt={product.name} className="detail-image" />
          <div className="stock-badge">
            {product.inStock ? "Em Estoque" : "Fora de Estoque"}
          </div>
        </div>

        {/* Informações */}
        <div className="detail-info-section">
          <h1 className="detail-name">{product.name}</h1>

          {/* Rating */}
          <div className="detail-rating">
            <span className="stars">⭐ {product.rating.toFixed(1)}</span>
            <span className="reviews">({product.reviews} avaliações)</span>
          </div>

          {/* Preço */}
          <div className="detail-price">
            <span className="price">R$ {product.price.toFixed(2)}</span>
            <span className="original-price">
              R$ {(product.price * 1.2).toFixed(2)}
            </span>
          </div>

          {/* Descrição */}
          <p className="detail-description">{product.description}</p>

          {/* Features */}
          <div className="detail-features">
            <h3>Principais Características</h3>
            <ul>
              {product.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          {/* Quantidade e Carrinho */}
          <div className="detail-actions">
            <div className="quantity-selector">
              <button onClick={decreaseQuantity} className="qty-btn">−</button>
              <span className="qty-display">{quantity}</span>
              <button onClick={increaseQuantity} className="qty-btn">+</button>
              <span className="stock-info">({product.stock} disponíveis)</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="add-to-cart-large"
            >
              🛒 Adicionar ao Carrinho
            </button>
          </div>

          {/* Especificações */}
          <div className="detail-specs">
            <h3>Especificações</h3>
            <table className="specs-table">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td className="spec-label">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    <td className="spec-value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reviews */}
          <ReviewSection productId={parseInt(productId)} />
        </div>
      </div>
    </div>
  );
}
