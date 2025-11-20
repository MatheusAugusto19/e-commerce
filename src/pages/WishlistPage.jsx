import React from 'react';
import { useWishlist } from '../context/useWishlist';
import { useCart } from '../context/useCart';
import { useNotification } from '../context/useNotification';
import ProductCard from '../components/ProductCard';
import './WishlistPage.scss';

export default function WishlistPage() {
  const { wishlistItems, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addNotification } = useNotification();

  const handleAddToCart = (product) => {
    addToCart(product);
    addNotification(`${product.name} adicionado ao carrinho! 🛒`, 'success', 2000);
  };

  const handleViewDetails = () => {
    // Pode ser implementado depois
  };

  const handleClearWishlist = () => {
    if (window.confirm('Tem certeza que quer limpar toda a sua lista de favoritos?')) {
      clearWishlist();
      addNotification('Lista de favoritos limpa! 🗑️', 'info', 2000);
    }
  };

  const goHome = () => {
    window.location.hash = '#home';
  };

  if (wishlistItems.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="empty-wishlist">
          <div className="empty-icon">🤍</div>
          <h1>Sua lista de favoritos está vazia</h1>
          <p>Adicione produtos aos seus favoritos para vê-los aqui</p>
          <button onClick={goHome} className="continue-shopping-btn">
            ← Voltar para loja
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <h1>❤️ Meus Favoritos</h1>
          <div className="wishlist-stats">
            <span className="wishlist-count">{wishlistItems.length} produtos</span>
            <button onClick={handleClearWishlist} className="clear-btn">
              🗑️ Limpar Lista
            </button>
          </div>
        </div>

        <div className="wishlist-grid">
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        <div className="wishlist-footer">
          <button onClick={goHome} className="back-btn">
            ← Continuar Comprando
          </button>
          {wishlistItems.length > 0 && (
            <button
              onClick={() => {
                wishlistItems.forEach((product) => {
                  addToCart(product);
                });
                addNotification(
                  `${wishlistItems.length} produtos adicionados ao carrinho! 🛒`,
                  'success',
                  2000
                );
              }}
              className="add-all-btn"
            >
              🛒 Adicionar Tudo ao Carrinho
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
