const { DateTime } = require('luxon');

module.exports = () => (gpsDate, gpsTime, timezone) => {

    gpsDate = gpsDate.replaceAll(':', '-');
    const [h = 0, m = 0, s = 0] = gpsTime.map(Math.floor);
    gpsTime = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');

    const utcDate = DateTime.fromISO(`${gpsDate}T${gpsTime}`, { zone: 'utc' });
    if (!utcDate.isValid) return;

    const finalDate = timezone ? utcDate.setZone(timezone) : utcDate;
    return finalDate.toISO({ suppressMilliseconds: true });

};
