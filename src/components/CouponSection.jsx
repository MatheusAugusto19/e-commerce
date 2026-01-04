import { useState } from 'react';
import useStore from '../store/useStore';
import styles from './CouponSection.module.scss';

export default function CouponSection({ cartTotal }) {
  const { appliedCoupon, applyCoupon, removeCoupon, getAvailableCoupons, calculateDiscount, addNotification } =
    useStore(state => ({
      appliedCoupon: state.appliedCoupon,
      applyCoupon: state.applyCoupon,
      removeCoupon: state.removeCoupon,
      getAvailableCoupons: state.getAvailableCoupons,
      calculateDiscount: state.calculateDiscount,
      addNotification: state.addNotification,
    }));
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
    <div className={styles.couponSection}>
      <div className={styles.couponForm}>
        <h3>🎟️ Cupom de Desconto</h3>
        <form onSubmit={handleApplyCoupon}>
          <div className={styles.couponInputGroup}>
            <input
              type="text"
              placeholder="Digite seu código de cupom"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              disabled={appliedCoupon !== null}
              className={styles.couponInput}
            />
            <button
              type="submit"
              disabled={appliedCoupon !== null}
              className={styles.couponApplyBtn}
            >
              Aplicar
            </button>
          </div>
        </form>

        <button
          className={styles.showCouponsBtn}
          onClick={() => setShowCoupons(!showCoupons)}
        >
          {showCoupons ? '▼ Ocultar cupons disponíveis' : '▶ Ver cupons disponíveis'}
        </button>

        {showCoupons && (
          <div className={styles.couponsList}>
            <p className={styles.couponsTitle}>Cupons disponíveis:</p>
            {availableCoupons.length === 0 ? (
              <p className={styles.noCoupons}>Nenhum cupom disponível no momento</p>
            ) : (
              availableCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className={`${styles.couponCard} ${
                    appliedCoupon?.code === coupon.code ? styles.applied : ''
                  }`}
                >
                  <div className={styles.couponHeader}>
                    <span className={styles.couponCode}>{coupon.code}</span>
                    <span className={styles.couponBadge}>
                      {coupon.type === 'percentage'
                        ? `${coupon.discount}%`
                        : `R$ ${coupon.discount}`}
                    </span>
                  </div>
                  <p className={styles.couponDescription}>{coupon.description}</p>
                  <div className={styles.couponFooter}>
                    <span className={styles.couponUsage}>
                      {coupon.currentUses}/{coupon.maxUses} usos
                    </span>
                    <button
                      className={styles.quickApplyBtn}
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
        <div className={styles.appliedCoupon}>
          <div className={styles.appliedHeader}>
            <span className={styles.appliedLabel}>Cupom Aplicado:</span>
            <button className={styles.removeCouponBtn} onClick={handleRemoveCoupon}>
              ✕
            </button>
          </div>
          <p className={styles.appliedCode}>{appliedCoupon.code}</p>
          <p className={styles.appliedDescription}>{appliedCoupon.description}</p>
          <div className={styles.discountDisplay}>
            <span className={styles.discountLabel}>Desconto:</span>
            {appliedCoupon.type === 'percentage' ? (
              <span className={styles.discountValue}>
                -{appliedCoupon.discount}% (-R$ {discount.toFixed(2)})
              </span>
            ) : (
              <span className={styles.discountValue}>-R$ {discount.toFixed(2)}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
