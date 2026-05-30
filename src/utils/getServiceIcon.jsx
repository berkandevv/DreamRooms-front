import {
  FaCheck,
  FaConciergeBell,
  FaDumbbell,
  FaEye,
  FaHome,
  FaPlane,
  FaParking,
  FaShower,
  FaSnowflake,
  FaSwimmingPool,
  FaTshirt,
  FaUtensils,
  FaCocktail,
  FaWifi,
} from 'react-icons/fa'
import { MdFreeBreakfast } from "react-icons/md"

// Obtiene el icono asociado a un servicio
export function getServiceIcon(service, className) {
  const name = service.toLowerCase()

  if (name.includes('wifi') || name.includes('internet')) {
    return <FaWifi className={className} />
  }

  if (name.includes('aire') || name.includes('air conditioning') || name.includes('ac')) {
    return <FaSnowflake className={className} />
  }

  if (name.includes('aeropuerto') || name.includes('airport') || name.includes('transfer')) {
    return <FaPlane className={className} />
  }

  if (name.includes('pool') || name.includes('piscina')) {
    return <FaSwimmingPool className={className} />
  }

  if (name.includes('spa')) {
    return <FaShower className={className} />
  }

  if (name.includes('gym') || name.includes('gimnasio') || name.includes('fitness')) {
    return <FaDumbbell className={className} />
  }

  if (name.includes('parking') || name.includes('aparcamiento')) {
    return <FaParking className={className} />
  }

  if (name.includes('restaurant') || name.includes('restaurante')) {
    return <FaCocktail className={className} />
  }

  if (name.includes('recepción') || name.includes('recepcion') || name.includes('reception')) {
    return <FaConciergeBell className={className} />
  }

  if (name.includes('breakfast') || name.includes('desayuno')) {
    return <MdFreeBreakfast className={className} />
  }

  if (name.includes('kitchen') || name.includes('cocina') || name.includes('cocinita') || name.includes('kitchenette')) {
    return <FaUtensils className={className} />
  }

  if (name.includes('sea view') || name.includes('vista') || name.includes('mar')) {
    return <FaEye className={className} />
  }

  if (name.includes('balcony') || name.includes('balcón') || name.includes('balcon')) {
    return <FaHome className={className} />
  }

  if (name.includes('laundry') || name.includes('lavander')) {
    return <FaTshirt className={className} />
  }

  return <FaCheck className={className} />
}
