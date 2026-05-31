import {
  FaCalendarAlt,
  FaChevronDown,
  FaCreditCard,
  FaRocket,
  FaUserCog,
} from 'react-icons/fa'
import { Link } from 'react-router'
import Layout from '../components/Layout'

const categories = [
  {
    description:
      'Configura tu propiedad, completa tu perfil y publica tus primeras habitaciones.',
    icon: FaRocket,
    title: 'Primeros pasos',
  },
  {
    description:
      'Controla disponibilidad, bloqueos, cambios de fechas y comunicación con huéspedes.',
    icon: FaCalendarAlt,
    title: 'Gestión de reservas',
  },
  {
    description:
      'Administra usuarios, roles del equipo, datos fiscales y seguridad de la cuenta.',
    icon: FaUserCog,
    title: 'Cuenta de propietario',
  },
  {
    description:
      'Consulta liquidaciones, comisiones, facturas y transferencias bancarias.',
    icon: FaCreditCard,
    title: 'Pagos',
  },
]

const faqs = [
  '¿Cómo puedo actualizar la disponibilidad de mis habitaciones?',
  '¿Cuándo recibiré el pago de mis reservas completadas?',
  '¿Qué debo hacer si un huésped cancela a última hora?',
  '¿Puedo integrar Dream Rooms con otros canales de venta?',
]

const heroImage = '/images/static-pages/about-story.jpg'

export default function HelpCenterPage() {
  return (
    <Layout>
      <section className="bg-surface-container-low py-16 text-center">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-secondary">
            Centro de ayuda
          </p>
          <h1 className="mt-3 text-4xl font-bold text-primary md:text-5xl">
            ¿En qué podemos ayudarte?
          </h1>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary">
              Categorías populares
            </h2>
            <p className="mt-2 text-secondary">
              Explora nuestros recursos por tema para encontrar ayuda rápida.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <article
                className="flex min-h-64 flex-col rounded-lg border border-outline-variant bg-surface-container-lowest p-7 shadow-sm"
                key={category.title}
              >
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary-container text-primary">
                  <category.icon className="h-5 w-5" />
                </span>
                <h3 className="text-2xl font-bold text-primary">
                  {category.title}
                </h3>
                <p className="mt-3 flex-1 leading-7 text-on-surface-variant">
                  {category.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-lowest py-16">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="text-center text-3xl font-bold text-primary">
            Preguntas frecuentes
          </h2>
          <div className="mt-10 divide-y divide-outline-variant">
            {faqs.map((question) => (
              <details className="group py-5" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-primary">
                  {question}
                  <FaChevronDown className="h-3 w-3 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-7 text-on-surface-variant">
                  Escríbenos con el detalle de tu caso y el equipo de Dream
                  Rooms te indicará los siguientes pasos para resolverlo.
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg bg-surface-container p-8 text-center">
            <h3 className="text-2xl font-bold text-primary">
              ¿Aún tienes dudas?
            </h3>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-secondary">
              Nuestro equipo de soporte puede ayudarte con reservas,
              disponibilidad, pagos o configuración de propiedades.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                className="rounded-lg border border-outline bg-surface-container-lowest px-6 py-3 text-sm font-semibold text-primary transition hover:border-primary"
                to="/contact"
              >
                Enviar consulta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface py-14">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="relative min-h-85 overflow-hidden rounded-lg">
            <img
              alt="Suite de hotel con ventanal y jardín"
              className="absolute inset-0 h-full w-full object-cover"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-primary/45" />
            <div className="relative flex min-h-85 max-w-xl flex-col justify-center p-8 text-on-primary md:p-12">
              <h2 className="text-3xl font-bold">Excelencia en cada reserva</h2>
              <p className="mt-4 leading-7">
                Te damos herramientas claras para que cada propiedad mantenga su
                disponibilidad, tarifas y comunicación bajo control.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
