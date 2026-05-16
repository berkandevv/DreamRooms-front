import { Route, Routes } from 'react-router'
import HotelDetailPage from './pages/HotelDetailPage'
import HotelsPage from './pages/HotelsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CheckoutPage from './pages/CheckoutPage'

export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<HotelsPage />} path="/hotels" />
      <Route element={<HotelDetailPage />} path="/hotels/:slug" />
      <Route element={<CheckoutPage />} path="/hotels/:slug/checkout" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<RegisterPage />} path="/register" />
    </Routes>
  )
}
