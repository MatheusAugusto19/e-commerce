import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReviewSection from "../components/ReviewSection";
import useStore from "../store/useStore";
import styles from "./ProductPage.module.scss";

export default function ProductPage() {
  const { productId } = useParams();
  const { addToCart, addNotification, getProductById } = useStore((state) => ({
    addToCart: state.addToCart,
    addNotification: state.addNotification,
    getProductById: state.getProductById,
  }));

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setLoading(true);
    const foundProduct = getProductById(parseInt(productId));
    setProduct(foundProduct);
    setLoading(false);
  }, [productId, getProductById]);

  if (loading) {
    return (
      <div className={styles.productPageContainer}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.productPageContainer}>
        <h2>Oops!</h2>
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    addNotification(
      `${quantity} ${
        quantity > 1 ? "unidades" : "unidade"
      } de ${product.name} adicionada(s) ao carrinho!`,
      "success"
    );
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className={styles.productPageContainer}>
      <div className={styles.productDetailContainer}>
        {/* Imagem */}
        <div className={styles.detailImageSection}>
          <img src={product.image} alt={product.name} className={styles.detailImage} />
          <div className={styles.stockBadge}>
            {product.inStock ? "Em Estoque" : "Fora de Estoque"}
          </div>
        </div>

        {/* Informações */}
        <div className={styles.detailInfoSection}>
          <h1 className={styles.detailName}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.detailRating}>
            <span className={styles.stars}>⭐ {product.rating.toFixed(1)}</span>
            <span className={styles.reviews}>({product.reviews} avaliações)</span>
          </div>

          {/* Preço */}
          <div className={styles.detailPrice}>
            <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
            <span className={styles.originalPrice}>
              R$ {(product.price * 1.2).toFixed(2)}
            </span>
          </div>

          {/* Descrição */}
          <p className={styles.detailDescription}>{product.description}</p>

          {/* Features */}
          <div className={styles.detailFeatures}>
            <h3>Principais Características</h3>
            <ul>
              {product.features.map((feature, idx) => (
                <li key={idx}>✓ {feature}</li>
              ))}
            </ul>
          </div>

          {/* Quantidade e Carrinho */}
          <div className={styles.detailActions}>
            <div className={styles.quantitySelector}>
              <button onClick={decreaseQuantity} className={styles.qtyBtn}>−</button>
              <span className={styles.qtyDisplay}>{quantity}</span>
              <button onClick={increaseQuantity} className={styles.qtyBtn}>+</button>
              <span className={styles.stockInfo}>({product.stock} disponíveis)</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={styles.addToCartLarge}
            >
              🛒 Adicionar ao Carrinho
            </button>
          </div>

          {/* Especificações */}
          <div className={styles.detailSpecs}>
            <h3>Especificações</h3>
            <table className={styles.specsTable}>
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key}>
                    <td className={styles.specLabel}>
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    <td className={styles.specValue}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reviews */}
          <ReviewSection productId={parseInt(productId)} />
        </div>
      </div>
    </div>
  );
}
