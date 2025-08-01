const { DateTime } = require('luxon');

module.exports = () => ({ exif, timezone, dateField = 'DateTimeOriginal' }) => {

    const exifDate = exif[dateField];
    if (!exifDate) throw new Error(`${dateField} not found`);

    let [date, time] = exifDate.split(' ');
    date = date.replaceAll(':', '-');
    let exifDateAsIso = [date, time].join('T');

    const parserArgs = {
        zone: timezone ?? 'utc',
        setZone: Boolean(timezone),
        includeOffset: Boolean(timezone)
    };

    const debug = {
        dateField,
        exifDate,
        exifDateAsIso,
        timezone,
        ...parserArgs
    };

    const dt = DateTime.fromISO(exifDateAsIso, parserArgs);
    if (!dt.isValid) return { error: dt.invalidExplanation, debug };

    iso = timezone ? dt.toISO({ suppressMilliseconds: true }) : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    return { iso, timezone, debug };

};

