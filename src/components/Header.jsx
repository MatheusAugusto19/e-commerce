import React, { useState } from "react";
import { useCart } from "../context/useCart";
import { useFilter } from "../context/useFilter";
import { useWishlist } from "../context/useWishlist";
import "./Header.scss";

export default function Header() {
  const { getTotalItems } = useCart();
  const { setSearchQuery } = useFilter();
  const { getTotalWishlistItems } = useWishlist();
  const [localSearch, setLocalSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

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
        
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Buscar produtos..." 
            value={localSearch}
            onChange={handleSearch}
          />
        </div>
        
        <div className="header-actions">
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
    </header>
  );
}