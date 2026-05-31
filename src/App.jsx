import { useEffect, useRef, useState } from 'react'
import { matchPath, Route, Routes, useLocation } from 'react-router'
import AboutPage from './pages/AboutPage'
import AccountPage from './pages/AccountPage'
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

const routeAnimationLevels = [
  { level: 0, paths: ['/'] },
  { level: 1, paths: ['/hotels'] },
  { level: 2, paths: ['/hotels/:slug'] },
  { level: 3, paths: ['/hotels/:slug/checkout'] },
  { level: 4, paths: ['/favorites'] },
  { level: 5, paths: ['/my-bookings'] },
  { level: 6, paths: ['/about'] },
  { level: 6, paths: ['/account'] },
  { level: 7, paths: ['/help', '/contact', '/privacy', '/terms'] },
  { level: 8, paths: ['/login'] },
  { level: 9, paths: ['/register'] },
  { level: 10, paths: ['/owner'] },
]

// Obtiene el nivel visual asociado a una ruta
function getRouteAnimationLevel(pathname) {
  const matchingRoute = routeAnimationLevels.find(({ paths }) => {
    return paths.some((path) => matchPath({ end: true, path }, pathname))
  })

  return matchingRoute?.level ?? 0
}

// Decide la dirección de la animación entre dos rutas
function getRouteAnimation(previousPathname, currentPathname) {
  if (previousPathname === currentPathname) {
    return ''
  }

  return getRouteAnimationLevel(currentPathname) >=
    getRouteAnimationLevel(previousPathname)
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
          <Route element={<AccountPage />} path="/account" />
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
