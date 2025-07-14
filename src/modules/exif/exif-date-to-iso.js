const { DateTime } = require('luxon');

module.exports = () => (exifDate, timezone) => {

    let [date, time] = exifDate.split(' ');
    date = date.replaceAll(':', '-');
    let iso = [date, time].join('T');
    if (!timezone) return iso;

    const dt = DateTime.fromISO(iso, { zone: timezone, setZone: true });
    if (!dt.isValid) return;

    return dt.toISO({ suppressMilliseconds: true });

};

