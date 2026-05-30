import { FaHeart, FaRegHeart } from 'react-icons/fa'

export default function FavoriteButton({
  className = '',
  isFavorite,
  isLoading,
  label,
  onToggle,
}) {
  const Icon = isFavorite ? FaHeart : FaRegHeart
  const buttonLabel =
    label || (isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos')

  // Evita la navegación de la tarjeta y cambia el favorito
  function handleClick(event) {
    event.preventDefault()
    event.stopPropagation()
    onToggle?.()
  }

  return (
    <button
      aria-pressed={isFavorite}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm font-semibold text-primary shadow-sm transition hover:border-primary hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      disabled={isLoading}
      onClick={handleClick}
      title={buttonLabel}
      type="button"
    >
      <Icon className={isFavorite ? 'h-4 w-4 text-error' : 'h-4 w-4'} />
      {label && <span>{buttonLabel}</span>}
    </button>
  )
}
