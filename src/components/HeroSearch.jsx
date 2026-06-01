import { useState } from 'react'
import { useNavigate } from 'react-router'
import HeroSearchField from './HeroSearchField'

const heroImg = '/images/static-pages/about-hero.jpg'

export default function HeroSearch() {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    destination: '',
    check_in: '',
    check_out: '',
    adults: '',
    children: '',
  })

  // Actualiza el valor de un campo de búsqueda
  function handleInputChange(event) {
    const { name, value } = event.target

    setSearchData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // Envía los filtros seleccionados al catálogo
  function handleSubmit(event) {
    event.preventDefault()

    const params = new URLSearchParams()
    const formData = new FormData(event.currentTarget)

    Object.keys(searchData).forEach((key) => {
      const value = formData.get(key)?.toString().trim()

      if (value) {
        params.set(key, value)
      }
    })

    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
      <div className="relative flex min-h-110 items-center overflow-hidden rounded-xl bg-primary-container">
        <img
          alt="Piscina de resort al atardecer con palmeras"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={heroImg}
        />
        <div className="absolute inset-0 bg-primary/45" />

        <div className="relative mx-auto w-full max-w-5xl px-5 py-12 md:px-10">
          <h1 className="mx-auto max-w-5xl text-center text-4xl font-bold leading-tight text-on-primary md:text-5xl">
            Tu próxima escapada empieza aquí
          </h1>

          <form
            className="mt-8 grid gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 shadow-[0_18px_45px_rgba(19,27,46,0.22)] lg:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr_auto] lg:rounded-full"
            onSubmit={handleSubmit}
          >
            <HeroSearchField
              label="Dónde vas"
              name="destination"
              onChange={handleInputChange}
              placeholder="Destino o hotel"
              value={searchData.destination}
            />
            <HeroSearchField
              label="Check-in"
              name="check_in"
              onChange={handleInputChange}
              type="date"
              value={searchData.check_in}
            />
            <HeroSearchField
              label="Check-out"
              name="check_out"
              onChange={handleInputChange}
              type="date"
              value={searchData.check_out}
            />
            <HeroSearchField
              label="Adultos"
              min="1"
              name="adults"
              onChange={handleInputChange}
              placeholder="2"
              type="number"
              value={searchData.adults}
            />
            <HeroSearchField
              label="Niños"
              min="0"
              name="children"
              onChange={handleInputChange}
              placeholder="0"
              type="number"
              value={searchData.children}
            />

            <button
              className="rounded-full bg-primary px-7 py-3 font-semibold text-on-primary transition hover:opacity-90"
              type="submit"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
