import { ProductProvider } from './ProductProvider'
import { CartProvider } from './CartContext'
import { NotificationProvider } from './NotificationContext'
import { OrderProvider } from './OrderContext'
import { WishlistProvider } from './WishlistContext'
import { ReviewProvider } from './ReviewContext'
import { CouponProvider } from './CouponContext'
import { FreightProvider } from './FreightContext'
import { AuthProvider } from './AuthContext'

export default function StoreProvider({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <OrderProvider>
            <ProductProvider>
              <ReviewProvider>
                <CouponProvider>
                  <FreightProvider>
                    <NotificationProvider>
                      {children}
                    </NotificationProvider>
                  </FreightProvider>
                </CouponProvider>
              </ReviewProvider>
            </ProductProvider>
          </OrderProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
