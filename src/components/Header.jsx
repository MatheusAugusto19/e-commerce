import React, { useState } from "react";
import { useCart } from "../context/useCart";
import { useWishlist } from "../context/useWishlist";
import { useAuth } from "../context/useAuth";
import SearchBar from "./SearchBar";
import LoginRegisterModal from "./LoginRegisterModal";
import "./Header.scss";

export default function Header() {
  const { getTotalItems } = useCart();
  const { getTotalWishlistItems } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToCart = () => {
    window.location.hash = '#carrinho';
  };

  const goHome = () => {
    window.location.hash = '';
  };

  const goToOrders = () => {
    window.location.hash = '#pedidos';
  };

  const goToWishlist = () => {
    window.location.hash = '#favoritos';
  };

  return (
    <header className="header">
      <div className="header-container">
        <button onClick={goHome} className="logo-link">
          <div className="logo">
            <h1>🛍️ E-Commerce</h1>
          </div>
        </button>
        
        <SearchBar />
        
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <span className="user-greeting">👤 {user?.name}</span>
                <button onClick={logout} className="logout-btn" title="Sair">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="login-btn"
              title="Entrar ou criar conta"
            >
              Entrar
            </button>
          )}

          <button onClick={goToWishlist} className="wishlist-btn" title="Favoritos">
            <span className="wishlist-icon">❤️</span>
            <span className="wishlist-count">{getTotalWishlistItems()}</span>
          </button>
          <button onClick={goToOrders} className="orders-btn" title="Histórico de pedidos">
            <span className="orders-icon">📦</span>
          </button>
          <button onClick={goToCart} className="cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{getTotalItems()}</span>
          </button>
        </div>
      </div>

      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}