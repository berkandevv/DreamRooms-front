import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AUTH_SESSION_CHANGED_EVENT,
  getAuthenticatedUser,
  getAuthToken,
} from '../services/authService'
import {
  addCustomerFavorite,
  getCustomerFavorites,
  removeCustomerFavorite,
} from '../services/customerFavoriteService'

function getUserRole(user) {
  const role = user?.role?.name || user?.role || user?.account_type || user?.type || ''

  return String(role).toLowerCase()
}

function getAuthSession() {
  const user = getAuthenticatedUser()
  const userRole = getUserRole(user)

  return {
    isAuthenticated: Boolean(getAuthToken()),
    isCustomer: userRole.includes('customer'),
  }
}

export function useCustomerFavorites() {
  const [authSession, setAuthSession] = useState(getAuthSession)
  const [favoriteHotels, setFavoriteHotels] = useState([])
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)
  const [favoritesError, setFavoritesError] = useState('')
  const canUseFavorites = authSession.isAuthenticated && authSession.isCustomer

  const favoriteIds = useMemo(() => {
    return new Set(favoriteHotels.map((hotel) => Number(hotel.id)))
  }, [favoriteHotels])

  const loadFavorites = useCallback(() => {
    if (!canUseFavorites) {
      setFavoriteHotels([])
      setFavoritesError('')
      return Promise.resolve([])
    }

    setIsLoadingFavorites(true)

    return getCustomerFavorites()
      .then((hotels) => {
        setFavoriteHotels(hotels)
        setFavoritesError('')

        return hotels
      })
      .catch((error) => {
        setFavoriteHotels([])
        setFavoritesError(error.message || 'No se pudieron cargar los favoritos.')

        return []
      })
      .finally(() => {
        setIsLoadingFavorites(false)
      })
  }, [canUseFavorites])

  const toggleFavorite = useCallback(
    async (hotel) => {
      if (!canUseFavorites) {
        window.alert('Inicia sesión como cliente para guardar favoritos.')
        return false
      }

      const hotelId = Number(hotel?.id)

      if (!hotelId) {
        return false
      }

      const wasFavorite = favoriteIds.has(hotelId)

      if (wasFavorite) {
        await removeCustomerFavorite(hotelId)
        setFavoriteHotels((hotels) => {
          return hotels.filter((favoriteHotel) => Number(favoriteHotel.id) !== hotelId)
        })
        return false
      }

      await addCustomerFavorite(hotelId)
      setFavoriteHotels((hotels) => {
        const alreadyExists = hotels.some((favoriteHotel) => {
          return Number(favoriteHotel.id) === hotelId
        })

        return alreadyExists ? hotels : [...hotels, hotel]
      })

      return true
    },
    [canUseFavorites, favoriteIds],
  )

  useEffect(() => {
    function handleAuthSessionChanged() {
      const nextAuthSession = getAuthSession()

      if (!nextAuthSession.isAuthenticated || !nextAuthSession.isCustomer) {
        setFavoriteHotels([])
        setFavoritesError('')
      }

      setAuthSession(nextAuthSession)
    }

    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, handleAuthSessionChanged)

    return () => {
      window.removeEventListener(
        AUTH_SESSION_CHANGED_EVENT,
        handleAuthSessionChanged,
      )
    }
  }, [])

  useEffect(() => {
    let shouldIgnoreResponse = false

    if (!canUseFavorites) {
      return undefined
    }

    Promise.resolve()
      .then(() => {
        if (shouldIgnoreResponse) {
          return []
        }

        setIsLoadingFavorites(true)

        return getCustomerFavorites()
      })
      .then((hotels) => {
        if (shouldIgnoreResponse) {
          return
        }

        setFavoriteHotels(hotels)
        setFavoritesError('')
      })
      .catch((error) => {
        if (shouldIgnoreResponse) {
          return
        }

        setFavoriteHotels([])
        setFavoritesError(error.message || 'No se pudieron cargar los favoritos.')
      })
      .finally(() => {
        if (!shouldIgnoreResponse) {
          setIsLoadingFavorites(false)
        }
      })

    return () => {
      shouldIgnoreResponse = true
    }
  }, [canUseFavorites])

  return {
    canUseFavorites,
    favoriteHotels,
    favoriteIds,
    favoritesError,
    isLoadingFavorites,
    loadFavorites,
    toggleFavorite,
  }
}
