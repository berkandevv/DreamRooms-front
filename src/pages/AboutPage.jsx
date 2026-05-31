import {
  FaBolt,
  FaGlobeEurope,
  FaMagic,
  FaRegEye,
  FaRocket,
  FaShieldAlt,
} from 'react-icons/fa'
import Layout from '../components/Layout'
import PartnerRegistrationForm from '../components/PartnerRegistrationForm'

const heroImage = '/images/static-pages/about-hero.jpg'

const storyImage = '/images/static-pages/about-story-elegant-pexels.jpg'

const values = [
  {
    description:
      'Consulta alojamientos, habitaciones, servicios y reseñas desde un catálogo claro y accesible.',
    icon: FaShieldAlt,
    title: 'Catálogo útil',
  },
  {
    description:
      'Comprueba la disponibilidad por fechas antes de confirmar una estancia.',
    icon: FaMagic,
    title: 'Reservas claras',
  },
  {
    description:
      'Gestiona hoteles, tipos de habitación, tarifas y disponibilidad desde un único panel.',
    icon: FaBolt,
    title: 'Gestión directa',
  },
  {
    description:
      'Separa las herramientas de viajeros y propietarios para mostrar a cada persona lo necesario.',
    icon: FaGlobeEurope,
    title: 'Experiencia sencilla',
  },
]

const stats = [
  ['Hoteles', 'Catálogo y filtros'],
  ['Estancias', 'Disponibilidad y reservas'],
  ['Propietarios', 'Inventario y pagos'],
]

export default function AboutPage() {
  return (
    <Layout>
      <section className="relative -mt-20 flex min-h-155 items-center overflow-hidden pt-20">
        <img
          alt="Piscina de resort al atardecer con palmeras"
          className="absolute inset-0 h-full w-full object-cover opacity-85"
          src={heroImage}
        />
        <div className="absolute inset-0 bg-primary/45" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 md:px-8">
          <h1 className="max-w-4xl text-5xl font-bold leading-tight text-on-primary md:text-6xl">
            Redefiniendo la Hospitalidad
            <br />
            para el Mundo Moderno
          </h1>
        </div>
      </section>

      <section className="bg-surface-container-lowest py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 md:grid-cols-2 md:px-8">
          <div>
            <span className="mb-4 block text-sm font-bold uppercase tracking-widest text-secondary">
              El proyecto
            </span>
            <h2 className="mb-6 text-3xl font-bold text-primary md:text-4xl">
              Una plataforma para reservar y gestionar alojamientos
            </h2>
            <div className="space-y-4 text-justify text-lg leading-8 text-on-surface-variant">
              <p>
                Dream Rooms reúne en una misma aplicación la búsqueda de
                hoteles, la consulta de habitaciones y la creación de reservas.
                Los viajeros pueden filtrar alojamientos, comprobar fechas,
                guardar favoritos y gestionar sus estancias.
              </p>
              <p>
                La plataforma también ofrece a los propietarios un panel para
                publicar hoteles, configurar tipos de habitación, actualizar
                precios y disponibilidad, revisar reservas y registrar pagos
                manuales cuando correspondan.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-4/5 overflow-hidden rounded-xl bg-surface-container shadow-[0_14px_40px_rgba(19,27,46,0.14)]">
              <img
                alt="Lobby elegante de hotel con iluminación cálida"
                className="h-full w-full object-cover"
                src={storyImage}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 md:grid-cols-2 md:px-8">
          <InfoCard
            description="Facilitar la búsqueda y reserva de alojamientos mientras damos a los propietarios herramientas concretas para mantener actualizado su inventario."
            icon={FaRocket}
            title="Nuestra misión"
          />
          <InfoCard
            description="Mantener una experiencia directa para viajeros y propietarios: información visible, disponibilidad por fechas y operaciones reunidas en un mismo lugar."
            icon={FaRegEye}
            title="Nuestra visión"
            variant="secondary"
          />
        </div>
      </section>

      <section className="bg-surface-container-lowest py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-primary md:text-4xl">
              Nuestros valores fundamentales
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-primary" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-container py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-around gap-10 px-5 md:flex-row md:px-8">
          {stats.map(([value, label], index) => (
            <div className="contents" key={label}>
              {index > 0 && (
                <div className="hidden h-12 w-px bg-on-primary-container/30 md:block" />
              )}
              <div className="text-center">
                <p className="mb-1 text-3xl font-bold text-primary-fixed">
                  {value}
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-primary-fixed-dim">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-outline-variant bg-surface-container-low py-20">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            ¿Listo para elevar tu portafolio?
          </h2>
          <p className="mb-8 text-lg leading-8 text-on-surface-variant">
            Crea una cuenta de propietario y empieza a configurar tus
            alojamientos desde el panel de gestión.
          </p>
          <PartnerRegistrationForm
            buttonLabel="Comenzar"
            className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            inputClassName="min-w-0 flex-1 rounded-lg border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </section>
    </Layout>
  )
}

function InfoCard({ description, icon: Icon, title, variant = 'primary' }) {
  const iconClass =
    variant === 'secondary'
      ? 'bg-secondary-container text-black'
      : 'bg-secondary-container text-primary'

  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-[0_8px_24px_rgba(19,27,46,0.08)] transition hover:shadow-[0_18px_40px_rgba(19,27,46,0.14)]">
      <div
        className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${iconClass}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-4 text-2xl font-bold text-primary">{title}</h3>
      <p className="text-justify text-lg leading-8 text-on-surface-variant">
        {description}
      </p>
    </article>
  )
}

function ValueCard({ description, icon: Icon, title }) {
  return (
    <article className="rounded-xl p-6 text-center transition hover:bg-surface-container-low">
      <Icon className="mx-auto mb-5 h-11 w-11 text-primary" />
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
        {title}
      </h3>
      <p className="leading-7 text-on-surface-variant">{description}</p>
    </article>
  )
}
