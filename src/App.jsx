import { useState, useEffect } from 'react'
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
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#carrinho') {
        setCurrentPage('cart')
      } else if (window.location.hash === '#checkout') {
        setCurrentPage('checkout')
      } else if (window.location.hash === '#pedidos') {
        setCurrentPage('orders')
      } else if (window.location.hash === '#favoritos') {
        setCurrentPage('wishlist')
      } else {
        setCurrentPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

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
                          {currentPage === 'home' && <HomePage />}
                          {currentPage === 'cart' && <CartPage />}
                          {currentPage === 'checkout' && <CheckoutPage />}
                          {currentPage === 'orders' && <OrderHistoryPage />}
                          {currentPage === 'wishlist' && <WishlistPage />}
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
