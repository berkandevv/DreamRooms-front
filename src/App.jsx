import { useEffect, useState } from 'react'
import HeroSearch from './components/HeroSearch'
import HotelGrid from './components/HotelGrid'
import Layout from './components/Layout'
import PartnerCTA from './components/PartnerCTA'
import { getHotels } from './services/hotelService'

export default function App() {
  const [hotels, setHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getHotels()
      .then((data) => {
        setHotels(data)
        setError('')
      })
      .catch(() => {
        setError('No se pudo cargar la lista de hoteles.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <Layout>
      <HeroSearch />
      <HotelGrid error={error} hotels={hotels} isLoading={isLoading} />
      <PartnerCTA />
    </Layout>
  )
}
