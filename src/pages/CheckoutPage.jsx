import { useState } from "react";
import useStore from "../store/useStore";
import CouponSection from "../components/CouponSection";
import FreightSelector from "../components/FreightSelector";
import {
  formatCardNumber,
  formatCardExpiry,
  formatCVC,
  validateAllPaymentData,
  maskCardNumber,
} from "../utils/paymentValidation";
import styles from "./CheckoutPage.module.scss";

export default function CheckoutPage() {
  const {
    cartItems,
    getTotal,
    clearCart,
    addNotification,
    addOrder,
    appliedCoupon,
    calculateDiscount,
    selectedFreight,
    selectFreight,
  } = useStore((state) => ({
    cartItems: state.cartItems,
    getTotal: state.getTotal,
    clearCart: state.clearCart,
    addNotification: state.addNotification,
    addOrder: state.addOrder,
    appliedCoupon: state.appliedCoupon,
    calculateDiscount: state.calculateDiscount,
    selectedFreight: state.selectedFreight,
    selectFreight: state.selectFreight,
  }));
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
  const [paymentErrors, setPaymentErrors] = useState({});
  const [orderNumber, setOrderNumber] = useState("");

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Aplicar máscaras conforme o campo
    if (name === "cardNumber") {
      formattedValue = formatCardNumber(value);
    }
    else if (name === "cardExpiry") {
      formattedValue = formatCardExpiry(value);
    }
    else if (name === "cardCVC") {
      formattedValue = formatCVC(value);
    }

    setPaymentData({ ...paymentData, [name]: formattedValue });

    // Validar em tempo real e remover erro se ficar válido
    if (paymentErrors[name]) {
      const tempData = { ...paymentData, [name]: formattedValue };
      const validation = validateAllPaymentData(tempData);
      if (!validation.errors[name]) {
        setPaymentErrors({ ...paymentErrors, [name]: undefined });
      }
    }
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
    const validation = validateAllPaymentData(paymentData);
    return validation.valid;
  };

  const handlePlaceOrder = () => {
    // Validar dados de pagamento
    const validation = validateAllPaymentData(paymentData);
    
    if (!validation.valid) {
      setPaymentErrors(validation.errors);
      addNotification("Por favor, corrija os erros no formulário de pagamento", "error", 3000);
      return;
    }

    // Gerar número de pedido
    const newOrderNumber = "PED-" + Date.now();
    
    // Calcular total com desconto e frete
    const subtotal = getTotal();
    const discount = calculateDiscount();
    const freight = selectedFreight?.price || 0;
    const finalTotal = subtotal - discount + freight;
    
    // Salvar pedido no OrderProvider
    addOrder({
      items: cartItems,
      total: finalTotal,
      subtotal: subtotal,
      discount: discount,
      freight: freight,
      freightType: selectedFreight?.name || 'Não selecionado',
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      shippingInfo: formData,
      paymentMethod: paymentData.cardName,
      cardMasked: maskCardNumber(paymentData.cardNumber),
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
      <main className={styles.checkoutPage}>
        <div className={styles.emptyCheckout}>
          <h1>Seu carrinho está vazio</h1>
          <p>Adicione produtos antes de fazer checkout</p>
          <button onClick={goBack} className={styles.backBtn}>
            ← Voltar para carrinho
          </button>
        </div>
      </main>
    );
  }

  if (step === 3) {
    return (
      <main className={styles.checkoutPage}>
        <div className={styles.confirmation}>
          <div className={styles.successIcon}>✅</div>
          <h1>Pedido Confirmado!</h1>
          <p className={styles.orderNumber}>Número do pedido: {orderNumber}</p>
          <p className={styles.orderMessage}>
            Seu pedido foi recebido e será processado em breve.
          </p>
          <div className={styles.orderDetails}>
            <p>Você receberá um email de confirmação em breve.</p>
            <p>Tempo de entrega: 5-7 dias úteis</p>
          </div>
          <button onClick={() => (window.location.hash = "")} className={styles.homeBtn}>
            ← Voltar para Home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.checkoutPage}>
      <div className={styles.checkoutContainer}>
        <h1>Checkout</h1>

        {/* Indicador de etapas */}
        <div className={styles.stepsIndicator}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ""}`}>
            <span>1</span>
            <p>Endereço</p>
          </div>
          <div className={`${styles.step} ${step >= 2 ? styles.active : ""}`}>
            <span>2</span>
            <p>Pagamento</p>
          </div>
          <div className={`${styles.step} ${step >= 3 ? styles.active : ""}`}>
            <span>3</span>
            <p>Confirmação</p>
          </div>
        </div>

        <div className={styles.checkoutContent}>
          {/* Formulário de Endereço */}
          {step === 1 && (
            <div className={styles.formSection}>
              <h2>Endereço de Entrega</h2>
              <form>
                <div className={styles.formRow}>
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

                <div className={styles.formRow}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefone"
                    value={formData.phone}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className={styles.formRow}>
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

                <div className={styles.formRow}>
                  <input
                    type="text"
                    name="complement"
                    placeholder="Complemento (opcional)"
                    value={formData.complement}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className={styles.formRow}>
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

                {formData.zipcode && (
                  <FreightSelector 
                    zipcode={formData.zipcode} 
                    cartTotal={getTotal()}
                    onSelect={(freight) => selectFreight(freight)}
                  />
                )}
              </form>

              <div className={styles.buttonGroup}>
                <button onClick={goBack} className={styles.backBtn}>
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!isAddressValid()}
                  className={styles.nextBtn}
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Formulário de Pagamento */}
          {step === 2 && (
            <div className={styles.formSection}>
              <h2>Dados de Pagamento</h2>
              <form>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Nome no Cartão"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      className={paymentErrors.cardName ? styles.inputError : ''}
                    />
                    {paymentErrors.cardName && (
                      <span className={styles.errorMessage}>⚠️ {paymentErrors.cardName}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      maxLength="19"
                      className={paymentErrors.cardNumber ? styles.inputError : ''}
                    />
                    {paymentErrors.cardNumber && (
                      <span className={styles.errorMessage}>⚠️ {paymentErrors.cardNumber}</span>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="cardExpiry"
                      placeholder="MM/AA"
                      value={paymentData.cardExpiry}
                      onChange={handlePaymentChange}
                      maxLength="5"
                      className={paymentErrors.cardExpiry ? styles.inputError : ''}
                    />
                    {paymentErrors.cardExpiry && (
                      <span className={styles.errorMessage}>⚠️ {paymentErrors.cardExpiry}</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      name="cardCVC"
                      placeholder="CVC"
                      value={paymentData.cardCVC}
                      onChange={handlePaymentChange}
                      maxLength="3"
                      className={paymentErrors.cardCVC ? styles.inputError : ''}
                      style={{ maxWidth: "100px" }}
                    />
                    {paymentErrors.cardCVC && (
                      <span className={styles.errorMessage}>⚠️ {paymentErrors.cardCVC}</span>
                    )}
                  </div>
                </div>
              </form>

              <CouponSection />

              <div className={styles.buttonGroup}>
                <button onClick={() => setStep(1)} className={styles.backBtn}>
                  ← Voltar
                </button>
                <button 
                  onClick={handlePlaceOrder} 
                  className={styles.nextBtn}
                  disabled={!isPaymentValid()}
                >
                  Confirmar Pedido
                </button>
              </div>
            </div>
          )}

          {/* Resumo do Pedido */}
          <div className={styles.orderSummary}>
            <h2>Resumo do Pedido</h2>
            <div className={styles.summaryItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.itemName}>
                    {item.name} x{item.quantity}
                  </span>
                  <span className={styles.itemPrice}>
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.totalRow}>
                <span>Subtotal:</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Frete:</span>
                <span>{selectedFreight ? `R$ ${selectedFreight.price.toFixed(2)}` : 'Não selecionado'}</span>
              </div>
              {appliedCoupon && calculateDiscount() > 0 && (
                <div className={`${styles.totalRow} ${styles.discountRow}`}>
                  <span>Desconto ({appliedCoupon.code}):</span>
                  <span>-R$ {calculateDiscount().toFixed(2)}</span>
                </div>
              )}
              <div className={`${styles.totalRow} ${styles.final}`}>
                <span>Total:</span>
                <span>R$ {(getTotal() - calculateDiscount() + (selectedFreight?.price || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
