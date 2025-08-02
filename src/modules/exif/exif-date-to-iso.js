const { DateTime } = require('luxon');

module.exports = ({ obj }) => args => {

    args.data ??= {};
    args.data.exif ??= {};
    args.source ??= 'exif.DateTimeOriginal';

    const { data, source, timezone } = args;
    const sourceDate = obj.dig(data, source);
    if (!sourceDate) return { source, error: 'Source not found' };

    let [date, time] = sourceDate.split(' ');
    date = date.replaceAll(':', '-');
    const sourceDateAsIso = [date, time].join('T');

    const timezoneForLuxon = timezone ?? 'utc';

    const debug = {
        sourceDate,
        sourceDateAsIso,
        timezone,
        timezoneForLuxon
    };

    const dt = DateTime.fromISO(sourceDateAsIso, { zone: timezoneForLuxon });
    if (!dt.isValid) return { error: dt.invalidExplanation, debug };

    iso = timezone ? dt.toISO({ suppressMilliseconds: true }) : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    return { iso, timezone, source, debug };

};

