const { DateTime } = require('luxon');

module.exports = () => ({ exif = {}, dateField = 'DateTimeOriginal', timezone }) => {

    const exifDate = exif[dateField];
    if (!exifDate) throw new Error(`${dateField} not found`);

    let [date, time] = exifDate.split(' ');
    date = date.replaceAll(':', '-');
    const exifDateAsIso = [date, time].join('T');

    const timezoneForLuxon = timezone ?? 'utc';

    const debug = {
        dateField,
        exifDate,
        exifDateAsIso,
        timezone,
        timezoneForLuxon
    };

    const dt = DateTime.fromISO(exifDateAsIso, { zone: timezoneForLuxon });
    if (!dt.isValid) return { error: dt.invalidExplanation, debug };

    iso = timezone ? dt.toISO({ suppressMilliseconds: true }) : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    return { iso, timezone, debug };

};

