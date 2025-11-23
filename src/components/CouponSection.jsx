import React, { useState } from 'react';
import { useCoupon } from '../context/useCoupon';
import { useNotification } from '../context/useNotification';
import './CouponSection.scss';

export default function CouponSection({ cartTotal }) {
  const { appliedCoupon, applyCoupon, removeCoupon, getAvailableCoupons, calculateDiscount } =
    useCoupon();
  const { addNotification } = useNotification();
  const [couponCode, setCouponCode] = useState('');
  const [showCoupons, setShowCoupons] = useState(false);

  const handleApplyCoupon = (e) => {
    e.preventDefault();

    if (!couponCode.trim()) {
      addNotification('Digite um código de cupom', 'warning', 2000);
      return;
    }

    const result = applyCoupon(couponCode, cartTotal);

    if (result.valid) {
      addNotification(`✅ ${result.message}`, 'success', 2000);
      setCouponCode('');
    } else {
      addNotification(`❌ ${result.message}`, 'error', 2000);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponCode('');
    addNotification('Cupom removido', 'info', 2000);
  };

  const handleQuickApply = (code) => {
    setCouponCode(code);
    const result = applyCoupon(code, cartTotal);

    if (result.valid) {
      addNotification(`✅ Cupom ${code} aplicado!`, 'success', 2000);
      setShowCoupons(false);
    } else {
      addNotification(`❌ ${result.message}`, 'error', 2000);
    }
  };

  const discount = calculateDiscount(cartTotal);
  const availableCoupons = getAvailableCoupons();

  return (
    <div className="coupon-section">
      <div className="coupon-form">
        <h3>🎟️ Cupom de Desconto</h3>
        <form onSubmit={handleApplyCoupon}>
          <div className="coupon-input-group">
            <input
              type="text"
              placeholder="Digite seu código de cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={appliedCoupon !== null}
              className="coupon-input"
            />
            <button
              type="submit"
              disabled={appliedCoupon !== null}
              className="coupon-apply-btn"
            >
              Aplicar
            </button>
          </div>
        </form>

        <button
          className="show-coupons-btn"
          onClick={() => setShowCoupons(!showCoupons)}
        >
          {showCoupons ? '▼ Ocultar cupons disponíveis' : '▶ Ver cupons disponíveis'}
        </button>

        {showCoupons && (
          <div className="coupons-list">
            <p className="coupons-title">Cupons disponíveis:</p>
            {availableCoupons.length === 0 ? (
              <p className="no-coupons">Nenhum cupom disponível no momento</p>
            ) : (
              availableCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className={`coupon-card ${appliedCoupon?.code === coupon.code ? 'applied' : ''}`}
                >
                  <div className="coupon-header">
                    <span className="coupon-code">{coupon.code}</span>
                    <span className="coupon-badge">
                      {coupon.type === 'percentage'
                        ? `${coupon.discount}%`
                        : `R$ ${coupon.discount}`}
                    </span>
                  </div>
                  <p className="coupon-description">{coupon.description}</p>
                  <div className="coupon-footer">
                    <span className="coupon-usage">
                      {coupon.currentUses}/{coupon.maxUses} usos
                    </span>
                    <button
                      className="quick-apply-btn"
                      onClick={() => handleQuickApply(coupon.code)}
                      disabled={appliedCoupon !== null}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {appliedCoupon && (
        <div className="applied-coupon">
          <div className="applied-header">
            <span className="applied-label">Cupom Aplicado:</span>
            <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
              ✕
            </button>
          </div>
          <p className="applied-code">{appliedCoupon.code}</p>
          <p className="applied-description">{appliedCoupon.description}</p>
          <div className="discount-display">
            <span className="discount-label">Desconto:</span>
            {appliedCoupon.type === 'percentage' ? (
              <span className="discount-value">
                -{appliedCoupon.discount}% (-R$ {discount.toFixed(2)})
              </span>
            ) : (
              <span className="discount-value">-R$ {discount.toFixed(2)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
