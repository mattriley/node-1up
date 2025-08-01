const { DateTime } = require('luxon');

module.exports = () => ({ exif, timezone, dateField = 'DateTimeOriginal' }) => {

    const exifDate = exif[dateField];
    if (!exifDate) throw new Error(`${dateField} not found`);

    let [date, time] = exifDate.split(' ');
    date = date.replaceAll(':', '-');
    let iso = [date, time].join('T');
    // if (!timezone) return { iso };

    const parserArgs = {
        zone: timezone,
        setZone: true,
        includeOffset: Boolean(timezone)
    };

    const dt = DateTime.fromISO(iso, parserArgs);
    if (!dt.isValid) return { error: dt.invalidExplanation, iso, parserArgs }

    iso = dt.toISO({ suppressMilliseconds: true });
    return { iso, timezone, parserArgs };

};

