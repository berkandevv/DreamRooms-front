const heroImg =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCV1qacPl4IX-7LBCCSUJvFIuFIhdCUWMPJb1jKZhsJuHre3UCMvPS2OWx6CocE8f31IBMUwu0c-5GGR_oiJwHsOqld8orKIajB2zcqXX3_Sfz7-veA1nlkauRkQa4FylxMkj10MEe5dcjqhKBtc_SnTyWsJ0MoVO-4Cz9csSw1vvST1G4uQUS_au7RgJ5Py5gAmQSkQ0ES4eiDlqKC_o14MRegdpgEfYoGfFVK7f6uBcseJfMuPkvzVATwV_ZpeqODQwwTMdKJtXo'

export default function HeroSearch() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-10 md:px-8">
      <div className="relative flex min-h-[440px] items-center overflow-hidden rounded-xl bg-primary-container">
        <img
          alt="Hotel moderno de lujo"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src={heroImg}
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 py-12 md:px-10">
          <h1 className="mx-auto max-w-5xl text-center text-4xl font-bold leading-tight text-on-primary md:whitespace-nowrap md:text-5xl">
            Tu próxima escapada empieza aquí
          </h1>

          <form className="mt-8 grid gap-3 rounded-2xl border border-outline-variant bg-surface-container-lowest p-3 shadow-[0_18px_45px_rgba(19,27,46,0.22)] md:grid-cols-[1.3fr_1fr_1fr_0.8fr_0.8fr_auto] md:rounded-full">
            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Dónde vas
              </span>
              <input
                className="mt-1 w-full border-0 p-0 text-on-surface outline-none placeholder:text-outline"
                placeholder="Destino o hotel"
                type="text"
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Check-in
              </span>
              <input
                className="mt-1 w-full cursor-pointer rounded-md border-0 bg-surface-container-low px-2 py-1 text-sm text-on-surface outline-none [color-scheme:light]"
                type="date"
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Check-out
              </span>
              <input
                className="mt-1 w-full cursor-pointer rounded-md border-0 bg-surface-container-low px-2 py-1 text-sm text-on-surface outline-none [color-scheme:light]"
                type="date"
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Adultos
              </span>
              <input
                className="mt-1 w-full border-0 p-0 text-on-surface outline-none placeholder:text-outline"
                min="1"
                placeholder="2"
                type="number"
              />
            </label>

            <label className="px-4 py-2 md:border-r md:border-outline-variant">
              <span className="block text-xs font-bold uppercase text-secondary">
                Niños
              </span>
              <input
                className="mt-1 w-full border-0 p-0 text-on-surface outline-none placeholder:text-outline"
                min="0"
                placeholder="0"
                type="number"
              />
            </label>

            <button
              className="rounded-full bg-primary px-7 py-3 font-semibold text-on-primary transition hover:opacity-90"
              type="button"
            >
              Buscar
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
