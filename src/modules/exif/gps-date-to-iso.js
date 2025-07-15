const { DateTime } = require('luxon');

module.exports = ({ here }) => ({ exif, timezone, dateField = 'GPSDateStamp', timeField = 'GPSTimeStamp' }) => {

    let gpsDate = exif[dateField];
    if (!gpsDate) throw new Error(`EXIF date field not found: ${dateField}`);

    const gpsTime = exif[timeField];
    if (!gpsTime) throw new Error(`EXIF time field not found: ${timeField}`);

    // Normalize date string (from EXIF format: "YYYY:MM:DD")
    gpsDate = gpsDate.replaceAll(':', '-');

    // Parse time array into HH:MM:SS string
    const [h = 0, m = 0, s = 0] = gpsTime.map(Math.floor);
    const gpsTimeStr = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');

    // Determine if GPS time is in local time instead of UTC
    const isLocal = here.isGpsTimeActuallyLocal()(exif);

    const fullIso = `${gpsDate}T${gpsTimeStr}`;
    const baseZone = isLocal
        ? timezone || 'local'
        : 'utc';

    // Parse the datetime assuming baseZone
    const dt = DateTime.fromISO(fullIso, { zone: baseZone });
    if (!dt.isValid) return;

    // Convert to desired timezone (or keep as is if local)
    const final = timezone ? dt.setZone(timezone) : dt;
    return final.toISO({ suppressMilliseconds: true });
};
