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
import { getRoomTypeAvailabilityQuote } from '../services/roomTypeService'
import { getIsoDate, getStayDates } from '../utils/dateUtils'
import { formatPrice } from '../utils/formatPrice'
import { pluralize } from '../utils/textUtils'
import AvailabilityResult from './checkout/AvailabilityResult'
import CheckoutField from './checkout/CheckoutField'
import CheckoutSummary from './checkout/CheckoutSummary'
import PaymentGatewayModal from './checkout/PaymentGatewayModal'
import PaymentMethodOption from './checkout/PaymentMethodOption'
import { getPriceQuote, initialCustomerData } from './checkout/checkoutHelpers'

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
    quote: null,
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

  // Obtiene la habitación seleccionada desde la URL
  const roomType = useMemo(() => {
    return hotel?.room_types?.find((item) => Number(item.id) === roomTypeId)
  }, [hotel, roomTypeId])
  const unitsBooked = Number(stayData.units_booked) || 1
  const currencySymbol =
    hotel?.pricing?.currency_symbol || hotel?.currency_symbol || '€'
  const stayDates = getStayDates(stayData.check_in, stayData.check_out)
  const availabilityKey = roomType
    ? `${roomType.id}-${stayData.check_in}-${stayData.check_out}-${unitsBooked}`
    : ''
  const availabilityQuote =
    availabilityCheck.key === availabilityKey ? availabilityCheck.quote : null
  const availabilityError =
    availabilityCheck.key === availabilityKey ? availabilityCheck.error : ''
  const nights = availabilityQuote?.nights ?? stayDates.length
  const priceQuote = getPriceQuote(availabilityQuote, hotel)
  const isAvailabilityReady = Boolean(availabilityQuote)
  const shouldBlockReservation =
    stayDates.length > 0 &&
    !isAvailabilityLoading &&
    !availabilityError &&
    (!isAvailabilityReady || availabilityQuote?.is_available === false)

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

        return getRoomTypeAvailabilityQuote(roomType.id, {
          check_in: stayData.check_in,
          check_out: stayData.check_out,
          units_booked: unitsBooked,
        })
      })
      .then((quote) => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityCheck({
          quote,
          error: '',
          key: availabilityKey,
        })
      })
      .catch(() => {
        if (shouldIgnoreResponse) {
          return
        }

        setAvailabilityCheck({
          quote: null,
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
    unitsBooked,
  ])

  // Actualiza los datos de la estancia
  function handleStayChange(event) {
    const { name, value } = event.target

    setStayData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // Actualiza los datos personales del cliente
  function handleCustomerChange(event) {
    const { name, value } = event.target

    setCustomerData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  // Comprueba que la reserva se puede enviar
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

    if (!isAvailabilityReady) {
      throw new Error('Espera a que termine la comprobación de disponibilidad.')
    }

    if (shouldBlockReservation) {
      throw new Error(
        'La habitación no está disponible para todas las noches seleccionadas.',
      )
    }
  }

  // Prepara los datos que necesita la API de reservas
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

  // Registra al cliente si es necesario y crea la reserva
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

  // Inicia el proceso de confirmación de la reserva
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

  // Simula el pago con tarjeta y crea la reserva
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
                <CheckoutField
                  label="Check-in"
                  name="check_in"
                  onChange={handleStayChange}
                  required
                  type="date"
                  value={stayData.check_in}
                />
                <CheckoutField
                  label="Check-out"
                  name="check_out"
                  onChange={handleStayChange}
                  required
                  type="date"
                  value={stayData.check_out}
                />
                <CheckoutField
                  label="Adultos"
                  min="1"
                  name="adults_count"
                  onChange={handleStayChange}
                  required
                  type="number"
                  value={stayData.adults_count}
                />
                <CheckoutField
                  label="Niños"
                  min="0"
                  name="children_count"
                  onChange={handleStayChange}
                  required
                  type="number"
                  value={stayData.children_count}
                />
                <CheckoutField
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

              <AvailabilityResult
                error={availabilityError}
                isLoading={isAvailabilityLoading}
                quote={availabilityQuote}
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
                <CheckoutField
                  label="Nombre completo"
                  name="name"
                  onChange={handleCustomerChange}
                  required
                  value={customerData.name}
                />
                <CheckoutField
                  label="Email"
                  name="email"
                  onChange={handleCustomerChange}
                  required
                  type="email"
                  value={customerData.email}
                />
                <CheckoutField
                  label="Teléfono"
                  name="phone"
                  onChange={handleCustomerChange}
                  required
                  type="tel"
                  value={customerData.phone}
                />

                {!isAuthenticated && (
                  <>
                    <CheckoutField
                      label="Contraseña"
                      name="password"
                      onChange={handleCustomerChange}
                      required
                      type="password"
                      value={customerData.password}
                    />
                    <CheckoutField
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
                <div className="mt-5 rounded-lg border border-on-tertiary-container bg-tertiary-fixed p-4 text-on-tertiary-fixed">
                  <p className="font-bold">
                    {booking.payment_method === 'card' ||
                    booking.payment_status === 'paid'
                      ? '¡Reserva confirmada y pagada!'
                      : 'Reserva registrada, pendiente de pago en el hotel.'}
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Referencia: {booking.booking_reference || booking.id}
                  </p>
                  <Link
                    className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition hover:opacity-90"
                    to="/my-bookings"
                  >
                    Ver mis reservas
                  </Link>
                </div>
              )}
            </section>
          </div>

          <CheckoutSummary
            currencySymbol={currencySymbol}
            freeCancellationHours={
              availabilityQuote
                ? availabilityQuote.free_cancellation_hours
                : roomType.free_cancellation_hours
            }
            hotel={hotel}
            isAvailabilityLoading={isAvailabilityLoading}
            isBooked={Boolean(booking)}
            isSubmitting={isSubmitting}
            nights={nights}
            paymentMethod={paymentMethod}
            quote={priceQuote}
            roomType={roomType}
            shouldBlockReservation={shouldBlockReservation}
            stayData={stayData}
          />
        </form>

        {isPaymentGatewayOpen && (
          <PaymentGatewayModal
            amount={formatPrice(priceQuote.total, currencySymbol, {
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
