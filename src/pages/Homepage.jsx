import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Pagination from "../components/Pagination";
import useStore from "../store/useStore";
import styles from "./HomePage.module.scss";

export default function HomePage() {
  const { addToCart, addNotification, paginatedProducts, totalItems } = useStore(state => ({
    addToCart: state.addToCart,
    addNotification: state.addNotification,
    paginatedProducts: state.pagination().paginatedProducts,
    totalItems: state.pagination().totalItems
  }));
  const allFilteredProducts = useStore(state => state.filteredProducts());

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
    <main className={styles.homePage}>
      <section className={styles.hero}>
        <h2>Bem-vindo à nossa loja online!</h2>
        <p>Encontre os melhores produtos de tecnologia</p>
      </section>

      <section className={styles.productsSection}>
        <div className={styles.productsContainer}>
          <FilterPanel />
          <div className={styles.productsWrapper}>
            <h2 className={styles.sectionTitle}>
              Produtos ({allFilteredProducts.length} encontrados)
            </h2>
            {allFilteredProducts.length === 0 ? (
              <div className={styles.noProducts}>
                <p>😢 Nenhum produto encontrado com os filtros selecionados</p>
              </div>
            ) : (
              <>
                <div className={styles.productsGrid}>
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
                <Pagination totalItems={totalItems} />
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
