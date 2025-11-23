import { useContext } from 'react';
import { CouponContext } from './createCouponContext';

export const useCoupon = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupon must be used within CouponProvider');
  }
  return context;
};
