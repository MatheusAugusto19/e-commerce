import useStore from '../store/useStore';
import ProductCard from '../components/ProductCard';
import styles from './WishlistPage.module.scss';

export default function WishlistPage() {
  const { wishlistItems, clearWishlist, addToCart, addNotification } = useStore();

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
      <main className={styles.wishlistPage}>
        <div className={styles.emptyWishlist}>
          <div className={styles.emptyIcon}>🤍</div>
          <h1>Sua lista de favoritos está vazia</h1>
          <p>Adicione produtos aos seus favoritos para vê-los aqui</p>
          <button onClick={goHome} className={styles.continueShoppingBtn}>
            ← Voltar para loja
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.wishlistPage}>
      <div className={styles.wishlistContainer}>
        <div className={styles.wishlistHeader}>
          <h1>❤️ Meus Favoritos</h1>
          <div className={styles.wishlistStats}>
            <span className={styles.wishlistCount}>{wishlistItems.length} produtos</span>
            <button onClick={handleClearWishlist} className={styles.clearBtn}>
              🗑️ Limpar Lista
            </button>
          </div>
        </div>

        <div className={styles.wishlistGrid}>
          {wishlistItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

        <div className={styles.wishlistFooter}>
          <button onClick={goHome} className={styles.backBtn}>
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
              className={styles.addAllBtn}
            >
              🛒 Adicionar Tudo ao Carrinho
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
