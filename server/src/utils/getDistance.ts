export function getDistance(
  point1: { lng: number; lat: number },
  point2: { lng: number; lat: number },
): number {
  const earthRadius = 6371000; // ✅ mètres

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const diffLat = toRad(point2.lat - point1.lat);
  const diffLng = toRad(point2.lng - point1.lng);

  const arc =
    Math.sin(diffLat / 2) ** 2 +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(diffLng / 2) ** 2;

  const line = 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc));

  return earthRadius * line; // ✅ distance en mètres
}