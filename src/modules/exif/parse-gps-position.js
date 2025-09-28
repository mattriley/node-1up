// gpsPositionToLatLong.js

// Expect a parseDms function like the one you just wrote:
//   parseDms('37°49′4.49″S, 145°13′46.83″E') -> { latitude: -37.818, longitude: 145.229675 }
//
// Usage:
//   const parseDms = require('./parseDms');
//   const toLatLong = require('./gpsPositionToLatLong')(parseDms);
//   const updated = toLatLong(exif, { precision: 6, overwrite: false });

module.exports = ({ geo }) => ({ exif, precision = null, overwrite = false } = {}) => {

    const pos = exif?.GPSPosition;
    if (!pos || typeof pos !== 'string') return exif;

    let lat, lon;
    try {
        const r = geo.parseDms(pos);
        lat = r.latitude;
        lon = r.longitude;
    } catch {
        // Unparseable GPSPosition → leave EXIF unchanged
        return exif;
    }

    if (precision != null) {
        const round = n => Number.isFinite(n) ? Number(n.toFixed(precision)) : n;
        lat = round(lat);
        lon = round(lon);
    }

    // Respect existing fields unless overwrite = true
    if (!overwrite && (exif.GPSLatitude != null || exif.GPSLongitude != null)) return exif;

    return {
        ...exif,
        GPSLatitude: lat,
        GPSLongitude: lon
    };
};
