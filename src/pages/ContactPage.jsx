import { useMemo, useState } from 'react'
import { FaEnvelope, FaExternalLinkAlt } from 'react-icons/fa'
import Layout from '../components/Layout'

const contactEmail = 'berkanraimov@gmail.com'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: '',
    message: '',
    name: '',
    subject: '',
  })

  // Prepara el enlace de correo con los datos del formulario
  const mailtoHref = useMemo(() => {
    const subject = formData.subject || 'Consulta sobre Dream Rooms'
    const body = [
      formData.name && `Nombre: ${formData.name}`,
      formData.email && `Email: ${formData.email}`,
      '',
      formData.message,
    ]
      .filter((line) => line !== false)
      .join('\n')

    return `mailto:${contactEmail}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }, [formData])

  // Actualiza el valor de un campo del formulario
  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  return (
    <Layout>
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold text-primary">Contáctanos</h1>
            <p className="mt-4 text-lg leading-8 text-on-surface-variant">
              Escríbenos si necesitas ayuda con tu cuenta, una reserva o la
              gestión de un alojamiento.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_18px_44px_rgba(19,27,46,0.08)] md:p-8">
            <div className="space-y-6">
              <Field
                label="Nombre completo"
                name="name"
                onChange={handleChange}
                placeholder="Tu nombre"
                value={formData.name}
              />
              <Field
                label="Correo electrónico"
                name="email"
                onChange={handleChange}
                placeholder="ejemplo@empresa.com"
                type="email"
                value={formData.email}
              />
              <Field
                label="Asunto"
                name="subject"
                onChange={handleChange}
                placeholder="¿En qué podemos ayudarte?"
                value={formData.subject}
              />
              <label className="block">
                <span className="text-sm font-semibold text-primary">
                  Mensaje
                </span>
                <textarea
                  className="mt-2 min-h-40 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15"
                  name="message"
                  onChange={handleChange}
                  placeholder="Escribe tu consulta aquí..."
                  value={formData.message}
                />
              </label>
              <a
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 py-4 font-semibold text-on-primary transition hover:opacity-85"
                href={mailtoHref}
              >
                Enviar mensaje <FaExternalLinkAlt className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="mx-auto mt-10 max-w-md">
            <ContactCard
              icon={FaEnvelope}
              label="Email"
              value={contactEmail}
              href={`mailto:${contactEmail}`}
            />
          </div>
        </div>
      </section>
    </Layout>
  )
}

function Field({ label, name, onChange, placeholder, type = 'text', value }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-primary">{label}</span>
      <input
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-on-surface outline-none transition placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  )
}

function ContactCard({ href, icon: Icon, label, value }) {
  const content = (
    <>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary">
        <Icon className="h-5 w-5" />
      </span>
      <span className="mt-4 block text-sm font-bold text-primary">{label}</span>
      <span className="mt-1 block leading-6 text-on-surface-variant">
        {value}
      </span>
    </>
  )

  if (href) {
    return (
      <a
        className="block rounded-lg border border-outline-variant bg-surface-container-low p-7 text-center transition hover:border-primary"
        href={href}
      >
        {content}
      </a>
    )
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-low p-7 text-center">
      {content}
    </div>
  )
}
