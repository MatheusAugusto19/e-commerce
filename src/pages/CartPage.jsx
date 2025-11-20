import React from "react";
import { useCart } from "../context/useCart";
import { useNotification } from "../context/useNotification";
import "./CartPage.scss";

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotal, clearCart } = useCart();
  const { addNotification } = useNotification();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <h1>🛒 Seu carrinho está vazio</h1>
          <p>Adicione produtos para começar suas compras!</p>
          <a href="/" className="continue-shopping-btn">
            ← Voltar para produtos
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-container">
        <h1>🛒 Seu Carrinho</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />

                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-price">R$ {item.price.toFixed(2)}</p>
                </div>

                <div className="item-quantity">
                  <button 
                    className="qty-btn"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button 
                    className="qty-btn"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => {
                    removeFromCart(item.id);
                    addNotification(`${item.name} removido do carrinho`, "warning", 2000);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={() => window.location.hash = '#checkout'}
              >
                Ir para Checkout
              </button>

              <button 
                className="clear-cart-btn"
                onClick={clearCart}
              >
                Limpar Carrinho
              </button>

              <a href="/" className="continue-shopping">
                ← Continuar Comprando
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
