import { Route, Routes } from 'react-router'
import HotelDetailPage from './pages/HotelDetailPage'
import HotelsPage from './pages/HotelsPage'
import HomePage from './pages/HomePage'

export default function App() {
  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<HotelsPage />} path="/hotels" />
      <Route element={<HotelDetailPage />} path="/hotels/:slug" />
    </Routes>
  )
}
