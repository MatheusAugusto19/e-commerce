import React from "react";
import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import { useCart } from "../context/useCart";
import { useNotification } from "../context/useNotification";
import { useProduct } from "../context/useProduct";

export default function HomePage() {
  const { addToCart } = useCart();
  const { addNotification } = useNotification();
  const { paginatedProducts, filteredProducts } = useProduct();

  const products = paginatedProducts;

  const handleAddToCart = (product) => {
    addToCart(product);
    addNotification(
      `${product.name} adicionado ao carrinho! 🛒`,
      "success",
      2000
    );
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
              Produtos ({filteredProducts.length} encontrados)
            </h2>
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>😢 Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
                <Pagination totalItems={filteredProducts.length} />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
