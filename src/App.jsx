import { Routes, Route } from 'react-router-dom'
import './App.scss'
import StoreProvider from './context/StoreProvider'
import Header from './components/Header'
import Footer from './components/Footer'
import NotificationContainer from './components/NotificationContainer'
import HomePage from './pages/HomePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import WishlistPage from './pages/WishlistPage'
import ProductPage from './pages/ProductPage'

function App() {
  return (
    <StoreProvider>
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
            <Route path="/product/:productId" element={<ProductPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </StoreProvider>
  )
}

export default App
