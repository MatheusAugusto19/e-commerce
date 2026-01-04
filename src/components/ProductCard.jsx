import { useNavigate } from "react-router-dom";
import useStore from '../store/useStore';
import styles from "./ProductCard.module.scss";

export default function ProductCard({ product, onAddToCart }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useStore();
  const navigate = useNavigate();
  const isFavorite = isInWishlist(product.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.productCardHeader}>
        <button
          className={`${styles.favoriteBtn} ${isFavorite ? styles.active : ""}`}
          onClick={handleToggleFavorite}
          title={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <div
        className={styles.productImage}
        onClick={handleViewDetails}
        style={{ cursor: "pointer" }}
      >
        <img src={product.image} alt={product.name} />
      </div>

      <div className={styles.productInfo}>
        <h3
          className={styles.productName}
          onClick={handleViewDetails}
          style={{ cursor: "pointer" }}
        >
          {product.name}
        </h3>

        <p className={styles.productDescription}>{product.description}</p>

        {product.rating && (
          <div className={styles.productRating}>
            <span>⭐ {product.rating.toFixed(1)}</span>
          </div>
        )}

        <div className={styles.productFooter}>
          <span className={styles.productPrice}>R$ {product.price.toFixed(2)}</span>
          <button
            className={styles.addToCartBtn}
            onClick={() => onAddToCart(product)}
          >
            🛒 Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}
