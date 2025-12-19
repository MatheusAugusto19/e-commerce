import { useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore";
import SearchBar from "./SearchBar";
import LoginRegisterModal from "./LoginRegisterModal";
import styles from "./Header.module.scss";

export default function Header() {
  const { getTotalItems, getTotalWishlistItems, user, logout, isAuthenticated } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to="/" className={styles.logoLink}>
          <div className={styles.logo}>
            <h1>🛍️ E-Commerce</h1>
          </div>
        </Link>
        
        <SearchBar />
        
        <div className={styles.headerActions}>
          {isAuthenticated ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userGreeting}>👤 {user?.name}</span>
                <button onClick={logout} className={styles.logoutBtn} title="Sair">
                  Sair
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className={styles.loginBtn}
              title="Entrar ou criar conta"
            >
              Entrar
            </button>
          )}

          <Link to="/wishlist" className={styles.wishlistBtn} title="Favoritos">
            <span className={styles.wishlistIcon}>❤️</span>
            <span className={styles.wishlistCount}>{getTotalWishlistItems()}</span>
          </Link>
          <Link to="/orders" className={styles.ordersBtn} title="Histórico de pedidos">
            <span className={styles.ordersIcon}>📦</span>
          </Link>
          <Link to="/cart" className={styles.cartBtn}>
            <span className={styles.cartIcon}>🛒</span>
            <span className={styles.cartCount}>{getTotalItems()}</span>
          </Link>
        </div>
      </div>

      <LoginRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}