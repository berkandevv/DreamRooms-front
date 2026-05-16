import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import Layout from '../components/Layout'
import {
  getAuthenticatedUser,
  getAuthToken,
  registerUser,
  setAuthenticatedUser,
} from '../services/authService'
import { createCustomerBooking } from '../services/customerBookingService'
import { getHotelBySlug } from '../services/hotelService'
import { formatPrice } from '../utils/formatPrice'

const initialCustomerData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  notes: '',
}

function getNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0
  }

  const startDate = new Date(`${checkIn}T00:00:00Z`)
  const endDate = new Date(`${checkOut}T00:00:00Z`)
  const difference = endDate.getTime() - startDate.getTime()

  if (Number.isNaN(difference) || difference <= 0) {
    return 0
  }

  return Math.ceil(difference / 86400000)
}

function pluralize(count, singular, plural) {
  return Number(count) === 1 ? singular : plural
}

function getIsoDate(date) {
  if (!date) {
    return ''
  }

  return new Date(`${date}T00:00:00Z`).toISOString()
}

function getBookingAmounts(roomType, hotel, nights, unitsBooked) {
  const basePrice = Number(roomType?.base_price)
  const taxRate = Number(hotel?.pricing?.tax_rate_percent) || 0
  const discountRate = Number(hotel?.pricing?.discount_rate_percent) || 0

  if (!basePrice || !nights) {
    return {
      discount: 0,
      discountRate,
      subtotal: 0,
      taxes: 0,
      taxRate,
      total: 0,
    }
  }

  const subtotal = basePrice * nights * unitsBooked
  const discount = subtotal * (discountRate / 100)
  const taxableAmount = subtotal - discount
  const taxes = taxableAmount * (taxRate / 100)
  const total = taxableAmount + taxes

  return {
    discount,
    discountRate,
    subtotal,
    taxes,
    taxRate,
    total,
  }
}

export default function CheckoutPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const roomTypeId = Number(searchParams.get('room_type_id'))
  const initialCheckIn = searchParams.get('check_in') || ''
  const initialCheckOut = searchParams.get('check_out') || ''
  const initialAdults = Number(searchParams.get('adults')) || 1
  const initialChildren = Number(searchParams.get('children')) || 0
  const isAuthenticated = Boolean(getAuthToken())
  const authenticatedUser = getAuthenticatedUser()

  const [hotel, setHotel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [booking, setBooking] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [stayData, setStayData] = useState({
    check_in: initialCheckIn,
    check_out: initialCheckOut,
    adults_count: initialAdults,
    children_count: initialChildren,
    units_booked: 1,
  })
  const [customerData, setCustomerData] = useState({
    ...initialCustomerData,
    name: authenticatedUser?.name || '',
    email: authenticatedUser?.email || '',
  })

  useEffect(() => {
    getHotelBySlug(slug)
      .then((data) => {
        setHotel(data)
        setLoadError('')
      })
      .catch(() => {
        setLoadError('No se pudo cargar la información del hotel.')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [slug])

  const roomType = useMemo(() => {
    return hotel?.room_types?.find((item) => Number(item.id) === roomTypeId)
  }, [hotel, roomTypeId])
  const nights = getNights(stayData.check_in, stayData.check_out)
  const unitsBooked = Number(stayData.units_booked) || 1
  const currencySymbol =
    hotel?.pricing?.currency_symbol || hotel?.currency_symbol || '€'
  const amounts = getBookingAmounts(roomType, hotel, nights, unitsBooked)

  function handleStayChange(event) {
    const { name, value } = event.target

    setStayData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleCustomerChange(event) {
    const { name, value } = event.target

    setCustomerData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setBooking(null)

    try {
      if (!roomType) {
        throw new Error('Selecciona un tipo de habitación válido.')
      }

      if (nights <= 0) {
        throw new Error('Selecciona fechas válidas para confirmar la reserva.')
      }

      if (!isAuthenticated) {
        await registerUser({
          name: customerData.name,
          email: customerData.email,
          phone: customerData.phone,
          password: customerData.password,
          password_confirmation: customerData.password_confirmation,
          account_type: 'customer',
        })
      }

      if (customerData.name || customerData.email) {
        setAuthenticatedUser({
          email: customerData.email,
          name: customerData.name,
        })
      }

      const createdBooking = await createCustomerBooking({
        room_type_id: roomType.id,
        check_in: getIsoDate(stayData.check_in),
        check_out: getIsoDate(stayData.check_out),
        adults_count: Number(stayData.adults_count),
        children_count: Number(stayData.children_count),
        units_booked: Number(stayData.units_booked),
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        notes: customerData.notes,
        guests: [],
      })

      setBooking(createdBooking)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <p className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 text-center text-secondary">
            Cargando checkout...
          </p>
        </section>
      </Layout>
    )
  }

  if (loadError || !hotel || !roomType) {
    return (
      <Layout>
        <section className="mx-auto max-w-7xl px-5 py-12 md:px-8">
          <div className="rounded-xl border border-error bg-error-container p-6 text-center text-error">
            <p>{loadError || 'No se pudo encontrar la habitación seleccionada.'}</p>
            <Link
              className="mt-4 inline-block font-semibold underline"
              to={`/hotels/${slug}`}
            >
              Volver al hotel
            </Link>
          </div>
        </section>
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-5 py-8 md:px-8">
        <Link
          className="inline-block text-sm font-semibold text-secondary hover:text-primary"
          to={`/hotels/${slug}`}
        >
          ← Volver al hotel
        </Link>

        <form
          className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]"
          onSubmit={handleSubmit}
        >
          <div className="space-y-6">
            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-secondary">
                  Paso 1
                </p>
                <h1 className="mt-1 text-3xl font-bold text-on-surface">
                  Confirmar estancia
                </h1>
                <p className="mt-2 text-secondary">
                  Revisa fechas, ocupación y habitaciones antes de crear la
                  reserva
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Check-in"
                  name="check_in"
                  onChange={handleStayChange}
                  required
                  type="date"
                  value={stayData.check_in}
                />
                <FormField
                  label="Check-out"
                  name="check_out"
                  onChange={handleStayChange}
                  required
                  type="date"
                  value={stayData.check_out}
                />
                <FormField
                  label="Adultos"
                  min="1"
                  name="adults_count"
                  onChange={handleStayChange}
                  required
                  type="number"
                  value={stayData.adults_count}
                />
                <FormField
                  label="Niños"
                  min="0"
                  name="children_count"
                  onChange={handleStayChange}
                  required
                  type="number"
                  value={stayData.children_count}
                />
                <FormField
                  label="Habitaciones"
                  min="1"
                  name="units_booked"
                  onChange={handleStayChange}
                  required
                  type="number"
                  value={stayData.units_booked}
                />
              </div>

              <div className="mt-5 rounded-lg bg-surface-container p-4 text-sm font-semibold text-secondary">
                Duración total: {nights || 0}{' '}
                {pluralize(nights, 'noche', 'noches')}
              </div>
            </section>

            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-secondary">
                    Paso 2
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-on-surface">
                    Datos del cliente
                  </h2>
                  <p className="mt-2 text-secondary">
                    {isAuthenticated
                      ? 'Usaremos tu sesión actual para asignar la reserva'
                      : 'Crea tu cuenta de cliente para confirmar la reserva'}
                  </p>
                </div>
                <span className="w-fit whitespace-nowrap rounded-full bg-secondary-container px-3 py-1 text-xs font-bold uppercase text-on-secondary-fixed">
                  {isAuthenticated ? 'Sesión activa' : 'Registro requerido'}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Nombre completo"
                  name="name"
                  onChange={handleCustomerChange}
                  required
                  value={customerData.name}
                />
                <FormField
                  label="Email"
                  name="email"
                  onChange={handleCustomerChange}
                  required
                  type="email"
                  value={customerData.email}
                />
                <FormField
                  label="Teléfono"
                  name="phone"
                  onChange={handleCustomerChange}
                  required
                  type="tel"
                  value={customerData.phone}
                />

                {!isAuthenticated && (
                  <>
                    <FormField
                      label="Contraseña"
                      name="password"
                      onChange={handleCustomerChange}
                      required
                      type="password"
                      value={customerData.password}
                    />
                    <FormField
                      label="Confirmar contraseña"
                      name="password_confirmation"
                      onChange={handleCustomerChange}
                      required
                      type="password"
                      value={customerData.password_confirmation}
                    />
                  </>
                )}

                <label className="md:col-span-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                    Peticiones especiales
                  </span>
                  <textarea
                    className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    name="notes"
                    onChange={handleCustomerChange}
                    placeholder="Llegada tarde, cama extra, alergias..."
                    rows="4"
                    value={customerData.notes}
                  />
                </label>
              </div>

              {submitError && (
                <p className="mt-5 rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
                  {submitError}
                </p>
              )}

              {booking && (
                <div className="mt-5 rounded-lg border border-outline-variant bg-secondary-container p-4 text-sm font-semibold text-on-secondary-fixed">
                  Reserva creada correctamente. Referencia:{' '}
                  {booking.booking_reference || booking.id}
                </div>
              )}
            </section>
          </div>

          <aside className="h-fit overflow-hidden rounded-xl border border-outline-variant bg-surface-container-highest shadow-[0_8px_24px_rgba(19,27,46,0.10)] lg:sticky lg:top-24">
            {roomType.cover_image?.url && (
              <div className="h-44 overflow-hidden">
                <img
                  alt={roomType.cover_image?.alt_text || roomType.name}
                  className="h-full w-full object-cover"
                  src={roomType.cover_image.url}
                />
              </div>
            )}
            <div className="space-y-5 p-6">
              <div>
                <p className="text-sm font-semibold text-secondary">
                  {hotel.name}
                </p>
                <h2 className="mt-1 text-2xl font-bold text-on-surface">
                  {roomType.name}
                </h2>
              </div>

              <div className="space-y-3 border-y border-outline-variant py-5 text-sm">
                <SummaryRow label="Check-in" value={stayData.check_in || '-'} />
                <SummaryRow label="Check-out" value={stayData.check_out || '-'} />
                <SummaryRow label="Noches" value={nights || '-'} />
                <SummaryRow
                  label="Ocupación"
                  value={`${stayData.adults_count} adultos, ${stayData.children_count} niños`}
                />
                <SummaryRow label="Habitaciones" value={stayData.units_booked} />
                <SummaryRow
                  label="Precio base"
                  value={`${formatPrice(roomType.base_price, currencySymbol, {
                    decimals: true,
                  })}/noche`}
                />
                <SummaryRow
                  label="Subtotal"
                  value={formatPrice(amounts.subtotal, currencySymbol, {
                    decimals: true,
                  })}
                />
                {amounts.discount > 0 && (
                  <SummaryRow
                    label={`Descuento (${amounts.discountRate}%)`}
                    value={`-${formatPrice(amounts.discount, currencySymbol, {
                      decimals: true,
                    })}`}
                  />
                )}
                <SummaryRow
                  label={`Tasas (${amounts.taxRate}%)`}
                  value={formatPrice(amounts.taxes, currencySymbol, {
                    decimals: true,
                  })}
                />
              </div>

              <div className="flex items-end justify-between gap-4">
                <span className="text-lg font-bold text-primary">Total</span>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(amounts.total, currencySymbol, {
                    decimals: true,
                  })}
                </span>
              </div>

              <p className="rounded-lg bg-surface-container p-3 text-xs font-semibold text-secondary">
                Total estimado con las tasas y descuentos configurados por el
                hotel
              </p>

              <button
                className="h-12 w-full rounded-lg bg-primary px-4 font-semibold text-on-primary shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Confirmando reserva...' : 'Confirmar reserva'}
              </button>

              <p className="text-center text-xs font-semibold text-secondary">
                La reserva se crea con estado pendiente hasta su aprobación
              </p>
            </div>
          </aside>
        </form>
      </section>
    </Layout>
  )
}

function FormField({
  label,
  min,
  name,
  onChange,
  required = false,
  type = 'text',
  value,
}) {
  return (
    <label>
      <span className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      <input
        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        min={min}
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
    </label>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-semibold text-on-surface">{value}</span>
    </div>
  )
}
