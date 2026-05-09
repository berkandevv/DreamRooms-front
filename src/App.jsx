import { Route, Routes } from 'react-router'
import HotelDetailPage from './pages/HotelDetailPage'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<HotelDetailPage />} path="/hotels/:slug" />
    </Routes>
  )
}
