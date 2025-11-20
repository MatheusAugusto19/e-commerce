import React, { useState } from "react";
import { useCart } from "../context/useCart";
import { useNotification } from "../context/useNotification";
import { useOrder } from "../context/useOrder";
import "./CheckoutPage.scss";

export default function CheckoutPage() {
  const { cartItems, getTotal, clearCart } = useCart();
  const { addNotification } = useNotification();
  const { addOrder } = useOrder();
  const [step, setStep] = useState(1); // 1: Endereço, 2: Pagamento, 3: Confirmação
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipcode: "",
  });
  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  });
  const [orderNumber, setOrderNumber] = useState("");

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
  };

  const isAddressValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.street &&
      formData.number &&
      formData.city &&
      formData.state &&
      formData.zipcode
    );
  };

  const isPaymentValid = () => {
    return (
      paymentData.cardName &&
      paymentData.cardNumber.length === 16 &&
      paymentData.cardExpiry &&
      paymentData.cardCVC.length === 3
    );
  };

  const handlePlaceOrder = () => {
    if (!isPaymentValid()) {
      addNotification("Por favor, preencha todos os dados do cartão corretamente", "error", 3000);
      return;
    }

    // Gerar número de pedido
    const newOrderNumber = "PED-" + Date.now();
    
    // Salvar pedido no OrderProvider
    addOrder({
      items: cartItems,
      total: getTotal(),
      shippingInfo: formData,
      paymentMethod: paymentData.cardName,
    });

    setOrderNumber(newOrderNumber);
    setStep(3);
    clearCart();
    addNotification("Pedido realizado com sucesso! 🎉", "success", 3000);
  };

  const goBack = () => {
    window.location.hash = "#carrinho";
  };

  if (cartItems.length === 0 && step !== 3) {
    return (
      <main className="checkout-page">
        <div className="empty-checkout">
          <h1>Seu carrinho está vazio</h1>
          <p>Adicione produtos antes de fazer checkout</p>
          <button onClick={goBack} className="back-btn">
            ← Voltar para carrinho
          </button>
        </div>
      </main>
    );
  }

  if (step === 3) {
    return (
      <main className="checkout-page">
        <div className="confirmation">
          <div className="success-icon">✅</div>
          <h1>Pedido Confirmado!</h1>
          <p className="order-number">Número do pedido: {orderNumber}</p>
          <p className="order-message">
            Seu pedido foi recebido e será processado em breve.
          </p>
          <div className="order-details">
            <p>Você receberá um email de confirmação em breve.</p>
            <p>Tempo de entrega: 5-7 dias úteis</p>
          </div>
          <button onClick={() => (window.location.hash = "")} className="home-btn">
            ← Voltar para Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        {/* Indicador de etapas */}
        <div className="steps-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span>1</span>
            <p>Endereço</p>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span>2</span>
            <p>Pagamento</p>
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span>3</span>
            <p>Confirmação</p>
          </div>
        </div>

        <div className="checkout-content">
          {/* Formulário de Endereço */}
          {step === 1 && (
            <div className="form-section">
              <h2>Endereço de Entrega</h2>
              <form>
                <div className="form-row">
                  <input
                    type="text"
                    name="name"
                    placeholder="Nome Completo"
                    value={formData.name}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="form-row">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="street"
                    placeholder="Rua"
                    value={formData.street}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="text"
                    name="number"
                    placeholder="Número"
                    value={formData.number}
                    onChange={handleAddressChange}
                    style={{ maxWidth: "120px" }}
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="complement"
                    placeholder="Complemento (opcional)"
                    value={formData.complement}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={handleAddressChange}
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="Estado (UF)"
                    value={formData.state}
                    onChange={handleAddressChange}
                    style={{ maxWidth: "100px" }}
                  />
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="CEP"
                    value={formData.zipcode}
                    onChange={handleAddressChange}
                    style={{ maxWidth: "150px" }}
                  />
                </div>
              </form>

              <div className="button-group">
                <button onClick={goBack} className="back-btn">
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!isAddressValid()}
                  className="next-btn"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Formulário de Pagamento */}
          {step === 2 && (
            <div className="form-section">
              <h2>Dados de Pagamento</h2>
              <form>
                <div className="form-row">
                  <input
                    type="text"
                    name="cardName"
                    placeholder="Nome no Cartão"
                    value={paymentData.cardName}
                    onChange={handlePaymentChange}
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="Número do Cartão (16 dígitos)"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    maxLength="16"
                  />
                </div>

                <div className="form-row">
                  <input
                    type="text"
                    name="cardExpiry"
                    placeholder="MM/AA"
                    value={paymentData.cardExpiry}
                    onChange={handlePaymentChange}
                  />
                  <input
                    type="text"
                    name="cardCVC"
                    placeholder="CVC"
                    value={paymentData.cardCVC}
                    onChange={handlePaymentChange}
                    maxLength="3"
                    style={{ maxWidth: "100px" }}
                  />
                </div>
              </form>

              <div className="button-group">
                <button onClick={() => setStep(1)} className="back-btn">
                  ← Voltar
                </button>
                <button onClick={handlePlaceOrder} className="next-btn">
                  Confirmar Pedido
                </button>
              </div>
            </div>
          )}

          {/* Resumo do Pedido */}
          <div className="order-summary">
            <h2>Resumo do Pedido</h2>
            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <span className="item-name">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="item-price">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Frete:</span>
                <span>Grátis</span>
              </div>
              <div className="total-row final">
                <span>Total:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
