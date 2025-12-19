import useStore from '../store/useStore';
import styles from "./CartPage.module.scss";

export default function CartPage() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, getTotal, clearCart, addNotification } = useStore();

  if (cartItems.length === 0) {
    return (
      <main className={styles.cartPage}>
        <div className={styles.emptyCart}>
          <h1>🛒 Seu carrinho está vazio</h1>
          <p>Adicione produtos para começar suas compras!</p>
          <a href="/" className={styles.continueShoppingBtn}>
            ← Voltar para produtos
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.cartPage}>
      <div className={styles.cartContainer}>
        <h1>🛒 Seu Carrinho</h1>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />

                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.itemPrice}>R$ {item.price.toFixed(2)}</p>
                </div>

                <div className={styles.itemQuantity}>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    −
                  </button>
                  <span className={styles.qtyValue}>{item.quantity}</span>
                  <button 
                    className={styles.qtyBtn}
                    onClick={() => increaseQuantity(item.id)}
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemSubtotal}>
                  <p>R$ {(item.price * item.quantity).toFixed(2)}</p>
                </div>

                <button 
                  className={styles.removeBtn}
                  onClick={() => {
                    removeFromCart(item.id);
                    addNotification(`${item.name} removido do carrinho`, "warning", 2000);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryContent}>
              <div className={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>

              <button 
                className={styles.checkoutBtn}
                onClick={() => window.location.hash = '#checkout'}
              >
                Ir para Checkout
              </button>

              <button 
                className={styles.clearCartBtn}
                onClick={clearCart}
              >
                Limpar Carrinho
              </button>

              <a href="/" className={styles.continueShopping}>
                ← Continuar Comprando
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
