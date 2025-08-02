const { DateTime } = require('luxon');

module.exports = ({ obj }) => args => {

    args.data ??= {};
    args.data.exif ??= {};
    args.dateSource ??= 'exif.GPSDateStamp';
    args.timeSource ??= 'exif.GPSTimeStamp';

    const { data, dateSource, timeSource, timezone } = args;

    let sourceDate = obj.dig(data, dateSource);
    if (!sourceDate) return { dateSource, error: 'Date Source not found' };

    const sourceTime = obj.dig(data, timeSource);
    if (!sourceTime) return { timeSource, error: 'Time Source not found' };

    // Normalize date string (EXIF format: "YYYY:MM:DD")
    const sourceDateAsIso = sourceDate.replaceAll(':', '-');

    // Convert time array to HH:MM:SS
    const [h = 0, m = 0, s = 0] = sourceTime.map(Math.floor);
    const sourceTimeAsIso = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
    const sourceDateTimeAsIso = `${sourceDateAsIso}T${sourceTimeAsIso}`;

    const timezoneForLuxon = timezone ?? 'utc';

    const debug = {
        dateSource,
        sourceDate,
        sourceDateAsIso,
        timeSource,
        sourceTime,
        sourceTimeAsIso,
        sourceDateTimeAsIso,
        timezoneForLuxon
    }

    const dt = DateTime.fromISO(sourceDateTimeAsIso, { zone: timezoneForLuxon });
    if (!dt.isValid) return { error: dt.invalidExplanation, debug };

    const iso = timezone ? dt.toISO({ suppressMilliseconds: true }) : dt.toFormat("yyyy-MM-dd'T'HH:mm:ss");
    return { iso, timezone, debug };

};
