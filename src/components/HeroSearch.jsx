import { useState } from 'react'
import { useNavigate } from 'react-router'

const heroImg =
  'https://images.pexels.com/photos/20639392/pexels-photo-20639392.jpeg?auto=compress&cs=tinysrgb&w=1800'

export default function HeroSearch() {
  const navigate = useNavigate()
  const [searchData, setSearchData] = useState({
    destination: '',
    check_in: '',
    check_out: '',
    adults: '',
    children: '',
  })

  function handleInputChange(event) {
    const { name, value } = event.target

    setSearchData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const params = new URLSearchParams()

    Object.entries(searchData).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })

    navigate(`/hotels?${params.toString()}`)
  }

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
      <div className="relative flex min-h-[440px] items-center overflow-hidden rounded-xl bg-primary-container">
        <img
          alt="Piscina de resort al atardecer con palmeras"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          src={heroImg}
        />
        <div className="absolute inset-0 bg-primary/45" />

        <div className="relative mx-auto w-full max-w-5xl px-5 py-12 md:px-10">
          <h1 className="mx-auto max-w-5xl text-center text-4xl font-bold leading-tight text-on-primary md:whitespace-nowrap md:text-5xl">
            Tu próxima escapada empieza aquí
          </h1>

          <form
            className="mt-8 grid gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 shadow-[0_18px_45px_rgba(19,27,46,0.22)] md:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr_auto] md:rounded-full"
            onSubmit={handleSubmit}
          >
            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Dónde vas
              </span>
              <input
                className="mt-1 w-full border-0 p-0 text-on-surface outline-none placeholder:text-outline"
                name="destination"
                onChange={handleInputChange}
                placeholder="Destino o hotel"
                type="text"
                value={searchData.destination}
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Check-in
              </span>
              <input
                className="mt-1 w-full cursor-pointer rounded-md border-0 bg-surface-container-low px-2 py-1 text-sm text-on-surface outline-none [color-scheme:light]"
                name="check_in"
                onChange={handleInputChange}
                type="date"
                value={searchData.check_in}
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Check-out
              </span>
              <input
                className="mt-1 w-full cursor-pointer rounded-md border-0 bg-surface-container-low px-2 py-1 text-sm text-on-surface outline-none [color-scheme:light]"
                name="check_out"
                onChange={handleInputChange}
                type="date"
                value={searchData.check_out}
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Adultos
              </span>
              <input
                className="mt-1 w-full border-0 p-0 text-on-surface outline-none placeholder:text-outline"
                min="1"
                name="adults"
                onChange={handleInputChange}
                placeholder="2"
                type="number"
                value={searchData.adults}
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Niños
              </span>
              <input
                className="mt-1 w-full border-0 p-0 text-on-surface outline-none placeholder:text-outline"
                min="0"
                name="children"
                onChange={handleInputChange}
                placeholder="0"
                type="number"
                value={searchData.children}
              />
            </label>

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
