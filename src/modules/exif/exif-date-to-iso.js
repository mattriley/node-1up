const { DateTime } = require('luxon');

module.exports = ({ obj }) => args => {

    args.data ??= {};
    args.data.exif ??= {};
    args.dateTimeSource ??= 'exif.DateTimeOriginal';

    const { data, dateTimeSource, timezone } = args;

    const sourceDateTime = obj.dig(data, dateTimeSource);
    if (!sourceDateTime) return { dateTimeSource, error: 'Date Time Source not found' };

    let [date, time] = sourceDateTime.split(' ');
    date = date.replaceAll(':', '-');
    const sourceDateTimeAsIso = [date, time].join('T');

    const timezoneForLuxon = timezone ?? 'utc';

    const debug = {
        dateTimeSource,
        sourceDateTime,
        sourceDateTimeAsIso,
        timezone,
        timezoneForLuxon
    };

    const dt = DateTime.fromISO(sourceDateTimeAsIso, { zone: timezoneForLuxon });
    if (!dt.isValid) return { error: dt.invalidExplanation, debug };

    const iso = timezone ? dt.toISO({ suppressMilliseconds: true }) : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    return { iso, timezone, debug };

};

