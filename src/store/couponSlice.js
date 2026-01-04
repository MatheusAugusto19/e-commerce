const couponSlice = (set, get) => ({
  availableCoupons: [
    { code: 'DESCONTO10', discount: 10, type: 'percentage', description: '10% de desconto em qualquer compra', minPurchase: 0, maxUses: 100, currentUses: 25, active: true },
    { code: 'DESCONTO20', discount: 20, type: 'percentage', description: '20% de desconto em compras acima de R$ 100', minPurchase: 100, maxUses: 50, currentUses: 10, active: true },
    { code: 'BLACKFRIDAY', discount: 50, type: 'fixed', description: 'R$ 50 de desconto em compras acima de R$ 200', minPurchase: 200, maxUses: 200, currentUses: 150, active: true },
    { code: 'FRETEGRATIS', discount: 25, type: 'fixed', description: 'R$ 25 de desconto (equivalente a frete grátis)', minPurchase: 50, maxUses: 500, currentUses: 300, active: true },
    { code: 'NOVO2024', discount: 15, type: 'percentage', description: '15% de desconto para clientes novos', minPurchase: 0, maxUses: 1000, currentUses: 400, active: true },
  ],
  appliedCoupon: null,

  validateCoupon: (code, cartTotal) => {
    const coupon = get().availableCoupons.find((c) => c.code === code.toUpperCase());
    if (!coupon) return { valid: false, message: 'Cupom não encontrado' };
    if (!coupon.active) return { valid: false, message: 'Este cupom não está mais ativo' };
    if (coupon.currentUses >= coupon.maxUses) return { valid: false, message: 'Este cupom atingiu o limite de uso' };
    if (cartTotal < coupon.minPurchase) return { valid: false, message: `Este cupom requer uma compra mínima de R$ ${coupon.minPurchase.toFixed(2)}` };
    return { valid: true, coupon, message: 'Cupom aplicado com sucesso!' };
  },

  calculateDiscount: (cartTotal) => {
    const { appliedCoupon } = get();
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percentage') return (cartTotal * appliedCoupon.discount) / 100;
    return Math.min(appliedCoupon.discount, cartTotal);
  },

  applyCoupon: (code, cartTotal) => {
    const validation = get().validateCoupon(code, cartTotal);
    if (validation.valid) {
      set({ appliedCoupon: validation.coupon });
    }
    return validation;
  },

  removeCoupon: () => set({ appliedCoupon: null }),
  
  getAvailableCoupons: () => get().availableCoupons.filter(c => c.active),
});

export default couponSlice;
