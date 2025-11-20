import React, { useState } from "react";
import { useOrder } from "../context/useOrder";
import "./OrderHistoryPage.scss";

export default function OrderHistoryPage() {
  const { orders, getOrderById } = useOrder();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const selectedOrder = selectedOrderId ? getOrderById(selectedOrderId) : null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Processando":
        return "status-processing";
      case "Enviado":
        return "status-shipped";
      case "Entregue":
        return "status-delivered";
      case "Cancelado":
        return "status-cancelled";
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
      <main className="order-history-page">
        <div className="empty-orders">
          <h1>📦 Histórico de Pedidos</h1>
          <p>Você ainda não realizou nenhum pedido.</p>
          <a href="/" className="continue-shopping-btn">
            ← Continuar Comprando
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="order-history-page">
      <div className="orders-container">
        <h1>📦 Histórico de Pedidos</h1>

        <div className="orders-content">
          {/* Lista de Pedidos */}
          <div className="orders-list">
            <div className="orders-header">
              <h2>Meus Pedidos</h2>
              <span className="orders-count">Total: {orders.length}</span>
            </div>

            <div className="orders-items">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className={`order-item ${selectedOrderId === order.id ? "active" : ""}`}
                  onClick={() => setSelectedOrderId(order.id)}
                >
                  <div className="order-item-header">
                    <div className="order-id-date">
                      <span className="order-id">{order.id}</span>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <span className={`order-status ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>

                  <div className="order-item-summary">
                    <span className="order-items-count">
                      {order.items.length} item(ns)
                    </span>
                    <span className="order-total">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detalhes do Pedido */}
          {selectedOrder && (
            <div className="order-details">
              <div className="details-header">
                <h2>Detalhes do Pedido</h2>
                <button
                  className="close-details"
                  onClick={() => setSelectedOrderId(null)}
                >
                  ✕
                </button>
              </div>

              {/* Status Timeline */}
              <div className="order-timeline">
                <div className={`timeline-step ${selectedOrder.status !== "Processando" ? "completed" : "active"}`}>
                  <div className="timeline-circle">📦</div>
                  <div className="timeline-label">Pedido Confirmado</div>
                </div>
                <div className={`timeline-step ${selectedOrder.status === "Entregue" ? "completed" : selectedOrder.status === "Enviado" ? "active" : ""}`}>
                  <div className="timeline-circle">🚚</div>
                  <div className="timeline-label">Em Trânsito</div>
                </div>
                <div className={`timeline-step ${selectedOrder.status === "Entregue" ? "completed" : ""}`}>
                  <div className="timeline-circle">✅</div>
                  <div className="timeline-label">Entregue</div>
                </div>
              </div>

              {/* Informações do Pedido */}
              <div className="details-section">
                <h3>Informações do Pedido</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Número do Pedido:</span>
                    <span className="info-value">{selectedOrder.id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Data:</span>
                    <span className="info-value">{selectedOrder.date}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Hora:</span>
                    <span className="info-value">{selectedOrder.time}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`info-value status ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Endereço de Entrega */}
              <div className="details-section">
                <h3>Endereço de Entrega</h3>
                <div className="address-box">
                  <p>
                    <strong>{selectedOrder.shippingInfo.name}</strong>
                  </p>
                  <p>
                    {selectedOrder.shippingInfo.street},{" "}
                    {selectedOrder.shippingInfo.number}
                  </p>
                  {selectedOrder.shippingInfo.complement && (
                    <p>{selectedOrder.shippingInfo.complement}</p>
                  )}
                  <p>
                    {selectedOrder.shippingInfo.city},{" "}
                    {selectedOrder.shippingInfo.state} -{" "}
                    {selectedOrder.shippingInfo.zipcode}
                  </p>
                </div>
              </div>

              {/* Itens do Pedido */}
              <div className="details-section">
                <h3>Itens do Pedido</h3>
                <div className="order-items-detail">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="item-detail">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Quantidade: {item.quantity}</p>
                        <p className="item-price">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="item-total">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className="details-section">
                <h3>Resumo Financeiro</h3>
                <div className="financial-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Frete:</span>
                    <span>Grátis</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>R$ {selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="details-actions">
                <button className="action-btn primary">
                  📧 Rastrear Pedido
                </button>
                <button className="action-btn secondary">
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
