import React, { useState, createContext } from 'react';

export const CouponContext = createContext();

export const CouponProvider = ({ children }) => {
  // Lista de cupons disponíveis (hardcoded para exemplo)
  const availableCoupons = [
    {
      code: 'DESCONTO10',
      discount: 10,
      type: 'percentage', // 'percentage' ou 'fixed'
      description: '10% de desconto em qualquer compra',
      minPurchase: 0,
      maxUses: 100,
      currentUses: 25,
      active: true,
    },
    {
      code: 'DESCONTO20',
      discount: 20,
      type: 'percentage',
      description: '20% de desconto em compras acima de R$ 100',
      minPurchase: 100,
      maxUses: 50,
      currentUses: 10,
      active: true,
    },
    {
      code: 'BLACKFRIDAY',
      discount: 50,
      type: 'fixed',
      description: 'R$ 50 de desconto em compras acima de R$ 200',
      minPurchase: 200,
      maxUses: 200,
      currentUses: 150,
      active: true,
    },
    {
      code: 'FRETEGRATIS',
      discount: 25,
      type: 'fixed',
      description: 'R$ 25 de desconto (equivalente a frete grátis)',
      minPurchase: 50,
      maxUses: 500,
      currentUses: 300,
      active: true,
    },
    {
      code: 'NOVO2024',
      discount: 15,
      type: 'percentage',
      description: '15% de desconto para clientes novos',
      minPurchase: 0,
      maxUses: 1000,
      currentUses: 400,
      active: true,
    },
  ];

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const validateCoupon = (code, cartTotal) => {
    const coupon = availableCoupons.find((c) => c.code === code.toUpperCase());

    if (!coupon) {
      return {
        valid: false,
        message: 'Cupom não encontrado',
      };
    }

    if (!coupon.active) {
      return {
        valid: false,
        message: 'Este cupom não está mais ativo',
      };
    }

    if (coupon.currentUses >= coupon.maxUses) {
      return {
        valid: false,
        message: 'Este cupom atingiu o limite de uso',
      };
    }

    if (cartTotal < coupon.minPurchase) {
      return {
        valid: false,
        message: `Este cupom requer uma compra mínima de R$ ${coupon.minPurchase.toFixed(2)}`,
      };
    }

    return {
      valid: true,
      coupon,
      message: 'Cupom aplicado com sucesso!',
    };
  };

  const calculateDiscount = (cartTotal) => {
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      return (cartTotal * appliedCoupon.discount) / 100;
    }

    // fixed
    return Math.min(appliedCoupon.discount, cartTotal);
  };

  const applyCoupon = (code, cartTotal) => {
    const validation = validateCoupon(code, cartTotal);
    if (validation.valid) {
      setAppliedCoupon(validation.coupon);
    }
    return validation;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getAvailableCoupons = () => {
    return availableCoupons.filter((c) => c.active);
  };

  const value = {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    calculateDiscount,
    getAvailableCoupons,
    validateCoupon,
  };

  return (
    <CouponContext.Provider value={value}>{children}</CouponContext.Provider>
  );
};
