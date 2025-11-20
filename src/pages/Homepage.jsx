import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import ProductDetailPage from "./ProductDetailPage";
import { useCart } from "../context/useCart";
import { useNotification } from "../context/useNotification";
import { useFilter } from "../context/useFilter";
import "./HomePage.scss";

export default function HomePage() {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const { getFilteredProducts } = useFilter();
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Usar produtos filtrados do FilterProvider
  const products = getFilteredProducts();

  const handleAddToCart = (product) => {
    addToCart(product);
    addNotification(`${product.name} adicionado ao carrinho! 🛒`, "success", 2000);
  };

  const handleViewDetails = (productId) => {
    setSelectedProductId(productId);
  };

  const handleCloseDetails = () => {
    setSelectedProductId(null);
  };

  return (
    <main className="home-page">
      <section className="hero">
        <h2>Bem-vindo à nossa loja online!</h2>
        <p>Encontre os melhores produtos de tecnologia</p>
      </section>

      <section className="products-section">
        <div className="products-container">
          <FilterPanel />
          <div className="products-wrapper">
            <h2 className="section-title">
              Produtos ({products.length} encontrados)
            </h2>
            {products.length === 0 ? (
              <div className="no-products">
                <p>😢 Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedProductId && (
        <ProductDetailPage
          productId={selectedProductId}
          onClose={handleCloseDetails}
        />
      )}
    </main>
  );
}
