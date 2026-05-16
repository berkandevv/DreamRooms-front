import {
  FaBolt,
  FaGlobeEurope,
  FaMagic,
  FaRegEye,
  FaRocket,
  FaShieldAlt,
} from 'react-icons/fa'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import Layout from '../components/Layout'

const heroImage =
  'https://images.pexels.com/photos/20639392/pexels-photo-20639392.jpeg?auto=compress&cs=tinysrgb&w=1800'

const storyImage =
  'https://images.pexels.com/photos/33636636/pexels-photo-33636636.jpeg?auto=compress&cs=tinysrgb&w=1200'

const values = [
  {
    description:
      'Solo propiedades seleccionadas a mano. Valoramos la calidad sobre el volumen en cada elección',
    icon: FaShieldAlt,
    title: 'Excelencia curada',
  },
  {
    description:
      'Tecnología que no interfiere, proporcionando claridad y eficiencia operativa',
    icon: FaMagic,
    title: 'Simplicidad funcional',
  },
  {
    description:
      'Gestión transparente para propietarios y datos de alta integridad en cada paso',
    icon: FaBolt,
    title: 'Confianza e integridad',
  },
  {
    description:
      'Hospitalidad sin fronteras, brindando una experiencia constante en más de 30 regiones',
    icon: FaGlobeEurope,
    title: 'Alcance global',
  },
]

const stats = [
  ['500+', 'Propiedades'],
  ['30+', 'Regiones'],
  ['98%', 'Satisfacción del huésped'],
]

export default function AboutPage() {
  const [companyEmail, setCompanyEmail] = useState('')
  const navigate = useNavigate()

  function handlePartnerSubmit(event) {
    event.preventDefault()

    const params = new URLSearchParams({
      account_type: 'owner',
    })

    if (companyEmail) {
      params.set('email', companyEmail)
    }

    navigate(`/register?${params.toString()}`)
  }

  return (
    <Layout>
      <section className="relative -mt-20 flex min-h-[620px] items-center overflow-hidden pt-20">
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
              Nuestra herencia
            </span>
            <h2 className="mb-6 text-3xl font-bold text-primary md:text-4xl">
              La narrativa de Dream Rooms
            </h2>
            <div className="space-y-4 text-justify text-lg leading-8 text-on-surface-variant">
              <p>
                Dream Rooms nació en la intersección de la pasión arquitectónica
                y la necesidad tecnológica. Nuestros fundadores, veteranos tanto
                del mundo de la hospitalidad moderna como del sector fintech,
                notaron una fricción persistente: las herramientas utilizadas
                para gestionar propiedades de clase mundial a menudo eran
                toscas, obsoletas y estaban desconectadas de la experiencia del
                huésped.
              </p>
              <p>
                Nos propusimos cerrar la brecha entre alojamientos cuidados y la
                gestión funcional. Al construir una plataforma que prioriza la
                confiabilidad institucional y los datos de alta integridad,
                permitimos que los propietarios se concentren en lo que realmente
                importa: el arte de la estancia.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-surface-container shadow-[0_14px_40px_rgba(19,27,46,0.14)]">
              <img
                alt="Interior de suite moderna"
                className="h-full w-full object-cover"
                src={storyImage}
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-lg bg-primary p-6 shadow-lg lg:block">
              <p className="text-2xl font-bold text-on-primary">
                Fundada en 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 md:grid-cols-2 md:px-8">
          <InfoCard
            description="Empoderar a los propietarios y facilitar estancias más claras para los viajeros a través de una tecnología útil y directa. Creemos que la gestión debe ser sencilla, dejando espacio para una experiencia cuidada."
            icon={FaRocket}
            title="Nuestra misión"
          />
          <InfoCard
            description="Convertirnos en un estándar para estancias bien seleccionadas y gestión hotelera simplificada. Nuestro objetivo es hacer que reservar y administrar alojamientos sea más claro, fiable y accesible."
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
                <p className="mb-1 text-5xl font-bold text-primary-fixed">
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
            Únete a nuestra colección de propiedades exclusivas y experimenta el
            futuro de la gestión de la hospitalidad.
          </p>
          <form
            className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
            onSubmit={handlePartnerSubmit}
          >
            <input
              className="min-w-0 flex-1 rounded-lg border border-outline bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              onChange={(event) => setCompanyEmail(event.target.value)}
              placeholder="Email de empresa"
              type="email"
              value={companyEmail}
            />
            <button
              className="h-12 rounded-lg bg-primary px-8 font-semibold text-on-primary shadow-lg transition hover:opacity-90 active:scale-[0.98]"
              type="submit"
            >
              Comenzar
            </button>
          </form>
        </div>
      </section>
    </Layout>
  )
}

function InfoCard({ description, icon: Icon, title, variant = 'primary' }) {
  const iconClass =
    variant === 'secondary'
      ? 'bg-secondary-container text-on-secondary-container'
      : 'bg-primary-container text-on-primary'

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
