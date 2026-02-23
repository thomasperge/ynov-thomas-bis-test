/**
 * Rayon de la Terre en kilomètres (approximation).
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Convertit des degrés en radians.
 */
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Calcule la distance en kilomètres entre deux points GPS (formule de Haversine).
 * @param lat1 Latitude du premier point (degrés)
 * @param lon1 Longitude du premier point (degrés)
 * @param lat2 Latitude du second point (degrés)
 * @param lon2 Longitude du second point (degrés)
 * @returns Distance en kilomètres
 */
export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}
