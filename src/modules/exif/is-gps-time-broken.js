module.exports = () => ({ exif }) => {

    if (!exif?.GPSDateStamp || !exif?.GPSTimeStamp) { return false; }
    if (!exif.DateTimeOriginal) { return false; }

    // Parse GPS UTC time (trusted)
    // Allow fractional seconds in GPSTimeStamp (e.g., 08:30:00.000)
    const gpsDateTime = new Date(`${exif.GPSDateStamp}T${exif.GPSTimeStamp}Z`);
    if (Number.isNaN(gpsDateTime.getTime())) { return false; }

    // Parse DateTimeOriginal as a timezone-agnostic *wall clock* (EXIF is local without TZ)
    // Accept common EXIF formats like "YYYY:MM:DD HH:MM:SS" and ISO-like "YYYY-MM-DDTHH:MM:SS"
    const m = String(exif.DateTimeOriginal).match(
        /(\d{4})[:\-](\d{2})[:\-](\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?/
    );
    if (!m) { return false; }

    const year = Number(m[1]);
    const month = Number(m[2]);     // 1-12
    const day = Number(m[3]);
    const hour = Number(m[4]);
    const minute = Number(m[5]);
    const second = Number(m[6] || 0);

    // Treat wall clock as if it were UTC to compute a neutral, environment-independent timestamp
    const localWallUtcMs = Date.UTC(year, month - 1, day, hour, minute, second);
    const gpsUtcMs = gpsDateTime.getTime();

    // Determine UTC offset from EXIF (in minutes)
    let expectedOffset = null;
    if (exif.OffsetTimeOriginal) {
        const om = String(exif.OffsetTimeOriginal).match(/([+-])(\d{2}):(\d{2})/);
        if (om) {
            const sign = om[1] === '-' ? -1 : 1;
            const hh = Number(om[2]);
            const mm = Number(om[3]);
            expectedOffset = sign * (hh * 60 + mm);
        }
    }

    // Compute the actual offset (local wall clock vs GPS UTC), in minutes
    const actualOffset = Math.round((localWallUtcMs - gpsUtcMs) / 60000);

    // Consider it broken if the offset tag exists but doesn't match reality (allow 5 min drift)
    return expectedOffset !== null &&
        Math.abs(actualOffset - expectedOffset) > 5;

};
