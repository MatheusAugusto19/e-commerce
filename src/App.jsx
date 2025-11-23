import { useState, useEffect } from 'react'
import './App.scss'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationProvider'
import { OrderProvider } from './context/OrderProvider'
import { FilterProvider } from './context/FilterProvider'
import { WishlistProvider } from './context/WishlistProvider'
import { ReviewProvider } from './context/ReviewProvider'
import { CouponProvider } from './context/CouponProvider'
import { PaginationProvider } from './context/PaginationProvider'
import { FreightProvider } from './context/FreightProvider'
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
    <CartProvider>
      <WishlistProvider>
        <OrderProvider>
          <FilterProvider>
            <ReviewProvider>
              <CouponProvider>
                <PaginationProvider>
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
                </PaginationProvider>
              </CouponProvider>
            </ReviewProvider>
          </FilterProvider>
        </OrderProvider>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
