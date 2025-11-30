import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo-link">
          <div className="logo">
            <h1>🛍️ E-Commerce</h1>
          </div>
        </Link>
        
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

          <Link to="/wishlist" className="wishlist-btn" title="Favoritos">
            <span className="wishlist-icon">❤️</span>
            <span className="wishlist-count">{getTotalWishlistItems()}</span>
          </Link>
          <Link to="/orders" className="orders-btn" title="Histórico de pedidos">
            <span className="orders-icon">📦</span>
          </Link>
          <Link to="/cart" className="cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-count">{getTotalItems()}</span>
          </Link>
        </div>
      </div>

      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}