import { useState } from "react";
import useStore from "../store/useStore";
import styles from "./OrderHistoryPage.module.scss";

export default function OrderHistoryPage() {
  const { orders, getOrderById } = useStore((state) => ({
    orders: state.orders,
    getOrderById: state.getOrderById,
  }));
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Processando":
        return styles.statusProcessing;
      case "Enviado":
        return styles.statusShipped;
      case "Entregue":
        return styles.statusDelivered;
      case "Cancelado":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processando":
        return "⏳";
      case "Enviado":
        return "🚚";
      case "Entregue":
        return "✅";
      case "Cancelado":
        return "❌";
      default:
        return "📦";
    }
  };

  if (orders.length === 0) {
    return (
      <main className={styles.orderHistoryPage}>
        <div className={styles.emptyOrders}>
          <h1>📦 Histórico de Pedidos</h1>
          <p>Você ainda não realizou nenhum pedido.</p>
          <a href="/" className={styles.continueShoppingBtn}>
            ← Continuar Comprando
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.orderHistoryPage}>
      <div className={styles.ordersContainer}>
        <h1>📦 Histórico de Pedidos</h1>

        <div className={styles.ordersContent}>
          {/* Lista de Pedidos */}
          <div className={styles.ordersList}>
            <div className={styles.ordersHeader}>
              <h2>Meus Pedidos</h2>
              <span className={styles.ordersCount}>Total: {orders.length}</span>
            </div>

            <div className={styles.ordersItems}>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`${styles.orderItem} ${selectedOrderId === order.id ? styles.active : ""}`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className={styles.orderItemHeader}>
                    <div className={styles.orderIdDate}>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.orderDate}>{order.date}</span>
                    </div>
                    <span className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>

                  <div className={styles.orderItemSummary}>
                    <span className={styles.orderItemsCount}>
                      {order.items.length} item(ns)
                    </span>
                    <span className={styles.orderTotal}>R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes do Pedido */}
          {selectedOrder && (
            <div className={styles.orderDetails}>
              <div className={styles.detailsHeader}>
                <h2>Detalhes do Pedido</h2>
                <button
                  className={styles.closeDetails}
                  onClick={() => setSelectedOrderId(null)}
                >
                  ✕
                </button>
              </div>

              {/* Status Timeline */}
              <div className={styles.orderTimeline}>
                <div className={`${styles.timelineStep} ${selectedOrder.status !== "Processando" ? styles.completed : styles.active}`}>
                  <div className={styles.timelineCircle}>📦</div>
                  <div className={styles.timelineLabel}>Pedido Confirmado</div>
                </div>
                <div className={`${styles.timelineStep} ${selectedOrder.status === "Entregue" ? styles.completed : selectedOrder.status === "Enviado" ? styles.active : ""}`}>
                  <div className={styles.timelineCircle}>🚚</div>
                  <div className={styles.timelineLabel}>Em Trânsito</div>
                </div>
                <div className={`${styles.timelineStep} ${selectedOrder.status === "Entregue" ? styles.completed : ""}`}>
                  <div className={styles.timelineCircle}>✅</div>
                  <div className={styles.timelineLabel}>Entregue</div>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div className={styles.detailsSection}>
                <h3>Informações do Pedido</h3>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Número do Pedido:</span>
                    <span className={styles.infoValue}>{selectedOrder.id}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Data:</span>
                    <span className={styles.infoValue}>{selectedOrder.date}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Hora:</span>
                    <span className={styles.infoValue}>{selectedOrder.time}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={`${styles.infoValue} ${styles.status} ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className={styles.detailsSection}>
                <h3>Endereço de Entrega</h3>
                <div className={styles.addressBox}>
                  <p>
                    <strong>{selectedOrder.shippingInfo.name}</strong>
                  </p>
                  <p>
                    {selectedOrder.shippingInfo.street}, {" "}
                    {selectedOrder.shippingInfo.number}
                  </p>
                  {selectedOrder.shippingInfo.complement && (
                    <p>{selectedOrder.shippingInfo.complement}</p>
                  )}
                  <p>
                    {selectedOrder.shippingInfo.city}, {" "}
                    {selectedOrder.shippingInfo.state} - {" "}
                    {selectedOrder.shippingInfo.zipcode}
                  </p>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className={styles.detailsSection}>
                <h3>Itens do Pedido</h3>
                <div className={styles.orderItemsDetail}>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className={styles.itemDetail}>
                      <img src={item.image} alt={item.name} />
                      <div className={styles.itemInfo}>
                        <h4>{item.name}</h4>
                        <p>Quantidade: {item.quantity}</p>
                        <p className={styles.itemPrice}>
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className={styles.itemTotal}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className={styles.detailsSection}>
                <h3>Resumo Financeiro</h3>
                <div className={styles.financialSummary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Frete:</span>
                    <span>Grátis</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Total:</span>
                    <span>R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className={styles.detailsActions}>
                <button className={`${styles.actionBtn} ${styles.primary}`}>
                  📧 Rastrear Pedido
                </button>
                <button className={`${styles.actionBtn} ${styles.secondary}`}>
                  🔄 Repetir Pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
