import { useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import AboutPage from './pages/AboutPage'
import CheckoutPage from './pages/CheckoutPage'
import ContactPage from './pages/ContactPage'
import HelpCenterPage from './pages/HelpCenterPage'
import FavoritesPage from './pages/FavoritesPage'
import HotelDetailPage from './pages/HotelDetailPage'
import HotelsPage from './pages/HotelsPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyBookingsPage from './pages/MyBookingsPage'
import OwnerPanelPage from './pages/OwnerPanelPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import RegisterPage from './pages/RegisterPage'
import TermsPage from './pages/TermsPage'

function getRouteLevel(pathname) {
  if (pathname === '/') {
    return 0
  }

  if (pathname === '/hotels') {
    return 1
  }

  if (pathname.startsWith('/hotels/') && !pathname.includes('/checkout')) {
    return 2
  }

  if (pathname.includes('/checkout')) {
    return 3
  }

  if (pathname === '/favorites') {
    return 4
  }

  if (pathname === '/my-bookings') {
    return 5
  }

  if (pathname === '/about') {
    return 6
  }

  if (['/help', '/contact', '/privacy', '/terms'].includes(pathname)) {
    return 7
  }

  if (pathname === '/login') {
    return 8
  }

  if (pathname === '/register') {
    return 9
  }

  if (pathname.startsWith('/owner')) {
    return 10
  }

  return 0
}

function getRouteAnimation(previousPathname, currentPathname) {
  if (previousPathname === currentPathname) {
    return ''
  }

  return getRouteLevel(currentPathname) >= getRouteLevel(previousPathname)
    ? 'route-slide-in-right'
    : 'route-slide-in-left'
}

export default function App() {
  const location = useLocation()
  const previousPathnameRef = useRef(location.pathname)
  const [routeAnimation, setRouteAnimation] = useState('')

  useEffect(() => {
    setRouteAnimation(
      getRouteAnimation(previousPathnameRef.current, location.pathname),
    )
    previousPathnameRef.current = location.pathname
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <div className="overflow-x-clip">
      <div className={routeAnimation} key={location.pathname}>
        <Routes location={location}>
          <Route element={<HomePage />} path="/" />
          <Route element={<HotelsPage />} path="/hotels" />
          <Route element={<HotelDetailPage />} path="/hotels/:slug" />
          <Route element={<CheckoutPage />} path="/hotels/:slug/checkout" />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<HelpCenterPage />} path="/help" />
          <Route element={<ContactPage />} path="/contact" />
          <Route element={<PrivacyPolicyPage />} path="/privacy" />
          <Route element={<TermsPage />} path="/terms" />
          <Route element={<FavoritesPage />} path="/favorites" />
          <Route element={<MyBookingsPage />} path="/my-bookings" />
          <Route element={<OwnerPanelPage />} path="/owner" />
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
        </Routes>
      </div>
    </div>
  )
}
