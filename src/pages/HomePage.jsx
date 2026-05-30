import { useEffect, useState } from 'react'
import HeroSearch from '../components/HeroSearch'
import HotelGrid from '../components/HotelGrid'
import Layout from '../components/Layout'
import PartnerCTA from '../components/PartnerCTA'
import { useCustomerFavorites } from '../hooks/useCustomerFavorites'
import { getHotels } from '../services/hotelService'

// Obtiene los hoteles mejor valorados para la portada
function getTopRatedHotels(hotels) {
  return hotels
    .toSorted((firstHotel, secondHotel) => {
      return secondHotel.average_rating - firstHotel.average_rating
    })
    .slice(0, 6)
}

export default function HomePage() {
  const [hotels, setHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const { canUseFavorites, favoriteIds, toggleFavorite } = useCustomerFavorites()

  useEffect(() => {
    getHotels()
      .then((data) => {
        setHotels(getTopRatedHotels(data))
        setError('')
      })
      .catch(() => {
        setError('No se pudo cargar la lista de hoteles!')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <Layout>
      <HeroSearch />
      <HotelGrid
        error={error}
        favoriteIds={favoriteIds}
        hotels={hotels}
        isLoading={isLoading}
        onFavoriteToggle={canUseFavorites ? toggleFavorite : null}
      />
      <PartnerCTA />
    </Layout>
  )
}
