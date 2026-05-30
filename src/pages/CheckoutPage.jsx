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
import { getRoomTypeAvailability } from '../services/roomTypeService'
import { getBookingAmounts } from '../utils/bookingUtils'
import { formatDate, getIsoDate, getNights } from '../utils/dateUtils'
import { formatPrice } from '../utils/formatPrice'
import { pluralize } from '../utils/textUtils'

const initialCustomerData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  notes: '',
}

function getStayDates(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return []
  }

  const startDate = new Date(`${checkIn}T00:00:00Z`)
  const endDate = new Date(`${checkOut}T00:00:00Z`)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return []
  }

  if (endDate <= startDate) {
    return []
  }

  const dates = []
  const currentDate = new Date(startDate)

  while (currentDate < endDate) {
    dates.push(currentDate.toISOString().slice(0, 10))
    currentDate.setUTCDate(currentDate.getUTCDate() + 1)
  }

  return dates
}

function getAvailabilityIssue(dayAvailability, nights, unitsBooked) {
  if (!dayAvailability) {
    return 'Sin disponibilidad cargada'
  }

  if (dayAvailability.status !== 'open') {
    return 'Cerrado'
  }

  if (Number(dayAvailability.available_units) < unitsBooked) {
    return 'Sin unidades suficientes'
  }

  if ((Number(dayAvailability.min_stay_nights) || 0) > nights) {
    return `Mínimo ${dayAvailability.min_stay_nights} noches`
  }

  return ''
}

function getAvailabilitySummary(availabilityDays, stayDates, nights, unitsBooked) {
  const availabilityByDate = new Map(
    availabilityDays.map((dayAvailability) => [
      dayAvailability.date,
      dayAvailability,
    ]),
  )
  const checkedNights = stayDates.map((date) => {
    const dayAvailability = availabilityByDate.get(date)

    return {
      date,
      availability: dayAvailability,
      issue: getAvailabilityIssue(dayAvailability, nights, unitsBooked),
    }
  })

  return {
    checkedNights,
    isAvailable:
      checkedNights.length > 0 &&
      checkedNights.every((checkedNight) => !checkedNight.issue),
    minStayNights: Math.max(
      0,
      ...checkedNights.map((checkedNight) => {
        return Number(checkedNight.availability?.min_stay_nights) || 0
      }),
    ),
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
  const [isPaymentGatewayOpen, setIsPaymentGatewayOpen] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [availabilityCheck, setAvailabilityCheck] = useState({
    days: [],
    error: '',
    key: '',
  })
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [stayData, setStayData] = useState({
    check_in: initialCheckIn,
    check_out: initialCheckOut,
    adults_count: initialAdults,
    children_count: initialChildren,
    units_booked: 1,
  })
  const [paymentMethod, setPaymentMethod] = useState('card')
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
  const quote = getBookingAmounts(roomType, hotel, nights, unitsBooked)
  const stayDates = getStayDates(stayData.check_in, stayData.check_out)
  const availabilityKey = roomType
    ? `${roomType.id}-${stayData.check_in}-${stayData.check_out}`
    : ''
  const availabilityDays =
    availabilityCheck.key === availabilityKey ? availabilityCheck.days : []
  const availabilityError =
    availabilityCheck.key === availabilityKey ? availabilityCheck.error : ''
  const availabilitySummary = getAvailabilitySummary(
    availabilityDays,
    stayDates,
    nights,
    unitsBooked,
  )
  const shouldBlockReservation =
    stayDates.length > 0 &&
    !isAvailabilityLoading &&
    !availabilityError &&
    availabilityCheck.key === availabilityKey &&
    !availabilitySummary.isAvailable

  useEffect(() => {
    if (!roomType?.id || stayDates.length === 0) {
      return undefined
    }

    let shouldIgnoreResponse = false

    Promise.resolve()
      .then(() => {
        if (shouldIgnoreResponse) {
          return []
        }

        setIsAvailabilityLoading(true)

        return getRoomTypeAvailability(roomType.id, {
          from: stayData.check_in,
          to: stayData.check_out,
        })
      })
      .then((days) => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityCheck({
          days,
          error: '',
          key: availabilityKey,
        })
      })
      .catch(() => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityCheck({
          days: [],
          error: 'No se pudo comprobar la disponibilidad para esas fechas.',
          key: availabilityKey,
        })
      })
      .finally(() => {
        if (!shouldIgnoreResponse) {
          setIsAvailabilityLoading(false)
        }
      })

    return () => {
      shouldIgnoreResponse = true
    }
  }, [
    availabilityKey,
    roomType?.id,
    stayData.check_in,
    stayData.check_out,
    stayDates.length,
  ])

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

  function validateBookingData() {
    if (!roomType) {
      throw new Error('Selecciona un tipo de habitación válido.')
    }

    if (nights <= 0) {
      throw new Error('Selecciona fechas válidas para confirmar la reserva.')
    }

    if (isAvailabilityLoading) {
      throw new Error('Espera a que termine la comprobación de disponibilidad.')
    }

    if (availabilityError) {
      throw new Error(availabilityError)
    }

    if (shouldBlockReservation) {
      throw new Error(
        'La habitación no está disponible para todas las noches seleccionadas.',
      )
    }
  }

  function buildBookingPayload(selectedPaymentMethod) {
    return {
      room_type_id: roomType.id,
      check_in: getIsoDate(stayData.check_in),
      check_out: getIsoDate(stayData.check_out),
      adults_count: Number(stayData.adults_count),
      children_count: Number(stayData.children_count),
      units_booked: Number(stayData.units_booked),
      payment_method: selectedPaymentMethod,
      customer_name: customerData.name,
      customer_email: customerData.email,
      customer_phone: customerData.phone,
      notes: customerData.notes,
      guests: [
        {
          full_name: customerData.name,
          is_primary: true,
        },
      ],
    }
  }

  async function submitBooking(selectedPaymentMethod) {
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

    const createdBooking = await createCustomerBooking(
      buildBookingPayload(selectedPaymentMethod),
    )

    setBooking(createdBooking)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    setBooking(null)

    try {
      validateBookingData()

      if (paymentMethod === 'card') {
        setIsPaymentGatewayOpen(true)
        return
      }

      setIsSubmitting(true)
      await submitBooking('hotel')
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGatewayPayment() {
    setIsProcessingPayment(true)
    setSubmitError('')

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900)
      })
      await submitBooking('card')
      setIsPaymentGatewayOpen(false)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsProcessingPayment(false)
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

              <Availability
                checkedNights={availabilitySummary.checkedNights}
                error={availabilityError}
                isAvailable={availabilitySummary.isAvailable}
                isLoading={isAvailabilityLoading}
                stayDates={stayDates}
                unitsBooked={unitsBooked}
              />
            </section>

            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-secondary">
                  Paso 2
                </p>
                <h2 className="mt-1 text-2xl font-bold text-on-surface">
                  Forma de pago
                </h2>
                <p className="mt-2 text-secondary">
                  Elige cómo quieres confirmar la reserva.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <PaymentMethodOption
                  checked={paymentMethod === 'card'}
                  description="La reserva quedará confirmada y pagada."
                  label="Tarjeta"
                  name="payment_method"
                  onChange={() => setPaymentMethod('card')}
                  value="card"
                />
                <PaymentMethodOption
                  checked={paymentMethod === 'hotel'}
                  description="Pagarás directamente en el hotel. La reserva quedará pendiente."
                  label="Pagar en el hotel"
                  name="payment_method"
                  onChange={() => setPaymentMethod('hotel')}
                  value="hotel"
                />
              </div>
            </section>

            <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(19,27,46,0.08)]">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-secondary">
                    Paso 3
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
                  {booking.payment_method === 'card' ||
                  booking.payment_status === 'paid'
                    ? 'Reserva confirmada y pagada.'
                    : 'Reserva pendiente de confirmación/pago en hotel.'}{' '}
                  Referencia: {booking.booking_reference || booking.id}
                </div>
              )}
            </section>
          </div>

          <Quote
            currencySymbol={currencySymbol}
            hotel={hotel}
            isAvailabilityLoading={isAvailabilityLoading}
            isSubmitting={isSubmitting}
            nights={nights}
            paymentMethod={paymentMethod}
            quote={quote}
            roomType={roomType}
            shouldBlockReservation={shouldBlockReservation}
            stayData={stayData}
          />
        </form>

        {isPaymentGatewayOpen && (
          <Book
            amount={formatPrice(quote.total, currencySymbol, {
              decimals: true,
            })}
            error={submitError}
            hotelName={hotel.name}
            isProcessing={isProcessingPayment}
            onCancel={() => {
              if (!isProcessingPayment) {
                setIsPaymentGatewayOpen(false)
              }
            }}
            onPay={handleGatewayPayment}
            roomTypeName={roomType.name}
          />
        )}
      </section>
    </Layout>
  )
}

function Availability({
  checkedNights,
  error,
  isAvailable,
  isLoading,
  stayDates,
  unitsBooked,
}) {
  if (stayDates.length === 0) {
    return (
      <div className="mt-5 rounded-lg border border-outline-variant bg-surface p-4 text-sm font-semibold text-secondary">
        Selecciona check-in y check-out para comprobar la disponibilidad diaria.
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mt-5 rounded-lg border border-outline-variant bg-surface p-4 text-sm font-semibold text-secondary">
        Comprobando disponibilidad para {stayDates.length}{' '}
        {pluralize(stayDates.length, 'noche', 'noches')}...
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-5 rounded-lg border border-error bg-error-container p-4 text-sm font-semibold text-error">
        {error}
      </div>
    )
  }

  return (
    <div
      className={`mt-5 rounded-lg border p-4 ${
        isAvailable
          ? 'border-[#A7F3D0] bg-[#ECFDF5]'
          : 'border-error bg-error-container'
      }`}
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div>
          <p
            className={`text-base font-bold ${
              isAvailable ? 'text-[#047857]' : 'text-error'
            }`}
          >
            {isAvailable
              ? 'Disponible para las fechas seleccionadas'
              : 'No disponible para toda la estancia'}
          </p>
          <p className="mt-1 text-sm font-semibold text-secondary">
            Se comprueban las noches del {formatDate(stayDates[0])} al{' '}
            {formatDate(stayDates[stayDates.length - 1])}. El día de salida no
            cuenta como noche.
          </p>
        </div>
        <span
          className={`w-fit whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
            isAvailable
              ? 'bg-[#D1FAE5] text-[#047857]'
              : 'bg-error text-on-primary'
          }`}
        >
          {checkedNights.length} {pluralize(checkedNights.length, 'noche', 'noches')} ·{' '}
          {unitsBooked} {pluralize(unitsBooked, 'habitación', 'habitaciones')}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {checkedNights.map((checkedNight) => (
          <div
            className="grid grid-cols-1 gap-2 rounded-lg bg-surface-container-lowest px-3 py-2 text-sm sm:grid-cols-[1fr_auto] sm:items-center"
            key={checkedNight.date}
          >
            <div>
              <p className="font-semibold text-on-surface">
                Noche del {formatDate(checkedNight.date)}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-secondary">
                {checkedNight.availability
                  ? `${checkedNight.availability.available_units || 0} habitaciones libres`
                  : 'No existe disponibilidad para esa noche'}
              </p>
              {checkedNight.date === stayDates[0] &&
                checkedNight.availability?.min_stay_nights && (
                  <p className="mt-1 text-xs font-bold text-secondary">
                    Mínimo desde check-in:{' '}
                    {checkedNight.availability.min_stay_nights}{' '}
                    {pluralize(
                      Number(checkedNight.availability.min_stay_nights),
                      'noche',
                      'noches',
                    )}
                  </p>
                )}
            </div>
            <span
              className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${
                checkedNight.issue
                  ? 'bg-error-container text-error'
                  : 'bg-[#D1FAE5] text-[#047857]'
              }`}
            >
              {checkedNight.issue || 'Disponible'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Quote({
  currencySymbol,
  hotel,
  isAvailabilityLoading,
  isSubmitting,
  nights,
  paymentMethod,
  quote,
  roomType,
  shouldBlockReservation,
  stayData,
}) {
  return (
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
          <p className="text-sm font-semibold text-secondary">{hotel.name}</p>
          <h2 className="mt-1 text-2xl font-bold text-on-surface">
            {roomType.name}
          </h2>
        </div>

        <div className="space-y-3 border-y border-outline-variant py-5 text-sm">
          <SummaryRow label="Check-in" value={formatDate(stayData.check_in)} />
          <SummaryRow label="Check-out" value={formatDate(stayData.check_out)} />
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
            value={formatPrice(quote.subtotal, currencySymbol, {
              decimals: true,
            })}
          />
          {quote.discount > 0 && (
            <SummaryRow
              label={`Descuento (${quote.discountRate}%)`}
              value={`-${formatPrice(quote.discount, currencySymbol, {
                decimals: true,
              })}`}
            />
          )}
          <SummaryRow
            label={`Tasas (${quote.taxRate}%)`}
            value={formatPrice(quote.taxes, currencySymbol, {
              decimals: true,
            })}
          />
        </div>

        <div className="flex items-end justify-between gap-4">
          <span className="text-lg font-bold text-primary">Total</span>
          <span className="text-3xl font-bold text-primary">
            {formatPrice(quote.total, currencySymbol, {
              decimals: true,
            })}
          </span>
        </div>

        <p className="rounded-lg bg-surface-container p-3 text-xs font-semibold text-secondary">
          Total estimado con las tasas y descuentos configurados por el hotel
        </p>

        <button
          className="h-12 w-full cursor-pointer rounded-lg bg-primary px-4 font-semibold text-on-primary shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting || isAvailabilityLoading || shouldBlockReservation}
          type="submit"
        >
          {isSubmitting
            ? 'Confirmando reserva...'
            : isAvailabilityLoading
              ? 'Comprobando disponibilidad...'
              : paymentMethod === 'card'
                ? 'Ir al pago'
                : 'Confirmar reserva'}
        </button>

        <p className="text-center text-xs font-semibold text-secondary">
          {paymentMethod === 'card'
            ? 'Pago con tarjeta: confirmación inmediata'
            : 'Pago en hotel: la reserva queda pendiente'}
        </p>
      </div>
    </aside>
  )
}

function PaymentMethodOption({
  checked,
  description,
  label,
  name,
  onChange,
  value,
}) {
  return (
    <label
      className={`cursor-pointer rounded-xl border p-4 transition ${
        checked
          ? 'border-primary bg-secondary-container'
          : 'border-outline-variant bg-surface hover:border-primary'
      }`}
    >
      <span className="flex items-start gap-3">
        <input
          checked={checked}
          className="mt-1 h-4 w-4 accent-primary"
          name={name}
          onChange={onChange}
          type="radio"
          value={value}
        />
        <span>
          <span className="block font-bold text-on-surface">{label}</span>
          <span className="mt-1 block text-sm text-secondary">
            {description}
          </span>
        </span>
      </span>
    </label>
  )
}

function Book({
  amount,
  error,
  hotelName,
  isProcessing,
  onCancel,
  onPay,
  roomTypeName,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/45 px-5 py-8 backdrop-blur-sm">
      <section className="w-full max-w-md overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-[0_24px_70px_rgba(19,27,46,0.25)]">
        <div className="border-b border-outline-variant bg-surface-container p-5">
          <p className="text-sm font-bold uppercase tracking-wider text-secondary">
            Pasarela segura
          </p>
          <h2 className="mt-1 text-2xl font-bold text-on-surface">
            Pago con tarjeta
          </h2>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-lg border border-outline-variant bg-surface p-4">
            <p className="text-sm font-semibold text-secondary">{hotelName}</p>
            <p className="mt-1 font-bold text-on-surface">{roomTypeName}</p>
            <div className="mt-4 flex items-end justify-between gap-4 border-t border-outline-variant pt-4">
              <span className="text-sm font-bold uppercase tracking-wider text-secondary">
                Total a pagar
              </span>
              <span className="text-3xl font-bold text-primary">{amount}</span>
            </div>
          </div>

          <div className="rounded-lg bg-secondary-container p-4 text-sm font-semibold text-on-secondary-fixed">
            El sistema
            marcará la reserva como pagada al confirmar.
          </div>

          {error && (
            <p className="rounded-lg border border-error bg-error-container p-3 text-sm font-semibold text-error">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              className="h-11 rounded-lg border border-outline-variant px-4 text-sm font-semibold text-secondary transition hover:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isProcessing}
              onClick={onCancel}
              type="button"
            >
              Volver
            </button>
            <button
              className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-on-primary shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isProcessing}
              onClick={onPay}
              type="button"
            >
              {isProcessing ? 'Procesando pago...' : `Pagar ${amount}`}
            </button>
          </div>
        </div>
      </section>
    </div>
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
