const METERS_PER_DEGREE_LAT = 111320;

export function inferGenericAxisScale({ center, size }) {
  const geodetic =
    Math.abs(center.x) > 1 && Math.abs(center.x) <= 180 &&
    Math.abs(center.z) > 1 && Math.abs(center.z) <= 90 &&
    size.x > 0 && size.x < 1 && size.z > 0 && size.z < 1 &&
    size.y > 1;

  if (!geodetic) return { kind: 'cartesian', x: 1, y: 1, z: 1 };

  const latitudeRadians = Math.abs(center.z) * Math.PI / 180;
  return {
    kind: 'geodetic',
    x: METERS_PER_DEGREE_LAT * Math.cos(latitudeRadians),
    y: 1,
    z: METERS_PER_DEGREE_LAT,
  };
}
