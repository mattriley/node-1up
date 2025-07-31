const { DateTime } = require('luxon');

const DATE_FIELD = 'GPSDateStamp';
const TIME_FIELD = 'GPSTimeStamp';

module.exports = ({ }) => ({ exif, timezone }) => {
    let gpsDate = exif[DATE_FIELD];
    if (!gpsDate) throw new Error(`${DATE_FIELD} not found`);

    const gpsTime = exif[TIME_FIELD];
    if (!gpsTime) throw new Error(`${TIME_FIELD} not found`);

    // Normalize date string (EXIF format: "YYYY:MM:DD")
    gpsDate = gpsDate.replaceAll(':', '-');

    // Convert time array to HH:MM:SS
    const [h = 0, m = 0, s = 0] = gpsTime.map(Math.floor);
    const gpsTimeStr = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');

    // Always treat GPS time as UTC
    const fullIso = `${gpsDate}T${gpsTimeStr}`;
    const dt = DateTime.fromISO(fullIso, { zone: 'utc' });
    if (!dt.isValid) return;

    // Convert to requested timezone if provided
    const final = timezone ? dt.setZone(timezone) : dt;
    return final.toISO({ suppressMilliseconds: true });
};



// const { DateTime } = require('luxon');

// const DATE_FIELD = 'GPSDateStamp';
// const TIME_FIELD = 'GPSTimeStamp';

// module.exports = ({ here }) => ({ exif, timezone, }) => {

//     let gpsDate = exif[DATE_FIELD];
//     if (!gpsDate) throw new Error(`${DATE_FIELD} not found`);

//     const gpsTime = exif[TIME_FIELD];
//     if (!gpsTime) throw new Error(`${TIME_FIELD} not found`);

//     // Normalize date string (from EXIF format: "YYYY:MM:DD")
//     gpsDate = gpsDate.replaceAll(':', '-');

//     // Parse time array into HH:MM:SS string
//     const [h = 0, m = 0, s = 0] = gpsTime.map(Math.floor);
//     const gpsTimeStr = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');

//     // Determine if GPS time is in local time instead of UTC
//     const isLocal = here.isGpsTimeActuallyLocal({ exif });

//     const fullIso = `${gpsDate}T${gpsTimeStr}`;
//     const baseZone = isLocal
//         ? timezone || 'local'
//         : 'utc';

//     // Parse the datetime assuming baseZone
//     const dt = DateTime.fromISO(fullIso, { zone: baseZone });
//     if (!dt.isValid) return;

//     // Convert to desired timezone (or keep as is if local)
//     const final = timezone ? dt.setZone(timezone) : dt;
//     return final.toISO({ suppressMilliseconds: true });
// };
