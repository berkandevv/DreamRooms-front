// Modal que simula la pasarela de pago con tarjeta
export default function PaymentGatewayModal({
  amount,
  error,
  hotelName,
  isProcessing,
  onCancel,
  onPay,
  roomTypeName,
}) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-on-surface/45 px-5 py-8 backdrop-blur-sm">
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
            El sistema marcará la reserva como pagada al confirmar.
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
              {isProcessing ? "Procesando pago..." : `Pagar ${amount}`}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
