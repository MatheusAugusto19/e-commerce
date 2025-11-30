import { Routes, Route } from 'react-router-dom'
import './App.scss'
import { ProductProvider } from './context/ProductProvider'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import { OrderProvider } from './context/OrderContext'
import { WishlistProvider } from './context/WishlistContext'
import { ReviewProvider } from './context/ReviewContext'
import { CouponProvider } from './context/CouponContext'
import { FreightProvider } from './context/FreightContext'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import NotificationContainer from './components/NotificationContainer'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import WishlistPage from './pages/WishlistPage'

function App() {
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
                      <div className="app-layout">
                        <Header />
                        <main className="app-main">
                          <NotificationContainer />
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/orders" element={<OrderHistoryPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                          </Routes>
                        </main>
                        <Footer />
                      </div>
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

export default App
