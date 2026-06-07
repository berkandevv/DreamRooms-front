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
      'Crea tu cuenta, busca hoteles, guarda favoritos y consulta tus reservas.',
    icon: FaRocket,
    title: 'Primeros pasos',
  },
  {
    description:
      'Comprueba fechas, revisa el importe total y cancela dentro del plazo disponible.',
    icon: FaCalendarAlt,
    title: 'Reservas de cliente',
  },
  {
    description:
      'Publica alojamientos, configura habitaciones y actualiza precios o disponibilidad.',
    icon: FaUserCog,
    title: 'Panel de propietario',
  },
  {
    description:
      'Revisa el estado de las reservas y registra pagos manuales de estancias con pago en hotel.',
    icon: FaCreditCard,
    title: 'Pagos',
  },
]

const faqs = [
  {
    answer:
      'Desde el panel de propietario, abre Inventario, elige un tipo de habitación y guarda la disponibilidad del rango de fechas. También puedes cerrar una fecha concreta.',
    question: '¿Cómo puedo actualizar la disponibilidad de mis habitaciones?',
  },
  {
    answer:
      'Antes de reservar, Dream Rooms comprueba las fechas seleccionadas y muestra el desglose de precio. Puedes elegir pago con tarjeta o pago en el hotel.',
    question: '¿Cómo se confirma una reserva?',
  },
  {
    answer:
      'En Mis reservas puedes cancelar una estancia activa mientras no haya vencido su plazo de cancelación gratuita. El plazo se muestra antes de confirmar.',
    question: '¿Cómo puedo cancelar una reserva?',
  },
  {
    answer:
      'Cuando una estancia está completada puedes dejar un comentario con tu valoración y, si quieres, una sola foto. El comentario y la foto quedan pendientes de revisión por el equipo de Dream Rooms antes de publicarse en la página del hotel.',
    question: '¿Cómo funcionan los comentarios y las fotos de las reseñas?',
  },
  {
    answer:
      'En Mi cuenta puedes cambiar tu contraseña o desactivar tu cuenta. Para cambiar la contraseña necesitas indicar la contraseña actual.',
    question: '¿Cómo gestiono la seguridad de mi cuenta?',
  },
]

const heroImage = '/images/static-pages/privacy-city.jpg'

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
            {faqs.map(({ answer, question }) => (
              <details className="group py-5" key={question}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-primary">
                  {question}
                  <FaChevronDown className="h-3 w-3 transition group-open:rotate-180" />
                </summary>
                <p className="mt-4 leading-7 text-on-surface-variant">
                  {answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg bg-surface-container p-8 text-center">
            <h3 className="text-2xl font-bold text-primary">
              ¿Aún tienes dudas?
            </h3>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-secondary">
              Escríbenos si necesitas ayuda con reservas, disponibilidad, pagos
              manuales o configuración de propiedades.
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
              alt="Vista urbana nocturna desde un hotel"
              className="absolute inset-0 h-full w-full object-cover"
              src={heroImage}
            />
            <div className="absolute inset-0 bg-primary/45" />
            <div className="relative flex min-h-85 max-w-xl flex-col justify-start px-8 pb-8 pt-5 text-on-primary md:px-12 md:pb-12 md:pt-7">
              <h2 className="text-3xl font-bold">Excelencia en cada reserva</h2>
              <p className="mt-4 leading-7">
                Te damos herramientas claras para que cada propiedad mantenga su
                disponibilidad, tarifas y reservas bajo control.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
