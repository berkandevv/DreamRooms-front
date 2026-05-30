export default function BrandLogo({ className = '', compact = false }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        alt="Dream Rooms"
        className={compact ? 'h-10 w-10 object-contain' : 'h-12 w-12 object-contain'}
        src="/brand/logo.png"
      />
      {!compact && (
        <span className="text-xl font-bold leading-none text-primary">
          Dream Rooms
        </span>
      )}
    </span>
  )
}
